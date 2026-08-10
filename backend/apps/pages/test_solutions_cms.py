"""Stage 8: automated tests for Solutions CMS migration, API, and admin."""

from importlib import import_module

from django.apps import apps
from django.test import TestCase
from django.urls import reverse

from .admin import SolutionColumnGroupAdmin, SolutionSectionAdmin
from .models import (
    COLUMN_ANALYSIS,
    COLUMN_CAUSE,
    COLUMN_PROBLEM,
    COLUMN_RESULT,
    COLUMN_SOLUTION,
    SiteTextBlock,
    SolutionBullet,
    SolutionColumnGroup,
    SolutionSection,
)

_migration = import_module(
    "apps.pages.migrations.0050_migrate_solutions_site_text_to_models"
)
migrate_solutions_from_site_text = _migration.migrate_solutions_from_site_text
revert_solutions_from_site_text = _migration.revert_solutions_from_site_text

GAS_CAUSES_3_RU = (
    "Расход газа, конфигурация сопла и вылет электрода не согласованы "
    "с материалом, процессом и требованиями к качеству шва на рабочем месте."
)
GAS_SOLUTION_STEP_3_RU = (
    "Зафиксировать для производства рекомендованную смесь, расход газа "
    "и настройки оборудования с учётом условий защиты."
)


class SolutionsDataMigrationTests(TestCase):
    def setUp(self):
        SiteTextBlock.objects.filter(
            page=SiteTextBlock.Page.SOLUTIONS,
            block__startswith="section_",
        ).delete()
        SolutionSection.objects.all().delete()

    def _seed_gas_selection_site_text(self):
        block = "section_gasSelection"
        SiteTextBlock.objects.create(
            page=SiteTextBlock.Page.SOLUTIONS,
            block=block,
            key="title",
            text_en="Gas selection",
            text_ru="Подбор защитных газов",
        )
        for index, text_ru in enumerate(
            ("Причина 1", "Причина 2", GAS_CAUSES_3_RU),
            start=1,
        ):
            SiteTextBlock.objects.create(
                page=SiteTextBlock.Page.SOLUTIONS,
                block=block,
                key=f"causes_{index}",
                text_en=f"Cause {index} EN",
                text_ru=text_ru,
            )
        SiteTextBlock.objects.create(
            page=SiteTextBlock.Page.SOLUTIONS,
            block=block,
            key="solutionSteps_3",
            text_en="Step 3 EN",
            text_ru=GAS_SOLUTION_STEP_3_RU,
        )

    def test_migrate_preserves_gas_causes_3_and_solution_steps_3(self):
        self._seed_gas_selection_site_text()

        migrate_solutions_from_site_text(apps, None)

        section = SolutionSection.objects.get(item_key="gasSelection")
        causes_group = SolutionColumnGroup.objects.get(
            section=section,
            column=COLUMN_CAUSE,
        )
        steps_group = SolutionColumnGroup.objects.get(
            section=section,
            column=COLUMN_SOLUTION,
        )

        cause_three = SolutionBullet.objects.get(group=causes_group, order=3)
        step_three = SolutionBullet.objects.get(group=steps_group, order=3)

        self.assertEqual(cause_three.text_ru, GAS_CAUSES_3_RU)
        self.assertEqual(step_three.text_ru, GAS_SOLUTION_STEP_3_RU)

        response = self.client.get(
            reverse("page-content", kwargs={"page": SiteTextBlock.Page.SOLUTIONS}),
            {"lang": "ru"},
        )
        section_data = response.json()["section_gasSelection"]
        self.assertEqual(section_data["causes_3"], GAS_CAUSES_3_RU)
        self.assertEqual(section_data["solutionSteps_3"], GAS_SOLUTION_STEP_3_RU)

    def test_migrate_skips_when_sections_already_exist(self):
        self._seed_gas_selection_site_text()
        SolutionSection.objects.create(item_key="existing", order=99)

        migrate_solutions_from_site_text(apps, None)

        self.assertEqual(SolutionSection.objects.count(), 1)
        self.assertFalse(
            SolutionSection.objects.filter(item_key="gasSelection").exists()
        )

    def test_revert_deletes_all_sections(self):
        self._seed_gas_selection_site_text()
        migrate_solutions_from_site_text(apps, None)
        self.assertTrue(SolutionSection.objects.exists())

        revert_solutions_from_site_text(apps, None)

        self.assertEqual(SolutionSection.objects.count(), 0)


