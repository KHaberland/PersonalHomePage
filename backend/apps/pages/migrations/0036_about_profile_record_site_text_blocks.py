# flake8: noqa: E501
from django.db import migrations


ABOUT_PROFILE_RECORD_BLOCKS = [
    (
        "title",
        "Professional Profile Record",
        "Запись профессионального профиля",
        "Profesionālā profila ieraksts",
    ),
    ("versionLabel", "Version:", "Версия:", "Versija:"),
    ("version", "2026.1", "2026.1", "2026.1"),
    (
        "lastReviewedLabel",
        "Last reviewed:",
        "Последняя проверка:",
        "Pēdējo reizi pārskatīts:",
    ),
    ("lastReviewed", "July 2026", "Июль 2026", "2026. gada jūlijs"),
    (
        "description",
        "This profile is periodically updated based on professional experience, engineering projects and new qualifications.",
        "Этот профиль периодически обновляется на основе профессионального опыта, инженерных проектов и новых квалификаций.",
        "Šis profils periodiski tiek atjaunināts, balstoties uz profesionālo pieredzi, inženiertehniskajiem projektiem un jaunām kvalifikācijām.",
    ),
    (
        "footerUpdated",
        "Profile updated: July 2026",
        "Профиль обновлён: июль 2026",
        "Profils atjaunināts: 2026. gada jūlijs",
    ),
]


def seed_about_profile_record(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    for key, text_en, text_ru, text_lv in ABOUT_PROFILE_RECORD_BLOCKS:
        SiteTextBlock.objects.update_or_create(
            page="about",
            block="profile_record",
            key=key,
            defaults={
                "text_en": text_en,
                "text_ru": text_ru,
                "text_lv": text_lv,
            },
        )


def remove_about_profile_record(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    SiteTextBlock.objects.filter(
        page="about",
        block="profile_record",
        key__in=[key for key, *_ in ABOUT_PROFILE_RECORD_BLOCKS],
    ).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0035_hardcoded_label_site_text_blocks"),
    ]

    operations = [
        migrations.RunPython(seed_about_profile_record, remove_about_profile_record),
    ]
