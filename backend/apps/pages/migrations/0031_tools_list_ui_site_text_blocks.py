# flake8: noqa: E501
from django.db import migrations


TOOLS_LIST_UI_BLOCKS = [
    ("toolsEyebrow", "Truth layer", "Слой расчётов", "Aprēķinu slānis"),
    ("toolsTitle", "Tools", "Инструменты", "Rīki"),
    (
        "toolsDescription",
        "Deterministic calculators for inputs, outputs, units, limits, and quick parameter validation.",
        "Детерминированные калькуляторы для вводных данных, результатов, единиц, ограничений и быстрой проверки параметров.",
        "Deterministiski kalkulatori ievadei, izvadei, vienībām, ierobežojumiem un ātrai parametru pārbaudei.",
    ),
    ("toolsCta", "Open calculator", "Открыть калькулятор", "Atvērt kalkulatoru"),
]


def seed_tools_list_ui(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    for key, text_en, text_ru, text_lv in TOOLS_LIST_UI_BLOCKS:
        SiteTextBlock.objects.update_or_create(
            page="tools",
            block="list_intro",
            key=key,
            defaults={
                "text_en": text_en,
                "text_ru": text_ru,
                "text_lv": text_lv,
            },
        )


def remove_tools_list_ui(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    SiteTextBlock.objects.filter(
        page="tools",
        block="list_intro",
        key__in=[key for key, *_ in TOOLS_LIST_UI_BLOCKS],
    ).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0030_blog_ui_site_text_blocks"),
    ]

    operations = [
        migrations.RunPython(seed_tools_list_ui, remove_tools_list_ui),
    ]
