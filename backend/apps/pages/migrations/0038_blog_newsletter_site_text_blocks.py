# flake8: noqa: E501
from django.db import migrations


BLOG_NEWSLETTER_BLOCKS = [
    (
        "title",
        "Get new welding articles",
        "Получайте новые статьи по сварке",
        "Saņemiet jaunus metināšanas rakstus",
    ),
    (
        "lead",
        "Practical materials for welders and engineers",
        "Практические материалы для сварщиков и инженеров",
        "Praktiski materiāli metinātājiem un inženieriem",
    ),
    ("emailLabel", "Email", "Email", "E-pasts"),
    (
        "nameLabel",
        "Name (optional)",
        "Имя (необязательно)",
        "Vārds (neobligāti)",
    ),
    ("submit", "Subscribe", "Подписаться", "Abonēt"),
    (
        "success",
        "Thank you! Please check your email — we sent a confirmation message.",
        "Спасибо! Проверьте ваш email — мы отправили письмо для подтверждения.",
        "Paldies! Pārbaudiet savu e-pastu — mēs nosūtījām apstiprinājuma vēstuli.",
    ),
    (
        "privacyNote",
        "By subscribing, you agree to receive emails about new articles. You can unsubscribe in any message. See our privacy policy for details.",
        "Нажимая «Подписаться», вы соглашаетесь получать письма о новых статьях. Отписаться можно в любое письмо. Подробнее — в политике конфиденциальности.",
        "Nospiežot «Abonēt», jūs piekrītat saņemt e-pastus par jauniem rakstiem. Atrakstīties var jebkurā vēstulē. Plašāk — privātuma politikā.",
    ),
]

BLOG_ARTICLE_QUESTION_BLOCKS = [
    (
        "title",
        "Have a question about this topic?",
        "Есть вопрос по этой теме?",
        "Ir jautājums par šo tēmu?",
    ),
    ("nameLabel", "Name", "Имя", "Vārds"),
    ("emailLabel", "Email", "Email", "E-pasts"),
    (
        "questionLabel",
        "Your question",
        "Ваш вопрос",
        "Jūsu jautājums",
    ),
    (
        "subscribeLabel",
        "Get new welding articles",
        "Получать новые статьи по сварке",
        "Saņemt jaunus metināšanas rakstus",
    ),
    (
        "submit",
        "Send question",
        "Отправить вопрос",
        "Nosūtīt jautājumu",
    ),
    (
        "success",
        "Thank you! We received your question.",
        "Спасибо! Мы получили ваш вопрос.",
        "Paldies! Mēs saņēmām jūsu jautājumu.",
    ),
    (
        "privacyNote",
        "By sending a question, you agree to the processing of your data to provide an answer. See our privacy policy for details.",
        "Отправляя вопрос, вы соглашаетесь на обработку данных для ответа. Подробнее — в политике конфиденциальности.",
        "Nosūtot jautājumu, jūs piekrītat datu apstrādei, lai sniegtu atbildi. Plašāk — privātuma politikā.",
    ),
]


def _seed_blocks(SiteTextBlock, block, entries):
    for key, text_en, text_ru, text_lv in entries:
        SiteTextBlock.objects.update_or_create(
            page="blog",
            block=block,
            key=key,
            defaults={
                "text_en": text_en,
                "text_ru": text_ru,
                "text_lv": text_lv,
            },
        )


def _remove_blocks(SiteTextBlock, block, entries):
    SiteTextBlock.objects.filter(
        page="blog",
        block=block,
        key__in=[key for key, *_ in entries],
    ).delete()


def seed_blog_newsletter_blocks(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    _seed_blocks(SiteTextBlock, "newsletter", BLOG_NEWSLETTER_BLOCKS)
    _seed_blocks(SiteTextBlock, "article_question", BLOG_ARTICLE_QUESTION_BLOCKS)


def remove_blog_newsletter_blocks(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    _remove_blocks(SiteTextBlock, "newsletter", BLOG_NEWSLETTER_BLOCKS)
    _remove_blocks(SiteTextBlock, "article_question", BLOG_ARTICLE_QUESTION_BLOCKS)


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0037_shielding_gas_wizard_site_text_blocks"),
    ]

    operations = [
        migrations.RunPython(
            seed_blog_newsletter_blocks,
            remove_blog_newsletter_blocks,
        ),
    ]
