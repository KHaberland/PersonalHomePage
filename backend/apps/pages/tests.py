from django.contrib.auth import get_user_model
from django.test import Client, TestCase, override_settings
from django.urls import reverse

from .admin import SolutionColumnGroupAdmin
from .cms_preview_registry import build_preview_url, get_preview_route
from .models import (
    COLUMN_ANALYSIS,
    COLUMN_CAUSE,
    COLUMN_PROBLEM,
    COLUMN_RESULT,
    COLUMN_SOLUTION,
    SEOMetadata,
    SiteTextBlock,
    SolutionBullet,
    SolutionColumnGroup,
    SolutionSection,
)
from .views import build_solution_section_blocks


class CmsPreviewRegistryTests(TestCase):
    def test_build_preview_url_for_home_hero(self):
        url = build_preview_url("home", "hero", locale="ru")
        self.assertEqual(url, "http://localhost:3000/ru/#hero")

    def test_build_preview_url_for_home_about_teaser(self):
        url = build_preview_url("home", "about_teaser", locale="ru")
        self.assertEqual(url, "http://localhost:3000/ru/#problem-value")

    def test_build_preview_url_for_home_entry_paths(self):
        url = build_preview_url("home", "entry_paths", locale="ru")
        self.assertEqual(url, "http://localhost:3000/ru/#user-paths")

    def test_build_preview_url_for_solutions_section(self):
        url = build_preview_url(
            "solutions",
            "section_defectReduction",
            locale="ru",
        )
        self.assertEqual(
            url,
            "http://localhost:3000/ru/solutions#solutions-defect-reduction",
        )

    def test_unknown_page_returns_none(self):
        self.assertIsNone(build_preview_url("missing", "hero"))

    def test_unknown_block_falls_back_to_page_path(self):
        route = get_preview_route("about", "hero")
        self.assertIsNotNone(route)
        self.assertEqual(route.path, "/about")
        self.assertIsNone(route.anchor)

        url = build_preview_url("about", "hero", locale="en")
        self.assertEqual(url, "http://localhost:3000/en/about")

    def test_build_preview_url_for_experience_cases(self):
        url = build_preview_url("experience", "cases", locale="ru")
        self.assertEqual(url, "http://localhost:3000/ru/experience#cases")


