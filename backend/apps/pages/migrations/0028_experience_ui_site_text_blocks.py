# flake8: noqa: E501
from django.db import migrations


EXPERIENCE_UI_BLOCKS = [
    (
        "title",
        "Professional Experience",
        "Профессиональный опыт",
        "Profesionālā pieredze",
    ),
    ("layerEyebrow", "Evidence Layer", "Слой подтверждения", "Pierādījumu slānis"),
    (
        "lead",
        "Real roles, production contexts, engineering actions, and observed outcomes. This page validates the solution patterns without turning them into another methodology section.",
        "Реальные роли, производственные контексты, инженерные действия и наблюдаемые результаты. Эта страница подтверждает паттерны решений, но не превращается во второй методический раздел.",
        "Reālas lomas, ražošanas konteksti, inženiertehniskas darbības un novēroti rezultāti. Šī lapa apstiprina risinājumu modeļus, bet nekļūst par vēl vienu metodikas sadaļu.",
    ),
    ("present", "present", "настоящее время", "pašlaik"),
    ("casesTitle", "Case highlights", "Кейсы", "Kā piemēri"),
    (
        "casesIntro",
        "Short, practical examples without KPI overload: context, problem, what was done, and result.",
        "Короткие примеры из практики без KPI-перегруза: контекст, проблема, что было сделано и результат.",
        "Īsi praktiski piemēri bez KPI pārslodzes: konteksts, problēma, kas tika izdarīts, un rezultāts.",
    ),
    ("caseToggleShow", "Details", "Подробнее", "Sīkāk"),
    ("caseToggleHide", "Hide", "Свернуть", "Aizvērt"),
    ("caseContextLabel", "Context", "Контекст", "Konteksts"),
    ("caseProblemLabel", "Problem", "Проблема", "Problēma"),
    (
        "caseEngineeringActionLabel",
        "What Was Done",
        "Что было сделано",
        "Kas tika izdarīts",
    ),
    ("caseResultLabel", "Result", "Результат", "Rezultāts"),
    (
        "relatedPatternsEyebrow",
        "Back to Reasoning",
        "Назад к логике",
        "Atpakaļ pie loģikas",
    ),
    (
        "relatedPatternsTitle",
        "View related solution patterns",
        "Посмотреть связанные паттерны решений",
        "Skatīt saistītos risinājumu modeļus",
    ),
    (
        "relatedPatternsText",
        "Cases prove that the work happened. Solutions explain the reusable decision patterns behind similar production problems.",
        "Кейсы подтверждают, что работа была выполнена. Раздел «Решения» объясняет повторяемые паттерны принятия решений для похожих производственных задач.",
        "Piemēri pierāda, ka darbs ir veikts. Risinājumi izskaidro atkārtojamos lēmumu modeļus līdzīgām ražošanas problēmām.",
    ),
    (
        "relatedPatternsCta",
        "View related solution patterns",
        "Посмотреть паттерны решений",
        "Skatīt risinājumu modeļus",
    ),
    ("photosTitle", "Photos from work", "Фотографии с работы", "Fotogrāfijas no darba"),
]


