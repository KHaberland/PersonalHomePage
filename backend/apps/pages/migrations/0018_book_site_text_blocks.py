# flake8: noqa: E501
from django.db import migrations


BOOK_TEXT_BLOCKS = [
    (
        "hero",
        "subtitle",
        "From equipment selection to shielding gas and welding methods",
        "От выбора аппарата до защитного газа и методов сварки",
        "No iekārtu izvēles līdz aizsarggāzei un metināšanas metodēm",
    ),
    (
        "authority",
        "authorityTitle",
        "Readers and teams",
        "Читатели и команды",
        "Lasītāji un komandas",
    ),
    (
        "authority",
        "authorityQuote",
        "“A practical bridge between equipment catalogues and what actually works in production — clear language, no filler.”",
        "«Практичный мост между каталогами оборудования и тем, что реально работает в производстве — без лишней воды.»",
        "«Praktiska saite starp iekārtu katalogiem un to, kas patiesi strādā ražošanā — bez liekas ūdens līšanas.»",
    ),
    (
        "authority",
        "authorityAttribution",
        "Typical feedback: engineers and shop leads who want repeatable MAG/MIG settings.",
        "Типичная обратная связь: инженеры и мастера, которым нужны воспроизводимые режимы MAG/MIG.",
        "Tipiska atgriezeniskā saite: inženieri un meistari, kam vajadzīgi atkārtojami MAG/MIG režīmi.",
    ),
    (
        "purchase",
        "purchaseTitle",
        "How to buy",
        "Как приобрести",
        "Kā iegādāties",
    ),
    (
        "purchase",
        "purchaseIntro",
        "The book is separate from consulting: use it as a fixed reference, not as a second blog or knowledge hub.",
        "Книга отделена от консультаций: используйте её как фиксированный справочный материал, а не как второй блог или базу знаний.",
        "Grāmata ir nošķirta no konsultācijām: izmantojiet to kā fiksētu atsauces materiālu, nevis kā otru blogu vai zināšanu bāzi.",
    ),
    (
        "cta",
        "cta",
        "Contact for purchase",
        "Связаться для приобретения",
        "Sazināties par iegādi",
    ),
    ("cta", "ctaEmail", "Email the author", "Написать на email", "Rakstīt e-pastu"),
    ("cta", "buyOnline", "Buy in store", "Купить в магазине", "Iegādāties veikalā"),
    (
        "cta",
        "downloadSample",
        "Download sample",
        "Скачать фрагмент",
        "Lejupielādēt fragmentu",
    ),
]


def seed_book_site_text_blocks(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")

    for block, key, text_en, text_ru, text_lv in BOOK_TEXT_BLOCKS:
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


def remove_book_site_text_blocks(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    keys_by_block = {}
    for block, key, *_ in BOOK_TEXT_BLOCKS:
        keys_by_block.setdefault(block, []).append(key)

    for block, keys in keys_by_block.items():
        SiteTextBlock.objects.filter(page="book", block=block, key__in=keys).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0017_home_site_text_blocks"),
    ]

    operations = [
        migrations.RunPython(seed_book_site_text_blocks, remove_book_site_text_blocks),
    ]
