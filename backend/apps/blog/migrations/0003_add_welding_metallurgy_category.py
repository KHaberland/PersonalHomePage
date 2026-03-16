# Generated migration - add Welding metallurgy category

from django.db import migrations


def add_welding_metallurgy(apps, schema_editor):
    Category = apps.get_model("blog", "Category")
    Category.objects.get_or_create(
        slug="welding-metallurgy",
        defaults={
            "name_en": "Welding metallurgy",
            "name_ru": "Сварочная металлургия",
            "name_lv": "Metināšanas metalurģija",
        },
    )


def remove_welding_metallurgy(apps, schema_editor):
    Category = apps.get_model("blog", "Category")
    Category.objects.filter(slug="welding-metallurgy").delete()


class Migration(migrations.Migration):

    dependencies = [
        ("blog", "0002_initial_categories"),
    ]

    operations = [
        migrations.RunPython(
            add_welding_metallurgy,
            remove_welding_metallurgy,
        ),
    ]
