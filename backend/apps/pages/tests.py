from django.test import TestCase, override_settings
from django.urls import reverse

from .cms_preview_registry import build_preview_url, get_preview_route
from .models import SEOMetadata, SiteTextBlock


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