EXPERIENCE_CASE_BLOCKS = [
    (
        "case1Title",
        "Shielding gas and MAG parameters for a fabrication shop",
        "Защитный газ и режимы MAG для металлоцеха",
        "Aizsarggāze un MAG režīmi metālapstrādes darbnīcai",
    ),
    (
        "case1Summary",
        "Aligned gas choice, flow, and wire settings with real joint access — fewer pores and less rework.",
        "Согласованы газ, расход и параметры проволоки с реальным доступом к шву — меньше пор и переделов.",
        "Saskaņota gāzes izvēle, plūsma un stieples iestatījumi ar reālu piekļuvi šuvim — mazāk poru un pārmācīšanas.",
    ),
    (
        "case1Context",
        "Fabrication shop with MAG welding and draft WPS notes.",
        "Металлоцех с MAG-сваркой и черновыми WPS.",
        "Metālapstrādes darbnīca ar MAG metināšanu un WPS melnrakstiem.",
    ),
    (
        "case1Problem",
        "Porosity and rework repeated because gas flow, wire settings, and joint access were not aligned.",
        "Поры и переделки повторялись, потому что расход газа, параметры проволоки и доступ к шву не были согласованы.",
        "Poras un pārstrāde atkārtojās, jo gāzes plūsma, stieples iestatījumi un piekļuve šuvei nebija saskaņoti.",
    ),
    (
        "case1EngineeringAction",
        "Reviewed shop constraints, checked samples, and fixed a usable parameter window for production.",
        "Проверены ограничения цеха, образцы и серия; зафиксировано рабочее окно параметров для производства.",
        "Pārbaudīti darbnīcas ierobežojumi, paraugi un sērija; noteikts lietojams parametru logs ražošanai.",
    ),
    (
        "case1Result",
        "Welders received repeatable settings for shifts, with fewer pores and less rework.",
        "Сварщики получили повторяемые настройки для смен, стало меньше пор и переделов.",
        "Metinātāji saņēma atkārtojamus iestatījumus maiņām, ar mazāk porām un pārstrādes.",
    ),
    ("case1MoreHref", "/knowledge", "/knowledge", "/knowledge"),
    (
        "case1MoreLabel",
        "Open knowledge base",
        "Открыть базу знаний",
        "Atvērt zināšanu bāzi",
    ),
    (
        "case2Title",
        "TIG aluminum — heat input and bead control",
        "TIG по алюминию — тепловложение и контроль валика",
        "TIG alumīnijam — siltuma ievade un vāliņa kontrole",
    ),
    (
        "case2Summary",
        "Stabilized appearance and mechanical consistency by tuning balance, travel, and filler rhythm for thin sections.",
        "Стабилизированы внешний вид и повторяемость за счёт баланса, подачи и ритма добавления при тонких листах.",
        "Stabilizēts izskats un atkārtojamība, pielāgojot līdzsvaru, pārvietošanos un piedevas ritmu plānām loksnēm.",
    ),
    (
        "case2Context",
        "Thin aluminum TIG work where visual quality and repeatability mattered.",
        "TIG-сварка тонкого алюминия, где важны внешний вид и повторяемость.",
        "TIG metināšana plānam alumīnijam, kur svarīgs izskats un atkārtojamība.",
    ),
    (
        "case2Problem",
        "Contamination, overheating, and inconsistent filler timing caused unstable bead appearance.",
        "Загрязнение, перегрев и неравномерная подача присадки давали нестабильный валик.",
        "Piesārņojums, pārkaršana un nevienmērīgs piedevas ritms radīja nestabilu šuves formu.",
    ),
    (
        "case2EngineeringAction",
        "Mapped defect triggers to balance, travel speed, torch angle, and filler timing checkpoints.",
        "Причины дефектов связаны с балансом, скоростью, углом горелки и контрольными точками подачи присадки.",
        "Defektu cēloņi sasaistīti ar balansu, pārvietošanās ātrumu, degļa leņķi un piedevas laika kontrolpunktiem.",
    ),
    (
        "case2Result",
        "The team gained clearer controls for stable bead shape and consistent heat input.",
        "Команда получила понятные настройки для стабильной формы валика и контролируемого тепловложения.",
        "Komanda ieguva skaidrākus iestatījumus stabilai šuves formai un kontrolētai siltuma ievadei.",
    ),
    ("case2MoreHref", "/tools/heat-input", "/tools/heat-input", "/tools/heat-input"),
    (
        "case2MoreLabel",
        "Heat input calculator",
        "Калькулятор тепловложения",
        "Siltuma ievades kalkulators",
    ),
    (
        "case3Title",
        "Training + audit-ready welding documentation",
        "Обучение и документация «под аудит»",
        "Apmācība un dokumentācija auditam",
    ),
    (
        "case3Summary",
        "Built a pragmatic training loop and traceability pack for internal audits and customer questionnaires.",
        "Практичный цикл обучения и пакет прослеживаемости для внутренних аудитов и анкет заказчиков.",
        "Praktiski apmācību cikls un izsekojamības pakete iekšējiem auditiem un klientu anketām.",
    ),
    (
        "case3Context",
        "Production team needed training and clearer evidence for internal audits.",
        "Производственной команде нужны были обучение и понятные подтверждения для внутренних аудитов.",
        "Ražošanas komandai bija vajadzīga apmācība un skaidri pierādījumi iekšējiem auditiem.",
    ),
    (
        "case3Problem",
        "Supervisors lacked a simple way to verify weld readiness and capture parameters consistently.",
        "Руководителям не хватало простого способа проверять готовность швов и одинаково фиксировать параметры.",
        "Vadītājiem trūka vienkārša veida pārbaudīt šuvju gatavību un vienādi fiksēt parametrus.",
    ),
    (
        "case3EngineeringAction",
        "Combined hands-on demonstrations with short checklists for release checks and parameter records.",
        "Практические показы совмещены с короткими чек-листами для выпуска партии и записи параметров.",
        "Praktiskas demonstrācijas apvienotas ar īsām pārbaudes listēm partijas izlaišanai un parametru pierakstiem.",
    ),
    (
        "case3Result",
        "Training became easier to repeat, and batch release checks became clearer for supervisors.",
        "Обучение стало проще повторять, а проверки перед выпуском партии стали понятнее для руководителей.",
        "Apmācību kļuva vieglāk atkārtot, un pārbaudes pirms partijas izlaišanas kļuva skaidrākas vadītājiem.",
    ),
    ("case3MoreHref", "/contact", "/contact", "/contact"),
    (
        "case3MoreLabel",
        "Discuss a similar engagement",
        "Обсудить похожий запрос",
        "Apspriest līdzīgu uzdevumu",
    ),
]


def seed_experience_ui(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    for block, rows in (
        ("ui", EXPERIENCE_UI_BLOCKS),
        ("cases", EXPERIENCE_CASE_BLOCKS),
    ):
        for key, text_en, text_ru, text_lv in rows:
            SiteTextBlock.objects.update_or_create(
                page="experience",
                block=block,
                key=key,
                defaults={
                    "text_en": text_en,
                    "text_ru": text_ru,
                    "text_lv": text_lv,
                },
            )


def remove_experience_ui(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    for block, rows in (
        ("ui", EXPERIENCE_UI_BLOCKS),
        ("cases", EXPERIENCE_CASE_BLOCKS),
    ):
        SiteTextBlock.objects.filter(
            page="experience",
            block=block,
            key__in=[key for key, *_ in rows],
        ).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0027_about_ui_site_text_blocks"),
    ]

    operations = [
        migrations.RunPython(seed_experience_ui, remove_experience_ui),
    ]