class CmsAdminLinkViewTests(TestCase):
    def setUp(self):
        SiteTextBlock.objects.all().delete()

    @override_settings(DEBUG=True)
    def test_returns_change_url_when_block_exists(self):
        block = SiteTextBlock.objects.create(
            page=SiteTextBlock.Page.HOME,
            block="hero",
            key="title",
            text_en="Title",
        )
        response = self.client.get(
            reverse("cms-admin-link"),
            {"page": "home", "block": "hero", "key": "title"},
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn(
            f"/admin/pages/sitetextblock/{block.pk}/change/",
            response.json()["url"],
        )

    @override_settings(DEBUG=True)
    def test_returns_changelist_when_block_missing(self):
        response = self.client.get(
            reverse("cms-admin-link"),
            {"page": "home", "block": "hero", "key": "missing"},
        )

        self.assertEqual(response.status_code, 200)
        url = response.json()["url"]
        self.assertIn("/admin/pages/sitetextblock/", url)
        self.assertIn("page__exact=home", url)

    @override_settings(DEBUG=False)
    def test_returns_404_when_not_debug(self):
        response = self.client.get(
            reverse("cms-admin-link"),
            {"page": "home", "block": "hero", "key": "title"},
        )

        self.assertEqual(response.status_code, 404)


class PageContentViewTests(TestCase):
    def setUp(self):
        SiteTextBlock.objects.all().delete()

    def test_returns_page_content_grouped_by_block_with_language_fallback(self):
        SiteTextBlock.objects.create(
            page=SiteTextBlock.Page.HOME,
            block="hero",
            key="title",
            text_en="English title",
            text_ru="Русский заголовок",
        )
        SiteTextBlock.objects.create(
            page=SiteTextBlock.Page.HOME,
            block="hero",
            key="subtitle",
            text_en="English subtitle",
            text_ru="",
        )
        SiteTextBlock.objects.create(
            page=SiteTextBlock.Page.HOME,
            block="cta",
            key="title",
            text_en="English CTA",
            text_ru="Русский CTA",
        )
        SiteTextBlock.objects.create(
            page=SiteTextBlock.Page.ABOUT,
            block="hero",
            key="title",
            text_en="About title",
        )

        response = self.client.get(
            reverse("page-content", kwargs={"page": SiteTextBlock.Page.HOME}),
            {"lang": "ru"},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json(),
            {
                "cta": {
                    "title": "Русский CTA",
                },
                "hero": {
                    "subtitle": "English subtitle",
                    "title": "Русский заголовок",
                },
            },
        )

    def test_returns_empty_object_for_unknown_page(self):
        response = self.client.get(
            reverse("page-content", kwargs={"page": "missing"}),
            {"lang": "lv"},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {})


class SolutionsPageContentViewTests(TestCase):
    """API adapter: section_* from SolutionSection models, not SiteTextBlock."""

    def setUp(self):
        SiteTextBlock.objects.filter(page=SiteTextBlock.Page.SOLUTIONS).delete()
        SolutionSection.objects.all().delete()

    def _seed_site_text_section(self, item_key, title_ru, problems_ru):
        block = f"section_{item_key}"
        SiteTextBlock.objects.create(
            page=SiteTextBlock.Page.SOLUTIONS,
            block=block,
            key="title",
            text_en="English title",
            text_ru=title_ru,
        )
        for index, text_ru in enumerate(problems_ru, start=1):
            SiteTextBlock.objects.create(
                page=SiteTextBlock.Page.SOLUTIONS,
                block=block,
                key=f"problems_{index}",
                text_en=f"Problem {index} EN",
                text_ru=text_ru,
            )

    def _seed_model_section(self, item_key, title_ru, problems_ru):
        section = SolutionSection.objects.create(
            item_key=item_key,
            order=0,
            title_en="English title",
            title_ru=title_ru,
        )
        group = SolutionColumnGroup.objects.create(
            section=section,
            column=COLUMN_PROBLEM,
        )
        for index, text_ru in enumerate(problems_ru, start=1):
            SolutionBullet.objects.create(
                group=group,
                order=index,
                text_en=f"Problem {index} EN",
                text_ru=text_ru,
            )
        return section

    def _site_text_baseline(self, lang):
        content = {}
        blocks = SiteTextBlock.objects.filter(
            page=SiteTextBlock.Page.SOLUTIONS
        ).order_by("block", "key")
        for block in blocks:
            section = content.setdefault(block.block, {})
            en_text = block.text_en or ""
            if lang == "en":
                section[block.key] = en_text
            else:
                localized = getattr(block, f"text_{lang}", "") or ""
                section[block.key] = localized if localized.strip() else en_text
        return content

    def test_section_blocks_match_site_text_baseline(self):
        item_key = "gasSelection"
        title = "Подбор защитных газов"
        problems = ["Пористость", "Разбрызгивание", "Высокий расход газа"]
        self._seed_site_text_section(item_key, title, problems)
        baseline = self._site_text_baseline("ru")

        SolutionSection.objects.all().delete()
        self._seed_model_section(item_key, title, problems)

        response = self.client.get(
            reverse("page-content", kwargs={"page": SiteTextBlock.Page.SOLUTIONS}),
            {"lang": "ru"},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json()[f"section_{item_key}"],
            baseline[f"section_{item_key}"],
        )

    def test_section_blocks_ignore_stale_site_text(self):
        item_key = "processOptimization"
        self._seed_site_text_section(
            item_key,
            "Старый заголовок",
            ["Старая проблема"],
        )
        self._seed_model_section(
            item_key,
            "Новый заголовок",
            ["Новая проблема"],
        )

        response = self.client.get(
            reverse("page-content", kwargs={"page": SiteTextBlock.Page.SOLUTIONS}),
            {"lang": "ru"},
        )

        section = response.json()[f"section_{item_key}"]
        self.assertEqual(section["title"], "Новый заголовок")
        self.assertEqual(section["problems_1"], "Новая проблема")

    def test_non_section_blocks_still_from_site_text(self):
        SiteTextBlock.objects.create(
            page=SiteTextBlock.Page.SOLUTIONS,
            block="hero",
            key="title",
            text_en="Solutions",
            text_ru="Решения",
        )
        self._seed_model_section("defectReduction", "Снижение дефектов", ["Брак"])

        response = self.client.get(
            reverse("page-content", kwargs={"page": SiteTextBlock.Page.SOLUTIONS}),
            {"lang": "ru"},
        )

        data = response.json()
        self.assertEqual(data["hero"]["title"], "Решения")
        self.assertIn("section_defectReduction", data)

    def test_expected_result_label_renamed(self):
        SiteTextBlock.objects.create(
            page=SiteTextBlock.Page.SOLUTIONS,
            block="labels",
            key="expectedResult",
            text_en="Result",
            text_ru="Результат",
            text_lv="Rezultāts",
        )

        for lang, expected in (
            ("ru", "Результат"),
            ("en", "Result"),
            ("lv", "Rezultāts"),
        ):
            with self.subTest(lang=lang):
                response = self.client.get(
                    reverse(
                        "page-content",
                        kwargs={"page": SiteTextBlock.Page.SOLUTIONS},
                    ),
                    {"lang": lang},
                )
                self.assertEqual(
                    response.json()["labels"]["expectedResult"],
                    expected,
                )

    def test_language_fallback_matches_site_text(self):
        section = SolutionSection.objects.create(
            item_key="training",
            order=3,
            title_en="Training title EN",
            title_ru="",
        )
        group = SolutionColumnGroup.objects.create(
            section=section,
            column=COLUMN_CAUSE,
        )
        SolutionBullet.objects.create(
            group=group,
            order=1,
            text_en="Cause EN",
            text_ru="",
        )

        response = self.client.get(
            reverse("page-content", kwargs={"page": SiteTextBlock.Page.SOLUTIONS}),
            {"lang": "ru"},
        )

        section_data = response.json()["section_training"]
        self.assertEqual(section_data["title"], "Training title EN")
        self.assertEqual(section_data["causes_1"], "Cause EN")

    def test_build_solution_section_blocks_all_columns(self):
        section = SolutionSection.objects.create(
            item_key="wpsSupport",
            order=4,
            title_en="WPS EN",
            title_ru="WPS RU",
        )
        columns = [
            (COLUMN_PROBLEM, "problems", "Problem"),
            (COLUMN_CAUSE, "causes", "Cause"),
            (COLUMN_ANALYSIS, "analysisItems", "Analysis"),
            (COLUMN_SOLUTION, "solutionSteps", "Step"),
            (COLUMN_RESULT, "expectedResults", "Result"),
        ]
        for column, prefix, label in columns:
            group = SolutionColumnGroup.objects.create(
                section=section,
                column=column,
            )
            SolutionBullet.objects.create(
                group=group,
                order=1,
                text_en=f"{label} EN",
                text_ru=f"{label} RU",
            )

        blocks = build_solution_section_blocks("ru")
        section_block = blocks["section_wpsSupport"]
        self.assertEqual(section_block["title"], "WPS RU")
        for _, prefix, label in columns:
            self.assertEqual(section_block[f"{prefix}_1"], f"{label} RU")

    def test_gas_selection_extra_bullets_preserved(self):
        """Smoke: causes_3 and solutionSteps_3 keys (migration extras)."""
        section = SolutionSection.objects.create(
            item_key="gasSelection",
            order=2,
            title_en="Gas EN",
            title_ru="Gas RU",
        )
        causes = SolutionColumnGroup.objects.create(
            section=section,
            column=COLUMN_CAUSE,
        )
        for order in (1, 2, 3):
            SolutionBullet.objects.create(
                group=causes,
                order=order,
                text_en=f"Cause {order}",
                text_ru=f"Причина {order}",
            )
        steps = SolutionColumnGroup.objects.create(
            section=section,
            column=COLUMN_SOLUTION,
        )
        SolutionBullet.objects.create(
            group=steps,
            order=3,
            text_en="Step 3",
            text_ru="Шаг 3",
        )

        response = self.client.get(
            reverse("page-content", kwargs={"page": SiteTextBlock.Page.SOLUTIONS}),
            {"lang": "ru"},
        )

        section_data = response.json()["section_gasSelection"]
        self.assertEqual(section_data["causes_3"], "Причина 3")
        self.assertEqual(section_data["solutionSteps_3"], "Шаг 3")


class SolutionsEditMapViewTests(TestCase):
    def setUp(self):
        SolutionSection.objects.all().delete()

    def test_returns_section_and_column_group_ids(self):
        section = SolutionSection.objects.create(
            item_key="defectReduction",
            order=0,
            title_ru="Снижение дефектности",
        )
        problem_group = SolutionColumnGroup.objects.create(
            section=section,
            column=COLUMN_PROBLEM,
        )
        cause_group = SolutionColumnGroup.objects.create(
            section=section,
            column=COLUMN_CAUSE,
        )

        response = self.client.get(reverse("solutions-edit-map"))

        self.assertEqual(response.status_code, 200)
        data = response.json()
        section_map = data["sections"]["defectReduction"]
        self.assertEqual(section_map["sectionId"], section.pk)
        self.assertEqual(section_map["columns"]["problems"], problem_group.pk)
        self.assertEqual(section_map["columns"]["causes"], cause_group.pk)

    def test_returns_empty_sections_when_no_data(self):
        response = self.client.get(reverse("solutions-edit-map"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"sections": {}})


class SEOMetadataViewTests(TestCase):
    def setUp(self):
        SEOMetadata.objects.all().delete()

    def test_returns_seo_metadata_for_requested_language(self):
        SEOMetadata.objects.create(
            page=SEOMetadata.Page.HOME,
            language=SEOMetadata.Language.RU,
            title="Русский title",
            description="Русское description",
        )

        response = self.client.get(
            reverse("seo-metadata", kwargs={"page": SEOMetadata.Page.HOME}),
            {"lang": "ru"},
        )

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["page"], "home")
        self.assertEqual(data["language"], "ru")
        self.assertEqual(data["title"], "Русский title")
        self.assertEqual(data["description"], "Русское description")

    def test_unsupported_language_falls_back_to_english(self):
        SEOMetadata.objects.create(
            page=SEOMetadata.Page.HOME,
            language=SEOMetadata.Language.EN,
            title="English title",
            description="English description",
        )

        response = self.client.get(
            reverse("seo-metadata", kwargs={"page": SEOMetadata.Page.HOME}),
            {"lang": "de"},
        )

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["language"], "en")
        self.assertEqual(data["title"], "English title")

    def test_returns_404_for_missing_page_metadata(self):
        response = self.client.get(
            reverse("seo-metadata", kwargs={"page": "missing"}),
            {"lang": "lv"},
        )

        self.assertEqual(response.status_code, 404)


