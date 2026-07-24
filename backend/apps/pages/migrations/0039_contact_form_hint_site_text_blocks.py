# flake8: noqa: E501
from django.db import migrations


CONTACT_FORM_BLOCKS = [
    (
        "formHint",
        "We will receive your message and respond by email.",
        "Мы получим ваше сообщение и ответим по email.",
        "Mēs saņemsim jūsu ziņu un atbildēsim pa e-pastu.",
    ),
    (
        "formSuccess",
        "Thank you! We received your request and will get back to you soon.",
        "Спасибо! Мы получили ваш запрос и свяжемся с вами.",
        "Paldies! Mēs saņēmām jūsu pieprasījumu un drīzumā sazināsimies.",
    ),
]


def seed_contact_form_blocks(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    for key, text_en, text_ru, text_lv in CONTACT_FORM_BLOCKS:
        SiteTextBlock.objects.update_or_create(
            page="contact",
            block="form",
            key=key,
            defaults={
                "text_en": text_en,
                "text_ru": text_ru,
                "text_lv": text_lv,
            },
        )


def remove_contact_form_blocks(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    SiteTextBlock.objects.filter(
        page="contact",
        block="form",
        key__in=[key for key, *_ in CONTACT_FORM_BLOCKS],
    ).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0038_blog_newsletter_site_text_blocks"),
    ]

    operations = [
        migrations.RunPython(seed_contact_form_blocks, remove_contact_form_blocks),
    ]
