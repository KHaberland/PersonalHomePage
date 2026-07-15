# flake8: noqa: E501
from django.db import migrations


KNOWLEDGE_UI_BLOCKS = [
    (
        "eyebrow",
        "Engineering learning hub",
        "Инженерная база знаний",
        "Inženiertehnisko zināšanu bāze",
    ),
    (
        "title",
        "Welding Knowledge Base",
        "База знаний по сварке",
        "Metināšanas zināšanu bāze",
    ),
    (
        "description",
        "Structured explanations of how welding processes, gases, metallurgy, and defects behave. Cases, dated posts, and the book stay in their own routes.",
        "Структурные объяснения поведения сварочных процессов, газов, металлургии и дефектов. Кейсы, датированные публикации и книга остаются в отдельных маршрутах.",
        "Strukturēti skaidrojumi par metināšanas procesu, gāzu, metalurģijas un defektu uzvedību. Piemēri, datētas publikācijas un grāmata paliek savos maršrutos.",
    ),
    (
        "schemaNote",
        "Knowledge is the reference layer: topic groups, process logic, and technical background without project storytelling or book sales.",
        "База знаний — справочный слой: группы тем, логика процессов и технический контекст без проектных историй и продажи книги.",
        "Zināšanu bāze ir atsauces slānis: tēmu grupas, procesa loģika un tehniskais konteksts bez projektu stāstiem un grāmatas pārdošanas.",
    ),
    (
        "noArticles",
        "No articles in this section yet.",
        "В этом разделе пока нет статей.",
        "Šajā sadaļā vēl nav rakstu.",
    ),
    (
        "viewAllInCategory",
        "View all in category",
        "Все статьи раздела",
        "Visus rakstus sadaļā",
    ),
    ("readMore", "Read explanation", "Читать объяснение", "Lasīt skaidrojumu"),
    ("systemLinksTitle", "Where to go next", "Куда перейти дальше", "Kur doties tālāk"),
    (
        "solutionCtaTitle",
        "Apply this as a solution pattern",
        "Применить как паттерн решения",
        "Pielietot kā risinājuma modeli",
    ),
    (
        "solutionCtaText",
        "If the explanation matches a production problem, move to Solutions for the decision pattern.",
        "Если объяснение совпадает с производственной проблемой, перейдите в «Решения» за паттерном принятия решения.",
        "Ja skaidrojums atbilst ražošanas problēmai, pārejiet uz Risinājumiem lēmuma modelim.",
    ),
    (
        "solutionCta",
        "Apply this as a solution pattern",
        "Применить как паттерн решения",
        "Pielietot kā risinājuma modeli",
    ),
    (
        "blogLinkTitle",
        "Chronological publications",
        "Хронологические публикации",
        "Hronoloģiskas publikācijas",
    ),
    (
        "blogLinkText",
        "Open the blog for dated posts, updates, and author commentary.",
        "Откройте блог для датированных записей, обновлений и авторских комментариев.",
        "Atveriet blogu datētiem ierakstiem, jaunumiem un autora komentāriem.",
    ),
    (
        "bookLinkTitle",
        "Static authority artifact",
        "Статический авторитетный материал",
        "Statisks autoritātes materiāls",
    ),
    (
        "bookLinkText",
        "Open the book page for the MAG/MIG publication and author credibility.",
        "Откройте страницу книги как публикацию по MAG/MIG и подтверждение авторской экспертизы.",
        "Atveriet grāmatas lapu kā MAG/MIG publikāciju un autora uzticamības apliecinājumu.",
    ),
]


def seed_knowledge_ui(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    for key, text_en, text_ru, text_lv in KNOWLEDGE_UI_BLOCKS:
        SiteTextBlock.objects.update_or_create(
            page="knowledge",
            block="ui",
            key=key,
            defaults={
                "text_en": text_en,
                "text_ru": text_ru,
                "text_lv": text_lv,
            },
        )


def remove_knowledge_ui(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    SiteTextBlock.objects.filter(
        page="knowledge",
        block="ui",
        key__in=[key for key, *_ in KNOWLEDGE_UI_BLOCKS],
    ).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0028_experience_ui_site_text_blocks"),
    ]

    operations = [
        migrations.RunPython(seed_knowledge_ui, remove_knowledge_ui),
    ]
