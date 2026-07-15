# flake8: noqa: E501
from django.db import migrations


SHIELDING_GAS_PAGE_BLOCKS = [
    (
        "lead",
        "Guides you through material, welding process, plate thickness and gas mixture to recommend shielding gases for MAG, MIG and TIG. Compare ISO designations, typical applications and relative criteria scores — not gas flow rates.",
        "Пошагово подбирает смесь защитного газа для MAG, MIG и TIG: материал, процесс, толщина и газ. Сравнение обозначений ISO, типичных применений и относительных оценок по критериям — не расхода газа (л/мин).",
        "Pārlūko materiālu, metināšanas procesu, loksnes biezumu un gāzes maisījumu, lai ieteiktu aizsarggāzes MAG, MIG un TIG. Salīdzina ISO apzīmējumus, tipiskos pielietojumus un relatīvos kritēriju vērtējumus — nevis gāzes plūsmu.",
    ),
    (
        "exampleTitle",
        "Selection in five steps",
        "Подбор в пять шагов",
        "Izvēle piecos soļos",
    ),
    (
        "exampleCaption",
        "Material → Process → Thickness → Gas → Result: ISO mix, application and criteria scores on a 1–5 scale.",
        "Материал → Процесс → Толщина → Газ → Результат: смесь по ISO, применение и оценки по критериям по шкале 1–5.",
        "Materiāls → Process → Biezums → Gāze → Rezultāts: ISO maisījums, pielietojums un kritēriju vērtējumi pēc 1–5 skalas.",
    ),
]

SHIELDING_GAS_WIZARD_BLOCKS = [
    ("back", "Back", "Назад", "Atpakaļ"),
    ("reset", "Start over", "Начать заново", "Sākt no jauna"),
    ("importantAlert", "Important!", "Важно!", "Svarīgi!"),
    (
        "rootProtectionGases",
        "Root protection gases:",
        "Газы для защиты корня шва:",
        "Gāzes saknes aizsardzībai:",
    ),
    (
        "rootProtectionWarning",
        "During TIG welding of stainless steels without root protection, hard chromium oxides form on the reverse side, reducing corrosion resistance.",
        "При TIG-сварке нержавеющих сталей без защиты корня шва с обратной стороны образуются твёрдые оксиды хрома, ухудшающие коррозионную стойкость.",
        "TIG metinot nerūsējošo tēraudu bez saknes aizsardzības, pretējā pusē veidojas cieti hroma oksīdi, kas pasliktina korozijas izturību.",
    ),
    (
        "errorGasNotFound",
        "Error: gas information not found",
        "Ошибка: информация о газе не найдена",
        "Kļūda: informācija par gāzi nav atrasta",
    ),
    (
        "isoLabel",
        "ISO EN 14175 designation:",
        "Обозначение по ISO EN 14175:",
        "ISO EN 14175 apzīmējums:",
    ),
    (
        "totalScoreLabel",
        "Overall score:",
        "Общий балл:",
        "Kopējais vērtējums:",
    ),
    (
        "applicationLabel",
        "Main application:",
        "Основное применение:",
        "Galvenais pielietojums:",
    ),
    ("stepMaterial", "Material", "Материал", "Materiāls"),
    ("stepProcess", "Process", "Процесс", "Process"),
    ("stepThickness", "Thickness", "Толщина", "Biezums"),
    ("stepGas", "Gas", "Газ", "Gāze"),
    ("stepResult", "Result", "Результат", "Rezultāts"),
    (
        "scoreNote",
        "Assessment is based on a relative 1–5 scale for welding mixtures, where 1 is the worst and 5 is the best.",
        "Оценка выполнена по относительной шкале 1–5 для сварочных смесей, где 1 — наихудший параметр, 5 — наилучший.",
        "Vērtējums veikts pēc relatīvās 1–5 skalas metināšanas maisījumiem, kur 1 ir sliktākais un 5 — labākais.",
    ),
]

LEGACY_SHIELDING_GAS_PAGE_BLOCKS = [
    (
        "lead",
        "Suggests a reasonable shielding gas flow range from wire size, material and process. Use as a starting point before fine-tuning with tests.",
        "Подсказывает разумный диапазон расхода защитного газа по диаметру проволоки, материалу и процессу. Стартовая точка перед подстройкой по пробам.",
        "Piedāvā saprātīgu aizsarggāzes plūsmas diapazonu pēc stieples, materiāla un procesa. Sākuma punkts pirms pielāgošanas testos.",
    ),
    (
        "exampleTitle",
        "Typical flow band",
        "Типичный диапазон",
        "Tipisks plūsmas josla",
    ),
    (
        "exampleCaption",
        "Min–max band with a typical setpoint; adjust for nozzle, draft and joint access.",
        "Полоса min–max и типичная установка; уточняйте с учётом сопла, сквозняка и доступа к шву.",
        "Min–max josla ar tipisku iestatījumu; pielāgojiet sprauslai, caurvējam un piekļuvei šuvim.",
    ),
]


def upsert_blocks(apps, page, block, rows):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    for key, text_en, text_ru, text_lv in rows:
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


def seed_shielding_gas_wizard(apps, schema_editor):
    upsert_blocks(apps, "calculators", "shielding-gas_page", SHIELDING_GAS_PAGE_BLOCKS)
    upsert_blocks(
        apps, "calculators", "shielding-gas_wizard", SHIELDING_GAS_WIZARD_BLOCKS
    )


def remove_shielding_gas_wizard(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    SiteTextBlock.objects.filter(
        page="calculators",
        block="shielding-gas_wizard",
        key__in=[key for key, *_ in SHIELDING_GAS_WIZARD_BLOCKS],
    ).delete()
    upsert_blocks(
        apps, "calculators", "shielding-gas_page", LEGACY_SHIELDING_GAS_PAGE_BLOCKS
    )


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0036_about_profile_record_site_text_blocks"),
    ]

    operations = [
        migrations.RunPython(seed_shielding_gas_wizard, remove_shielding_gas_wizard),
    ]
