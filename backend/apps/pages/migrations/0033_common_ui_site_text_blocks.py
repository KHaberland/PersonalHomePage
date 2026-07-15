# flake8: noqa: E501
from django.db import migrations, models


HEADER_BLOCKS = [
    (
        "systemLabel",
        "Engineering Decision System",
        "Система инженерных решений",
        "Inženiertehnisko lēmumu sistēma",
    ),
    (
        "systemFlow",
        "Reasoning -> Proof -> Knowledge",
        "Логика -> подтверждение -> знания",
        "Loģika -> pierādījums -> zināšanas",
    ),
    ("menuOpen", "Open menu", "Открыть меню", "Atvērt izvēlni"),
    ("menuClose", "Close menu", "Закрыть меню", "Aizvērt izvēlni"),
]


FOOTER_BLOCKS = [
    (
        "tagline",
        "Welding Engineer | Expert in MIG/MAG, TIG, Shielding Gases",
        "Инженер по сварке | Эксперт MIG/MAG, TIG, защитные газы",
        "Metināšanas inženieris | Eksperts MIG/MAG, TIG, aizsarggāzes",
    ),
    ("contact", "Contact", "Контакт", "Kontakts"),
    ("linkedin", "LinkedIn", "LinkedIn", "LinkedIn"),
    ("youtube", "YouTube", "YouTube", "YouTube"),
    (
        "rights",
        "All rights reserved.",
        "Все права защищены.",
        "Visas tiesības aizsargātas.",
    ),
    (
        "ctaHint",
        "Need help with welding setup or training?",
        "Нужна помощь со сваркой или обучением?",
        "Vajadzīga palīdzība ar metināšanu vai apmācību?",
    ),
    ("languages", "Language", "Язык", "Valoda"),
    (
        "navigationAriaLabel",
        "Footer navigation",
        "Навигация в футере",
        "Kājenes navigācija",
    ),
    (
        "engineeringReasoning",
        "Engineering Reasoning",
        "Инженерная логика",
        "Inženiertehniskā loģika",
    ),
    (
        "engineeringProof",
        "Engineering Proof",
        "Инженерное подтверждение",
        "Inženiertehniskais pierādījums",
    ),
    ("knowledgeSystem", "Knowledge System", "Система знаний", "Zināšanu sistēma"),
    ("supportTitle", "Personal / Contact", "Личное / контакт", "Personīgi / kontakts"),
]


NAV_BLOCKS = [
    ("home", "Home", "Главная", "Sākums"),
    ("about", "About", "Обо мне", "Par mani"),
    ("experience", "Experience", "Опыт", "Pieredze"),
    ("book", "Book", "Книга", "Grāmata"),
    ("tools", "Tools", "Инструменты", "Rīki"),
    ("toolsNav", "Tools", "Инструменты", "Rīki"),
    ("knowledge", "Welding Knowledge", "База знаний", "Zināšanu bāze"),
    ("knowledgeNav", "Knowledge", "База знаний", "Zināšanas"),
    ("blog", "Blog", "Блог", "Blogs"),
    ("contact", "Contact", "Контакты", "Kontakti"),
    ("expertise", "Expertise", "Экспертиза", "Ekspertīze"),
    ("solutions", "Solutions", "Решения", "Risinājumi"),
    ("cases", "Cases", "Кейсы", "Piemēri"),
]


PROGRESS_BLOCKS = [
    ("homePageSections", "Home sections", "Разделы главной", "Sākumlapas sadaļas"),
    ("homeSectionAbout", "About me", "Обо мне", "Par mani"),
    (
        "homeSectionWhy",
        "Why work with me",
        "Почему со мной работают",
        "Kāpēc sadarboties ar mani",
    ),
    (
        "homeSectionExperience",
        "Professional experience",
        "Профессиональный опыт",
        "Profesionālā pieredze",
    ),
    ("homeSectionBook", "Book", "Книга", "Grāmata"),
    (
        "homeSectionProblemValue",
        "Problem / value",
        "Проблема / ценность",
        "Problēma / vērtība",
    ),
    ("homeSectionTools", "Tools", "Инструменты", "Rīki"),
    ("homeSectionBlog", "Blog", "Блог", "Blogs"),
    ("homeSectionContact", "Contact", "Контакты", "Kontakti"),
    ("homePageProgressLabel", "On this page", "На этой странице", "Šajā lapā"),
]


def upsert_blocks(apps, block, rows):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    for key, text_en, text_ru, text_lv in rows:
        SiteTextBlock.objects.update_or_create(
            page="common",
            block=block,
            key=key,
            defaults={
                "text_en": text_en,
                "text_ru": text_ru,
                "text_lv": text_lv,
            },
        )


def seed_common_ui(apps, schema_editor):
    upsert_blocks(apps, "header", HEADER_BLOCKS)
    upsert_blocks(apps, "footer", FOOTER_BLOCKS)
    upsert_blocks(apps, "nav", NAV_BLOCKS)
    upsert_blocks(apps, "progress", PROGRESS_BLOCKS)


def remove_common_ui(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    SiteTextBlock.objects.filter(page="common").delete()


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0032_calculator_ui_site_text_blocks"),
    ]

    operations = [
        migrations.AlterField(
            model_name="sitetextblock",
            name="page",
            field=models.CharField(
                choices=[
                    ("home", "Home"),
                    ("about", "About"),
                    ("experience", "Experience"),
                    ("expertise", "Expertise"),
                    ("solutions", "Solutions"),
                    ("knowledge", "Knowledge"),
                    ("blog", "Blog"),
                    ("calculators", "Calculators"),
                    ("tools", "Tools"),
                    ("contact", "Contact"),
                    ("book", "Book"),
                    ("common", "Common"),
                ],
                max_length=50,
            ),
        ),
        migrations.RunPython(seed_common_ui, remove_common_ui),
    ]
