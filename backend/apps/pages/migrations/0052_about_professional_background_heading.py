from django.db import migrations

KEY = "professionalBackground"
TEXT_EN = "Professional background"
TEXT_RU = "Профессиональный путь"
TEXT_LV = "Profesionālā pieredze"


def seed_bio_heading(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    SiteTextBlock.objects.update_or_create(
        page="about",
        block="ui",
        key=KEY,
        defaults={
            "text_en": TEXT_EN,
            "text_ru": TEXT_RU,
            "text_lv": TEXT_LV,
        },
    )


def remove_bio_heading(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    SiteTextBlock.objects.filter(page="about", block="ui", key=KEY).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0051_rename_solutions_expected_result_label"),
    ]

    operations = [
        migrations.RunPython(seed_bio_heading, remove_bio_heading),
    ]
