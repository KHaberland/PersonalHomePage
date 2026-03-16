# Generated data migration - initial blog categories

from django.db import migrations


def create_initial_categories(apps, schema_editor):
    Category = apps.get_model("blog", "Category")
    categories = [
        {
            "name_en": "Welding technology",
            "name_ru": "Технология сварки",
            "name_lv": "Metināšanas tehnoloģija",
            "slug": "welding-technology",
        },
        {
            "name_en": "Shielding gases",
            "name_ru": "Защитные газы",
            "name_lv": "Aizsarggāzes",
            "slug": "shielding-gases",
        },
        {
            "name_en": "Welding equipment",
            "name_ru": "Сварочное оборудование",
            "name_lv": "Metināšanas iekārtas",
            "slug": "welding-equipment",
        },
        {
            "name_en": "Gas cutting",
            "name_ru": "Газовая резка",
            "name_lv": "Gāzes griešana",
            "slug": "gas-cutting",
        },
        {
            "name_en": "Welding defects",
            "name_ru": "Дефекты сварки",
            "name_lv": "Metināšanas defekti",
            "slug": "welding-defects",
        },
    ]
    for cat in categories:
        Category.objects.get_or_create(slug=cat["slug"], defaults=cat)


def reverse_categories(apps, schema_editor):
    Category = apps.get_model("blog", "Category")
    Category.objects.filter(
        slug__in=[
            "welding-technology",
            "shielding-gases",
            "welding-equipment",
            "gas-cutting",
            "welding-defects",
        ]
    ).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("blog", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(create_initial_categories, reverse_categories),
    ]
