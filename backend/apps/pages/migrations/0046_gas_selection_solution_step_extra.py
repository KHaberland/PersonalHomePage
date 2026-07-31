# flake8: noqa: E501
from django.db import migrations


GAS_SELECTION_SOLUTION_STEP = (
    "solutionSteps_3",
    "Document the recommended gas mix, flow rate, and equipment settings for production, accounting for shielding conditions.",
    "Зафиксировать для производства рекомендованную смесь, расход газа и настройки оборудования с учётом условий защиты.",
    "Ražošanai fiksēt ieteicamo maisījumu, gāzes plūsmu un iekārtas iestatījumus, ņemot vērā aizsardzības apstākļus.",
)


def seed_gas_selection_solution_step(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    key, text_en, text_ru, text_lv = GAS_SELECTION_SOLUTION_STEP
    SiteTextBlock.objects.update_or_create(
        page="solutions",
        block="section_gasSelection",
        key=key,
        defaults={
            "text_en": text_en,
            "text_ru": text_ru,
            "text_lv": text_lv,
        },
    )


def revert_gas_selection_solution_step(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    SiteTextBlock.objects.filter(
        page="solutions",
        block="section_gasSelection",
        key="solutionSteps_3",
    ).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0045_gas_selection_causes_extra"),
    ]

    operations = [
        migrations.RunPython(
            seed_gas_selection_solution_step,
            revert_gas_selection_solution_step,
        ),
    ]
