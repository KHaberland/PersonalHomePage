# flake8: noqa: E501
from django.db import migrations


BOOK_LEFTOVER_TEXT_BLOCKS = [
    (
        "cover",
        "coverAlt",
        "Book cover: MAG/MIG welding",
        "Обложка книги «Сварка MAG/MIG»",
        "Grāmatas vāks «MAG/MIG metināšana»",
    ),
    (
        "cta",
        "emailSubjectBook",
        "MAG/MIG book order",
        "Заказ книги MAG/MIG",
        "Pasūtījums: grāmata MAG/MIG",
    ),
    (
        "preview",
        "previewTitle",
        "Inside the book",
        "Разворот книги",
        "Grāmatas izvērsums",
    ),
    (
        "preview",
        "previewCaption",
        "Illustrative spread — structure, diagrams, and worked examples for shop-floor use.",
        "Иллюстративный разворот — структура, схемы и примеры для цеха.",
        "Ilustratīvs izvērsums — struktūra, shēmas un piemēri darbnīcas lietošanai.",
    ),
]


def seed_book_leftover_text_blocks(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")

    for block, key, text_en, text_ru, text_lv in BOOK_LEFTOVER_TEXT_BLOCKS:
        SiteTextBlock.objects.update_or_create(
            page="book",
            block=block,
            key=key,
            defaults={
                "text_en": text_en,
                "text_ru": text_ru,
                "text_lv": text_lv,
            },
        )


def remove_book_leftover_text_blocks(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    keys_by_block = {}
    for block, key, *_ in BOOK_LEFTOVER_TEXT_BLOCKS:
        keys_by_block.setdefault(block, []).append(key)

    for block, keys in keys_by_block.items():
        SiteTextBlock.objects.filter(page="book", block=block, key__in=keys).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0033_common_ui_site_text_blocks"),
    ]

    operations = [
        migrations.RunPython(
            seed_book_leftover_text_blocks,
            remove_book_leftover_text_blocks,
        ),
    ]