class SolutionsApiShapeTests(TestCase):
    def setUp(self):
        SiteTextBlock.objects.filter(page=SiteTextBlock.Page.SOLUTIONS).delete()
        SolutionSection.objects.all().delete()

    def test_section_processOptimization_contains_expected_keys(self):
        section = SolutionSection.objects.create(
            item_key="processOptimization",
            order=1,
            title_en="Process optimization EN",
            title_ru="Оптимизация процесса",
        )
        columns = [
            (COLUMN_PROBLEM, "problems", "Проблема 1"),
            (COLUMN_CAUSE, "causes", "Причина 1"),
            (COLUMN_ANALYSIS, "analysisItems", "Анализ 1"),
            (COLUMN_SOLUTION, "solutionSteps", "Шаг 1"),
            (COLUMN_RESULT, "expectedResults", "Результат 1"),
        ]
        for column, _, text_ru in columns:
            group = SolutionColumnGroup.objects.create(
                section=section,
                column=column,
            )
            SolutionBullet.objects.create(
                group=group,
                order=1,
                text_en="EN",
                text_ru=text_ru,
            )

        response = self.client.get(
            reverse("page-content", kwargs={"page": SiteTextBlock.Page.SOLUTIONS}),
            {"lang": "ru"},
        )

        block = response.json()["section_processOptimization"]
        self.assertEqual(block["title"], "Оптимизация процесса")
        for _, prefix, text_ru in columns:
            self.assertEqual(block[f"{prefix}_1"], text_ru)


class SolutionSectionAdminTests(TestCase):
    def setUp(self):
        SolutionSection.objects.all().delete()

    def _create_sections(self, count):
        keys = [
            "defectReduction",
            "processOptimization",
            "gasSelection",
            "training",
            "wpsSupport",
            "extraSection",
        ]
        for index in range(count):
            SolutionSection.objects.create(
                item_key=keys[index],
                order=index,
            )

    def test_has_add_permission_true_when_fewer_than_five_sections(self):
        self._create_sections(4)
        admin_instance = SolutionSectionAdmin(SolutionSection, None)
        self.assertTrue(admin_instance.has_add_permission(None))

    def test_has_add_permission_false_when_five_sections_exist(self):
        self._create_sections(5)
        admin_instance = SolutionSectionAdmin(SolutionSection, None)
        self.assertFalse(admin_instance.has_add_permission(None))


class SolutionColumnGroupAdminPermissionTests(TestCase):
    def setUp(self):
        SolutionSection.objects.all().delete()

    def test_has_add_permission_false_even_with_fewer_than_25_groups(self):
        section = SolutionSection.objects.create(
            item_key="defectReduction",
            order=0,
        )
        SolutionColumnGroup.objects.create(
            section=section,
            column=COLUMN_PROBLEM,
        )
        admin_instance = SolutionColumnGroupAdmin(SolutionColumnGroup, None)
        self.assertFalse(admin_instance.has_add_permission(None))

    def test_has_add_permission_false_with_full_25_groups(self):
        for order, item_key in enumerate(
            (
                "defectReduction",
                "processOptimization",
                "gasSelection",
                "training",
                "wpsSupport",
            )
        ):
            section = SolutionSection.objects.create(
                item_key=item_key,
                order=order,
            )
            for column in (
                COLUMN_PROBLEM,
                COLUMN_CAUSE,
                COLUMN_ANALYSIS,
                COLUMN_SOLUTION,
                COLUMN_RESULT,
            ):
                SolutionColumnGroup.objects.create(
                    section=section,
                    column=column,
                )

        self.assertEqual(SolutionColumnGroup.objects.count(), 25)
        admin_instance = SolutionColumnGroupAdmin(SolutionColumnGroup, None)
        self.assertFalse(admin_instance.has_add_permission(None))