class SolutionColumnGroupAdminTests(TestCase):
    def setUp(self):
        SolutionSection.objects.all().delete()
        self.section = SolutionSection.objects.create(
            item_key="processOptimization",
            order=1,
            title_ru="Оптимизация сварочного процесса",
            title_en="Process optimization",
        )
        self.group = SolutionColumnGroup.objects.create(
            section=self.section,
            column=COLUMN_PROBLEM,
        )
        self.bullet_one = SolutionBullet.objects.create(
            group=self.group,
            order=1,
            text_ru="Проблема 1",
        )
        self.bullet_three = SolutionBullet.objects.create(
            group=self.group,
            order=3,
            text_ru="Проблема 2",
        )

    def test_normalizes_bullet_order_after_inline_save(self):
        admin_instance = SolutionColumnGroupAdmin(SolutionColumnGroup, None)
        formset = type(
            "FormSet",
            (),
            {"model": SolutionBullet, "save": lambda self: None},
        )()

        class Form:
            instance = self.group

        admin_instance.save_formset(None, Form(), formset, change=True)

        orders = list(
            self.group.bullets.order_by("order").values_list("order", flat=True)
        )
        self.assertEqual(orders, [1, 2])

    @override_settings(DEBUG=True)
    def test_changelist_accessible_for_staff(self):
        user_model = get_user_model()
        user = user_model.objects.create_superuser(
            username="admin",
            email="admin@example.com",
            password="secret",
        )
        client = Client()
        client.force_login(user)

        response = client.get(
            reverse("admin:pages_solutioncolumngroup_changelist"),
        )

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Оптимизация сварочного процесса")

    def test_has_add_permission_is_false(self):
        admin_instance = SolutionColumnGroupAdmin(SolutionColumnGroup, None)
        self.assertFalse(admin_instance.has_add_permission(None))


