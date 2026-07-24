# flake8: noqa: E501
from django.db import migrations


ARTICLE_FAQ_BLOCKS = [
    (
        "title",
        "Questions & answers",
        "Вопросы и ответы",
        "Jautājumi un atbildes",
    ),
]

CONTACT_REQUEST_TYPE_BLOCKS = [
    (
        "requestTypeCooperation",
        "Cooperation",
        "Сотрудничество",
        "Sadarbība",
    ),
    (
        "requestTypeCommercial",
        "Commercial offer",
        "Коммерческое предложение",
        "Komerciālais piedāvājums",
    ),
]


def forwards(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    for key, text_en, text_ru, text_lv in ARTICLE_FAQ_BLOCKS:
        SiteTextBlock.objects.update_or_create(
            page="blog",
            block="article_faq",
            key=key,
            defaults={
                "text_en": text_en,
                "text_ru": text_ru,
                "text_lv": text_lv,
            },
        )
    for key, text_en, text_ru, text_lv in CONTACT_REQUEST_TYPE_BLOCKS:
        SiteTextBlock.objects.update_or_create(
            page="contact",
            block="request_types",
            key=key,
            defaults={
                "text_en": text_en,
                "text_ru": text_ru,
                "text_lv": text_lv,
            },
        )


def backwards(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    SiteTextBlock.objects.filter(page="blog", block="article_faq").delete()
    SiteTextBlock.objects.filter(
        page="contact",
        block="request_types",
        key__in=["requestTypeCooperation", "requestTypeCommercial"],
    ).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0040_legal_privacy_site_text_blocks"),
    ]

    operations = [
        migrations.RunPython(forwards, backwards),
    ]
