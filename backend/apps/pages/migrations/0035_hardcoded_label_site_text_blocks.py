# flake8: noqa: E501
from django.db import migrations


COMMON_TEXT_BLOCKS = [
    ("brand", "name", "Oleg Suvorov", "Олег Суворов", "Olegs Suvorovs"),
    (
        "platforms",
        "linkedin",
        "LinkedIn",
        "LinkedIn",
        "LinkedIn",
    ),
    ("platforms", "youtube", "YouTube", "YouTube", "YouTube"),
    (
        "language",
        "switcherAriaLabel",
        "Language",
        "Язык",
        "Valoda",
    ),
]


CONTACT_TEXT_BLOCKS = [
    (
        "contact_methods",
        "linkedinPlatform",
        "LinkedIn",
        "LinkedIn",
        "LinkedIn",
    ),
    (
        "contact_methods",
        "youtubePlatform",
        "YouTube",
        "YouTube",
        "YouTube",
    ),
]


def upsert_blocks(apps, page, rows):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    for block, key, text_en, text_ru, text_lv in rows:
        SiteTextBlock.objects.update_or_create(
            page=page,
            block=block,
            key=key,
            defaults={
                "text_en": text_en,
                "text_ru": text_ru,
                "text_lv": text_lv,
            },
        )


def seed_hardcoded_label_text_blocks(apps, schema_editor):
    upsert_blocks(apps, "common", COMMON_TEXT_BLOCKS)
    upsert_blocks(apps, "contact", CONTACT_TEXT_BLOCKS)


def remove_hardcoded_label_text_blocks(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")

    for page, rows in (
        ("common", COMMON_TEXT_BLOCKS),
        ("contact", CONTACT_TEXT_BLOCKS),
    ):
        keys_by_block = {}
        for block, key, *_ in rows:
            keys_by_block.setdefault(block, []).append(key)

        for block, keys in keys_by_block.items():
            SiteTextBlock.objects.filter(page=page, block=block, key__in=keys).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0034_book_leftover_site_text_blocks"),
    ]

    operations = [
        migrations.RunPython(
            seed_hardcoded_label_text_blocks,
            remove_hardcoded_label_text_blocks,
        ),
    ]