class SiteTextBlockAdminDeprecatedTests(TestCase):
    def setUp(self):
        SiteTextBlock.objects.filter(
            page=SiteTextBlock.Page.SOLUTIONS,
            block__startswith="section_",
        ).delete()
        SiteTextBlock.objects.filter(
            page=SiteTextBlock.Page.SOLUTIONS,
            block="hero",
            key="title",
        ).delete()
        self.deprecated = SiteTextBlock.objects.create(
            page=SiteTextBlock.Page.SOLUTIONS,
            block="section_defectReduction",
            key="title",
            text_en="Deprecated title",
            text_ru="Устаревший заголовок",
        )
        self.active = SiteTextBlock.objects.create(
            page=SiteTextBlock.Page.SOLUTIONS,
            block="hero",
            key="title",
            text_en="Solutions hero",
            text_ru="Решения",
        )
        user_model = get_user_model()
        self.user = user_model.objects.create_superuser(
            username="admin-deprecated",
            email="deprecated@example.com",
            password="secret",
        )
        self.admin_client = Client()
        self.admin_client.force_login(self.user)

    def test_changelist_excludes_deprecated_solutions_section_blocks(self):
        response = self.admin_client.get(
            reverse("admin:pages_sitetextblock_changelist"),
        )

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "hero")
        self.assertNotContains(response, "section_defectReduction")
        self.assertNotContains(response, "Устаревший заголовок")

    def test_change_view_not_found_for_deprecated_block(self):
        response = self.admin_client.get(
            reverse(
                "admin:pages_sitetextblock_change",
                args=[self.deprecated.pk],
            ),
        )

        self.assertNotEqual(response.status_code, 200)

    def test_active_solutions_blocks_remain_editable(self):
        response = self.admin_client.get(
            reverse(
                "admin:pages_sitetextblock_change",
                args=[self.active.pk],
            ),
        )

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Solutions hero")
