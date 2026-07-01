# flake8: noqa: E501
from django.db import migrations


HOME_TEXT_BLOCKS = [
    (
        "hero",
        "heroVideoDescription",
        "Hero background: dark gradient; when the media file loads, a silent looping video of industrial welding.",
        "Фон первого экрана: тёмный градиент; при успешной загрузке — беззвучное зацикленное видео сварки в производстве.",
        "Pirmā ekrāna fons: tumšs gradients; ja mediju fails ielādējas — kluss, atkārtojošs metināšanas video ražošanā.",
    ),
    (
        "hero",
        "heroTitleLine1",
        "International Welding Engineer (IWE)",
        "International Welding Engineer (IWE)",
        "International Welding Engineer (IWE)",
    ),
    (
        "hero",
        "heroTitleLine2",
        "Industrial welding process optimization & defect reduction",
        "Industrial welding process optimization & defect reduction",
        "Industrial welding process optimization & defect reduction",
    ),
    (
        "hero",
        "heroTitleLineHighlight",
        "10+ years in the field | MIG/MAG, TIG, MMA | Author of a welding book",
        "10+ лет практики | MIG/MAG, TIG, MMA | Автор книги по сварке",
        "10+ gadu praksē | MIG/MAG, TIG, MMA | Metināšanas grāmatas autors",
    ),
    (
        "hero",
        "heroTitleLine3",
        "I understand welding end to end — from running the bead to customer requirements and project estimates",
        "Понимаю процесс сварки на всех уровнях — от выполнения шва до требований заказчика и расчёта проекта",
        "Izprotu metināšanu visos līmeņos — no šuves izpildes līdz klienta prasībām un projekta aprēķiniem",
    ),
    (
        "hero",
        "heroCtaSolutions",
        "View solutions",
        "Смотреть решения",
        "Skatīt risinājumus",
    ),
    (
        "hero",
        "heroCtaTools",
        "Check tools",
        "Проверить расчёты",
        "Pārbaudīt rīkus",
    ),
    (
        "decision_system",
        "decisionSystemEyebrow",
        "Engineering Decision System",
        "Система инженерных решений",
        "Inženiertehnisko lēmumu sistēma",
    ),
    (
        "decision_system",
        "decisionSystemTitle",
        "Reasoning -> Proof -> Knowledge",
        "Логика -> подтверждение -> знания",
        "Loģika -> pierādījums -> zināšanas",
    ),
    (
        "decision_system",
        "decisionSystemLead",
        "Use the site as one decision path: solution patterns first, real validation second, then explanations and tools for checking details.",
        "Сайт работает как единый путь принятия решения: сначала паттерны решений, затем реальное подтверждение, потом знания и инструменты для проверки деталей.",
        "Vietne darbojas kā viens lēmumu ceļš: vispirms risinājumu modeļi, pēc tam reāls pierādījums, tad zināšanas un rīki detaļu pārbaudei.",
    ),
    (
        "decision_system",
        "decisionReasoningTitle",
        "Reasoning",
        "Логика",
        "Loģika",
    ),
    (
        "decision_system",
        "decisionReasoningDescription",
        "General solution patterns and capabilities: how typical welding problems are approached.",
        "Общие паттерны решений и компетенции: как подходить к типовым проблемам сварки.",
        "Vispārīgi risinājumu modeļi un kompetences: kā pieiet tipiskām metināšanas problēmām.",
    ),
    (
        "decision_system",
        "decisionProofTitle",
        "Proof",
        "Подтверждение",
        "Pierādījums",
    ),
    (
        "decision_system",
        "decisionProofDescription",
        "Real cases, timeline, and calculators that validate whether the approach works in practice.",
        "Реальные кейсы, хронология и калькуляторы, которые показывают, как подход проверяется на практике.",
        "Reāli piemēri, laika līnija un kalkulatori, kas pārbauda pieeju praksē.",
    ),
    (
        "decision_system",
        "decisionKnowledgeTitle",
        "Knowledge",
        "Знания",
        "Zināšanas",
    ),
    (
        "decision_system",
        "decisionKnowledgeDescription",
        "Structured explanations, articles, and the book for deeper technical context.",
        "Структурные объяснения, статьи и книга для более глубокого технического контекста.",
        "Strukturēti skaidrojumi, raksti un grāmata dziļākam tehniskam kontekstam.",
    ),
    ("decision_system", "decisionLinkSolutions", "Solutions", "Решения", "Risinājumi"),
    (
        "decision_system",
        "decisionLinkExpertise",
        "Expertise",
        "Экспертиза",
        "Ekspertīze",
    ),
    ("decision_system", "decisionLinkExperience", "Experience", "Опыт", "Pieredze"),
    ("decision_system", "decisionLinkTools", "Tools", "Инструменты", "Rīki"),
    (
        "decision_system",
        "decisionLinkKnowledge",
        "Knowledge",
        "База знаний",
        "Zināšanas",
    ),
    ("decision_system", "decisionLinkBlog", "Blog", "Блог", "Blogs"),
    ("decision_system", "decisionLinkBook", "Book", "Книга", "Grāmata"),
    (
        "entry_paths",
        "entryPathsEyebrow",
        "Choose your path",
        "Выберите путь",
        "Izvēlieties ceļu",
    ),
    (
        "entry_paths",
        "entryPathsTitle",
        "Four ways to evaluate the engineering fit",
        "Четыре способа понять, подходит ли здесь инженерный опыт",
        "Četri veidi, kā novērtēt inženiertehnisko atbilstību",
    ),
    (
        "entry_paths",
        "entryPathsLead",
        "Start with the question that matters now: the production problem, the evidence behind it, the knowledge layer, or a parameter check.",
        "Начните с вопроса, который важен сейчас: производственная проблема, подтверждение, слой знаний или проверка параметров.",
        "Sāciet ar jautājumu, kas šobrīd ir svarīgs: ražošanas problēma, pierādījums, zināšanu slānis vai parametru pārbaude.",
    ),
    (
        "entry_paths",
        "entryPathSolutionsTitle",
        "Solve my problem",
        "Решить мою проблему",
        "Atrisināt manu problēmu",
    ),
    (
        "entry_paths",
        "entryPathSolutionsDescription",
        "Production problems, engineering approach, and expected result.",
        "Производственные задачи, инженерный подход и ожидаемый результат.",
        "Ražošanas problēmas, inženiertehniska pieeja un gaidāmais rezultāts.",
    ),
    (
        "entry_paths",
        "entryPathSolutionsCta",
        "Go to Solutions",
        "Перейти к решениям",
        "Uz risinājumiem",
    ),
    (
        "entry_paths",
        "entryPathExperienceTitle",
        "See experience",
        "Посмотреть опыт",
        "Skatīt pieredzi",
    ),
    (
        "entry_paths",
        "entryPathExperienceDescription",
        "Timeline, cases, projects, and evidence of real industrial work.",
        "Хронология, кейсы, проекты и подтверждение реальной промышленной практики.",
        "Laika līnija, piemēri, projekti un reāla rūpnieciskā darba pierādījumi.",
    ),
    (
        "entry_paths",
        "entryPathExperienceCta",
        "Go to Experience",
        "Перейти к опыту",
        "Uz pieredzi",
    ),
    (
        "entry_paths",
        "entryPathKnowledgeTitle",
        "Understand the process",
        "Понять процесс",
        "Saprast procesu",
    ),
    (
        "entry_paths",
        "entryPathKnowledgeDescription",
        "Structured explanations before applying a solution pattern or checking a parameter.",
        "Структурные объяснения перед применением паттерна решения или проверкой параметра.",
        "Strukturēti skaidrojumi pirms risinājuma modeļa pielietošanas vai parametra pārbaudes.",
    ),
    (
        "entry_paths",
        "entryPathKnowledgeCta",
        "Go to Knowledge",
        "Перейти к базе знаний",
        "Uz zināšanu bāzi",
    ),
    (
        "entry_paths",
        "entryPathToolsTitle",
        "Check engineering",
        "Проверить инженерию",
        "Pārbaudīt inženieriju",
    ),
    (
        "entry_paths",
        "entryPathToolsDescription",
        "Calculators and parameter checks without marketing or storytelling.",
        "Калькуляторы и проверка параметров без маркетинга и историй.",
        "Kalkulatori un parametru pārbaudes bez mārketinga un stāstiem.",
    ),
    (
        "entry_paths",
        "entryPathToolsCta",
        "Go to Tools",
        "Перейти к инструментам",
        "Uz rīkiem",
    ),
    (
        "proof",
        "proofTitle",
        "Engineering proof",
        "Инженерные подтверждения",
        "Inženiertehniskie pierādījumi",
    ),
    ("proof", "proofYears", "10+ years", "10+ лет", "10+ gadi"),
    ("proof", "proofIwe", "IWE", "IWE", "IWE"),
    ("proof", "proofBookAuthor", "Book author", "Автор книги", "Grāmatas autors"),
    (
        "proof",
        "proofIndustryExperience",
        "Industry experience",
        "Промышленный опыт",
        "Rūpnieciskā pieredze",
    ),
    (
        "contact_cta",
        "contactCtaTitle",
        "Need an engineering decision for a real production task?",
        "Нужно инженерное решение для реальной производственной задачи?",
        "Vajadzīgs inženiertehnisks lēmums reālam ražošanas uzdevumam?",
    ),
    (
        "contact_cta",
        "contactCtaText",
        "Send the process, defect pattern, material, gas, or documentation question after you have checked the relevant layer.",
        "Опишите процесс, дефект, материал, газ или вопрос по документации после проверки подходящего слоя.",
        "Aprakstiet procesu, defektu, materiālu, gāzi vai dokumentācijas jautājumu pēc atbilstošā slāņa pārbaudes.",
    ),
    (
        "contact_cta",
        "contactCta",
        "Request consultation",
        "Запросить консультацию",
        "Pieprasīt konsultāciju",
    ),
]


def seed_home_site_text_blocks(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")

    for block, key, text_en, text_ru, text_lv in HOME_TEXT_BLOCKS:
        SiteTextBlock.objects.update_or_create(
            page="home",
            block=block,
            key=key,
            defaults={
                "text_en": text_en,
                "text_ru": text_ru,
                "text_lv": text_lv,
            },
        )


def remove_home_site_text_blocks(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    keys_by_block = {}
    for block, key, *_ in HOME_TEXT_BLOCKS:
        keys_by_block.setdefault(block, []).append(key)

    for block, keys in keys_by_block.items():
        SiteTextBlock.objects.filter(page="home", block=block, key__in=keys).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0016_site_text_block"),
    ]

    operations = [
        migrations.RunPython(seed_home_site_text_blocks, remove_home_site_text_blocks),
    ]
