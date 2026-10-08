# flake8: noqa: E501
from django.db import migrations

# (block, key, text_en, text_ru, text_lv)
BLOCKS = [
    (
        "hero",
        "heroEyebrow",
        "Engineering approach",
        "Инженерный подход",
        "Inženiertehniskā pieeja",
    ),
    (
        "hero",
        "title",
        "Engineering tasks in welding",
        "Инженерные задачи в сварке",
        "Inženiertehniskie uzdevumi metināšanā",
    ),
    (
        "hero",
        "lead",
        "Root-cause analysis, effective method selection, and improving process stability.",
        "Анализ причин, выбор эффективных методов и повышение стабильности процессов.",
        "Cēloņu analīze, efektīvu metožu izvēle un procesu stabilitātes uzlabošana.",
    ),
    (
        "nav",
        "navTitle",
        "Areas of work",
        "Направления деятельности",
        "Darbības virzieni",
    ),
    (
        "validation",
        "validationEyebrow",
        "Validated in practice",
        "Подтверждено практикой",
        "Apstiprināts praksē",
    ),
    (
        "validation",
        "validationTitle",
        "Practical experience underpins the engineering approach",
        "Практический опыт — основа инженерного подхода",
        "Praktiskā pieredze — inženiertehniskās pieejas pamats",
    ),
    (
        "validation",
        "validationText",
        "Real projects and production tasks shaped expertise, systems thinking, and a deep understanding of welding processes.",
        "Реальные проекты и производственные задачи сформировали экспертность, системное мышление и глубокое понимание сварочных процессов.",
        "Reāli projekti un ražošanas uzdevumi veidoja ekspertīzi, sistēmisko domāšanu un dziļu izpratni par metināšanas procesiem.",
    ),
    (
        "validation",
        "validationCta",
        "Explore experience",
        "Изучить опыт",
        "Izpētīt pieredzi",
    ),
]

# Previous seed values from 0020_solutions_expertise_site_text_blocks (for reverse)
PREVIOUS = [
    ("hero", "heroEyebrow", "Solutions", "Решения", "Risinājumi"),
    ("hero", "title", "Solutions", "Решения", "Risinājumi"),
    (
        "hero",
        "lead",
        "Generalized solution patterns for recurring welding problems: problem class, likely cause, engineering analysis, method, and expected direction of improvement.",
        "Обобщённые паттерны решений для повторяющихся сварочных задач: класс проблемы, вероятная причина, инженерный анализ, метод и ожидаемое направление улучшения.",
        "Vispārināti risinājumu modeļi atkārtotām metināšanas problēmām: problēmas klase, iespējamais cēlonis, inženiertehniskā analīze, metode un sagaidāmais uzlabojuma virziens.",
    ),
    (
        "nav",
        "navTitle",
        "Choose a production task",
        "Выберите производственную задачу",
        "Izvēlieties ražošanas uzdevumu",
    ),
    (
        "validation",
        "validationEyebrow",
        "Validation layer",
        "Слой подтверждения",
        "Pierādījuma slānis",
    ),
    (
        "validation",
        "validationTitle",
        "Real cases live in Experience",
        "Реальные кейсы находятся в разделе «Опыт»",
        "Reālie piemēri atrodas sadaļā Pieredze",
    ),
    (
        "validation",
        "validationText",
        "Solutions describe reusable patterns. Experience shows where similar logic was applied in real production contexts with roles, periods, actions, and observed outcomes.",
        "Решения описывают повторяемые паттерны. Опыт показывает, где похожая логика применялась в реальном производственном контексте: роли, периоды, действия и наблюдаемый эффект.",
        "Risinājumi apraksta atkārtojamus modeļus. Pieredze rāda, kur līdzīga loģika izmantota reālā ražošanas kontekstā: lomas, periodi, darbības un novērotais efekts.",
    ),
    (
        "validation",
        "validationCta",
        "See real-world validation",
        "Посмотреть подтверждение на практике",
        "Skatīt praktisko pierādījumu",
    ),
]


def _apply(apps, rows):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    for block, key, text_en, text_ru, text_lv in rows:
        SiteTextBlock.objects.update_or_create(
            page="solutions",
            block=block,
            key=key,
            defaults={
                "text_en": text_en,
                "text_ru": text_ru,
                "text_lv": text_lv,
            },
        )


def update_copy(apps, schema_editor):
    _apply(apps, BLOCKS)


def restore_copy(apps, schema_editor):
    _apply(apps, PREVIOUS)


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0052_about_professional_background_heading"),
    ]

    operations = [
        migrations.RunPython(update_copy, restore_copy),
    ]
