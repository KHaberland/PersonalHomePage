# flake8: noqa: E501
from django.db import migrations, models


COMMON_BLOCKS = [
    ("calculate", "Calculate", "Рассчитать", "Aprēķināt"),
    ("calculating", "Calculating…", "Расчёт…", "Aprēķina…"),
    (
        "errorInvalid",
        "Enter valid numbers.",
        "Введите корректные числа.",
        "Ievadiet derīgus skaitļus.",
    ),
    (
        "errorSpeedPositive",
        "Travel speed must be > 0.",
        "Скорость сварки должна быть > 0.",
        "Metināšanas ātrumam jābūt > 0.",
    ),
    (
        "errorFlowPositive",
        "Flow rate must be > 0.",
        "Расход газа должен быть > 0.",
        "Gāzes plūsmai jābūt > 0.",
    ),
    (
        "errorWireDiameter",
        "Enter valid wire diameter.",
        "Введите корректный диаметр проволоки.",
        "Ievadiet derīgu stieples diametru.",
    ),
    (
        "errorPlateThickness",
        "Enter valid plate thickness.",
        "Введите корректную толщину листа.",
        "Ievadiet derīgu loksnes biezumu.",
    ),
    (
        "errorCylinderVolume",
        "Cylinder volume must be > 0.",
        "Объём баллона должен быть > 0.",
        "Balona tilpumam jābūt > 0.",
    ),
    (
        "errorCalculationFailed",
        "Calculation failed",
        "Ошибка расчёта",
        "Aprēķina kļūda",
    ),
    (
        "exampleSectionTitle",
        "Example result (illustrative)",
        "Пример результата (иллюстрация)",
        "Piemēra rezultāts (ilustrācija)",
    ),
    (
        "engineeringNoteTitle",
        "Engineering use",
        "Инженерное применение",
        "Inženiertehniska izmantošana",
    ),
    (
        "engineeringNote",
        "Use the calculated value as a technical starting point. Final settings should be checked against material, joint access, WPS requirements, equipment limits, and trial weld results.",
        "Используйте расчёт как техническую отправную точку. Итоговые настройки нужно сверять с материалом, доступом к шву, требованиями WPS, ограничениями оборудования и результатами пробных швов.",
        "Izmantojiet aprēķinu kā tehnisku sākumpunktu. Gala iestatījumi jāpārbauda pēc materiāla, piekļuves šuvei, WPS prasībām, iekārtas ierobežojumiem un testa šuvju rezultātiem.",
    ),
    (
        "validationCtaTitle",
        "Only if the result needs review",
        "Только если результат требует проверки",
        "Tikai tad, ja rezultāts jāpārbauda",
    ),
    (
        "validationCtaText",
        "Request consultation if the calculated parameters are outside the expected range, conflict with WPS limits, or need production validation.",
        "Запросите консультацию, если расчётные параметры выходят за ожидаемый диапазон, конфликтуют с WPS или требуют проверки на производстве.",
        "Pieprasiet konsultāciju, ja aprēķinātie parametri ir ārpus gaidāmā diapazona, konfliktē ar WPS ierobežojumiem vai jāpārbauda ražošanā.",
    ),
    (
        "validationCta",
        "Request engineering review",
        "Запросить инженерную проверку",
        "Pieprasīt inženiertehnisku pārbaudi",
    ),
]


PAGE_BLOCKS = {
    "heat-input_page": [
        (
            "lead",
            "Estimates heat input (kJ/mm) from voltage, current and travel speed. For welding engineers and technicians comparing WPS values and thermal load.",
            "Оценивает тепловложение (кДж/мм) по напряжению, току и скорости сварки. Для инженеров и технологов при сравнении WPS и контроле теплового ввода.",
            "Novērtē siltuma ievadi (kJ/mm) no sprieguma, strāvas un metināšanas ātruma. Inženieriem un tehnologiem, salīdzinot WPS un termisko slodzi.",
        ),
        (
            "exampleTitle",
            "Illustrative comparison",
            "Сравнение на уровне схемы",
            "Illustratīva salīdzināšana",
        ),
        (
            "exampleCaption",
            "Two different heat-input levels: higher Q usually means more energy per unit length in the weld.",
            "Два разных уровня тепловложения: больше Q обычно означает больше энергии на единицу длины шва.",
            "Divi dažādi siltuma ievades līmeņi: lielāks Q parasti nozīmē vairāk enerģijas uz švīdas garuma vienību.",
        ),
    ],
    "gas-flow_page": [
        (
            "lead",
            "Estimates gas consumption over welding time and relates it to cylinder volume. Helpful when planning jobs and cylinder stock.",
            "Оценивает расход газа за время сварки и соотносит его с объёмом баллона. Удобно при планировании работ и запаса баллонов.",
            "Novērtē gāzes patēriņu metināšanas laikā un sasaista ar balona tilpumu. Noderīgi plānojot darbus un balonu krājumus.",
        ),
        ("exampleTitle", "Consumption sketch", "Схема расхода", "Patēriņa skice"),
        (
            "exampleCaption",
            "Flow rate multiplied by time gives volume; compare with cylinder capacity for run time.",
            "Расход × время даёт объём; сравните с ёмкостью баллона для оценки времени работы.",
            "Plūsma reizināta ar laiku dod tilpumu; salīdziniet ar balona ietilpību, lai novērtētu darba laiku.",
        ),
    ],
    "shielding-gas_page": [
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
    ],
    "gas-cutting_page": [
        (
            "lead",
            "Oxygen cutting: indicative O₂ pressure and fuel flow from plate thickness (and optional cutting speed). Always verify with equipment manuals and trials.",
            "Кислородная резка: ориентировочные давление O₂ и расход топлива по толщине (и опционально по скорости резки). Проверяйте по паспорту оборудования.",
            "Skābekļa griešana: indicatīvs O₂ spiediens un degvielas plūsma pēc loksnes biezuma (un pēc izvēles griešanas ātruma). Pārbaudiet pēc iekārtas instrukcijām.",
        ),
        (
            "exampleTitle",
            "Pressure vs thickness",
            "Давление и толщина",
            "Spiediens pret biezumu",
        ),
        (
            "exampleCaption",
            "Thicker plate generally needs higher oxygen pressure; values are indicative.",
            "Толще лист — обычно выше давление кислорода; значения ориентировочные.",
            "Biezākai lokšnei parasti augstāks skābekļa spiediens; vērtības ir orientējošas.",
        ),
    ],
    "welding-cost_page": [
        (
            "lead",
            "Rough cost split between filler wire and shielding gas from prices, deposition rate and time. For estimators and workshop planning.",
            "Грубая оценка доли проволоки и защитного газа в стоимости по ценам, скорости наплавки и времени. Для сметчиков и планирования цеха.",
            "Aptuvena izmaksu sadalījums starp stiepli un aizsarggāzi cenu, nanosanas ātruma un laika ietvaros. Novērtētājiem un darbnīcas plānošanai.",
        ),
        ("exampleTitle", "Cost structure", "Структура затрат", "Izmaksu struktūra"),
        (
            "exampleCaption",
            "Illustrative share of wire vs gas; your actual split depends on parameters and prices.",
            "Условное соотношение проволоки и газа; реальная доля зависит от режимов и цен.",
            "Illustratīva stieples un gāzes daļa; faktiskā sadalījums atkarīgs no režīmiem un cenām.",
        ),
    ],
    "welding-parameters_page": [
        (
            "lead",
            "Starting-point current, voltage and travel speed from plate thickness, joint and wire diameter. Confirm on samples and your WPS.",
            "Стартовые ток, напряжение и скорость по толщине, типу соединения и диаметру проволоки. Уточняйте на образцах и в рамках WPS.",
            "Sākuma strāva, spriegums un ātrums pēc biezuma, savienojuma un stieples diametra. Apstipriniet paraugos un savā WPS.",
        ),
        ("exampleTitle", "Sample output", "Пример выходных данных", "Piemēra izvade"),
        (
            "exampleCaption",
            "Example parameter set (I, U, travel speed) for a typical MAG fillet — not a substitute for procedure qualification.",
            "Пример набора I, U и скорости для типичного углового MAG — не замена аттестации процедуры.",
            "Piemēram parametru kopa (I, U, ātrums) tipiskam MAG leņķa šuvim — neaizstāj procedūras kvalifikāciju.",
        ),
    ],
}


FIELD_BLOCKS = {
    "heat-input_fields": [
        ("voltage_label", "Voltage (V)", "Напряжение (В)", "Spriegums (V)"),
        (
            "voltage_hint",
            "Arc or load voltage used in the heat-input formula (check whether your WPS uses measured arc voltage).",
            "Напряжение дуги или нагрузки в формуле тепловложения (сверьтесь, какое U указано в WPS).",
            "Loka vai slodzes spriegums siltuma ievades formulā (pārbaudiet, kāds U ir WPS).",
        ),
        ("current_label", "Current (A)", "Ток (А)", "Strāva (A)"),
        (
            "current_hint",
            "Welding current in amperes; must match the process and wire size you use.",
            "Сварочный ток в амперах; должен соответствовать процессу и диаметру проволоки.",
            "Metināšanas strāva ampēros; jāatbilst procesam un stieples izmēram.",
        ),
        (
            "travelSpeed_label",
            "Travel speed (mm/min)",
            "Скорость сварки (мм/мин)",
            "Metināšanas ātrums (mm/min)",
        ),
        (
            "travelSpeed_hint",
            "Torch travel speed along the joint; must be greater than zero. Use consistent units (mm/min here).",
            "Скорость движения горелки вдоль шва; должна быть > 0. Единицы — мм/мин.",
            "Lodes kustības ātrums gar šuvi; jābūt > 0. Vienības — mm/min.",
        ),
        ("result_label", "Heat input", "Тепловложение", "Siltuma ievade"),
    ],
    "gas-flow_fields": [
        (
            "flowRate_label",
            "Flow rate (L/min)",
            "Расход газа (л/мин)",
            "Gāzes plūsma (L/min)",
        ),
        (
            "flowRate_hint",
            "Shielding gas flow at the torch (L/min), as set on the flowmeter or regulator.",
            "Расход защитного газа на горелке (л/мин), по расходомеру или редуктору.",
            "Aizsarggāzes plūsma pie lodes (L/min), pēc plūsmas mērītāja vai reduktora.",
        ),
        (
            "weldingTime_label",
            "Welding time (min)",
            "Время сварки (мин)",
            "Metināšanas laiks (min)",
        ),
        (
            "weldingTime_hint",
            "Total arc time in minutes for the calculation period (not necessarily clock time).",
            "Суммарное арк-время в минутах за выбранный период (не обязательно хронометраж смены).",
            "Kopējais loka laiks minūtēs izvēlētajam periodam (ne obligāti maiņas laiks).",
        ),
        (
            "cylinderVolume_label",
            "Cylinder volume (L)",
            "Объём баллона (л)",
            "Balona tilpums (L)",
        ),
        (
            "cylinderVolume_hint",
            "Gas volume of the full cylinder in litres (often stated on the cylinder or data sheet).",
            "Объём газа в полном баллоне в литрах (часто указан на баллоне или в паспорте).",
            "Gāzes tilpums pilnā balonā litros (bieži norādīts uz balona vai datu lapā).",
        ),
        ("consumption_label", "Gas consumption", "Расход газа", "Gāzes patēriņš"),
        (
            "cylinderDuration_label",
            "Cylinder duration",
            "Время работы баллона",
            "Balona darbības laiks",
        ),
    ],
    "shielding-gas_fields": [
        (
            "wireDiameter_label",
            "Wire diameter (mm)",
            "Диаметр проволоки (мм)",
            "Stieples diametrs (mm)",
        ),
        (
            "wireDiameter_hint",
            "Filler wire diameter; larger wires often allow a slightly wider flow window.",
            "Диаметр проволоки; на больших диаметрах окно расхода часто шире.",
            "Pildstieples diametrs; lielākiem diametriem plūsmas logs bieži ir platāks.",
        ),
        ("material_label", "Material", "Материал", "Materiāls"),
        (
            "material_hint",
            "Base material group (steel, stainless, aluminium) affects recommended shielding and flow.",
            "Группа материала (сталь, нержавейка, алюминий) влияет на защиту и расход.",
            "Materiālu grupa (tērauds, nerūsējošais, alumīnijs) ietekmē aizsardzību un plūsmu.",
        ),
        ("process_label", "Process", "Процесс", "Process"),
        (
            "process_hint",
            "MIG/MAG or TIG — different torch and shielding behaviour.",
            "MIG/MAG или TIG — разное поведение факела и защиты.",
            "MIG/MAG vai TIG — atšķirīga lodes un aizsardzības uzvedība.",
        ),
        (
            "flowRange_label",
            "Recommended flow",
            "Рекомендуемый расход",
            "Ieteicamā plūsma",
        ),
        ("typical_label", "Typical", "Типичный", "Tipisks"),
        ("steel_option", "Steel", "Сталь", "Tērauds"),
        (
            "stainless_option",
            "Stainless steel",
            "Нержавеющая сталь",
            "Nerūsējošais tērauds",
        ),
        ("aluminum_option", "Aluminum", "Алюминий", "Alumīnijs"),
        ("migMag_option", "MIG/MAG", "MIG/MAG", "MIG/MAG"),
        ("tig_option", "TIG", "TIG", "TIG"),
    ],
    "gas-cutting_fields": [
        (
            "plateThickness_label",
            "Plate thickness (mm)",
            "Толщина листа (мм)",
            "Loksnes biezums (mm)",
        ),
        (
            "plateThickness_hint",
            "Thickness of the plate to cut; drives oxygen pressure and cutting setup.",
            "Толщина режимого листа; задаёт давление кислорода и настройку резки.",
            "Griešanās loksnes biezums; nosaka skābekļa spiedienu un iestatījumu.",
        ),
        ("gasType_label", "Gas type", "Тип газа", "Gāzes veids"),
        (
            "gasType_hint",
            "Fuel gas type (e.g. acetylene or propane) affects fuel flow recommendations.",
            "Тип горючего газа (ацетилен, пропан и т.д.) влияет на расход топлива.",
            "Degvielas gāzes veids (acetilēns, propāns u. c.) ietekmē degvielas plūsmu.",
        ),
        (
            "cuttingSpeed_label",
            "Cutting speed (m/min, optional)",
            "Скорость резки (м/мин, опционально)",
            "Griešanas ātrums (m/min, pēc izvēles)",
        ),
        (
            "cuttingSpeed_hint",
            "Optional: actual cutting speed to refine estimates; leave empty if unknown.",
            "По желанию: фактическая скорость резки; оставьте пустым, если неизвестна.",
            "Pēc izvēles: faktiskais griešanas ātrums; atstājiet tukšu, ja nezināms.",
        ),
        ("cuttingSpeedPlaceholder_label", "Optional", "Опционально", "Pēc izvēles"),
        ("o2Pressure_label", "O₂ pressure", "Давление O₂", "O₂ spiediens"),
        ("fuelFlow_label", "Fuel flow", "Расход топлива", "Degvielas plūsma"),
        ("acetylene_option", "Acetylene", "Ацетилен", "Acetilēns"),
        ("propane_option", "Propane", "Пропан", "Propāns"),
    ],
    "welding-cost_fields": [
        (
            "wirePrice_label",
            "Wire price (per kg)",
            "Цена проволоки (за кг)",
            "Stieples cena (par kg)",
        ),
        (
            "wirePrice_hint",
            "Purchase price per kilogram of filler wire.",
            "Закупочная цена за килограмм присадочной проволоки.",
            "Iepirkuma cena par pildstieples kilogramu.",
        ),
        (
            "gasPrice_label",
            "Gas price (per cylinder)",
            "Цена газа (за баллон)",
            "Gāzes cena (par balonu)",
        ),
        (
            "gasPrice_hint",
            "Price per full cylinder of shielding gas (same units as in your quote).",
            "Цена за полный баллон защитного газа (в тех же единицах, что в смете).",
            "Cena par pilnu aizsarggāzes balonu (tās pašas vienības kā piedāvājumā).",
        ),
        (
            "cylinderVolume_label",
            "Cylinder volume (L)",
            "Объём баллона (л)",
            "Balona tilpums (L)",
        ),
        (
            "cylinderVolume_hint",
            "Gas content of one cylinder in litres, for consumption and cost conversion.",
            "Объём газа в одном баллоне в литрах (для пересчёта расхода и стоимости).",
            "Gāzes tilpums vienā balonā litros (patēriņa un izmaksu pārrēķinam).",
        ),
        (
            "depositionRate_label",
            "Deposition rate (kg/h)",
            "Скорость наплавки (кг/ч)",
            "Nanosanas ātrums (kg/h)",
        ),
        (
            "depositionRate_hint",
            "Mass of metal deposited per hour for your parameters (from datasheets or measurements).",
            "Масса наплавленного металла в час при ваших режимах (из данных или замеров).",
            "Nanosināta metāla masa stundā pie jūsu režīmiem (no datu lapām vai mērījumiem).",
        ),
        (
            "weldingTime_label",
            "Welding time (h)",
            "Время сварки (ч)",
            "Metināšanas laiks (h)",
        ),
        (
            "weldingTime_hint",
            "Arc hours for the job or batch being estimated.",
            "Часы дуги по заказу или партии, которую оцениваете.",
            "Loka stundas darbam vai partijai, ko novērtējat.",
        ),
        (
            "wireConsumption_label",
            "Wire consumption",
            "Расход проволоки",
            "Stieples patēriņš",
        ),
        ("gasConsumption_label", "Gas consumption", "Расход газа", "Gāzes patēriņš"),
        (
            "cylindersUsed_label",
            "Cylinders used",
            "Баллонов использовано",
            "Izmantotie baloni",
        ),
        ("wireCost_label", "Wire cost", "Стоимость проволоки", "Stieples izmaksas"),
        ("gasCost_label", "Gas cost", "Стоимость газа", "Gāzes izmaksas"),
        ("totalCost_label", "Total cost", "Общая стоимость", "Kopējās izmaksas"),
    ],
    "welding-parameters_fields": [
        (
            "plateThickness_label",
            "Plate thickness (mm)",
            "Толщина листа (мм)",
            "Loksnes biezums (mm)",
        ),
        (
            "plateThickness_hint",
            "Main plate thickness in the joint; primary input for suggested heat.",
            "Основная толщина листа в соединении; главный ввод для подбора тепла.",
            "Galvenā loksnes biezums savienojumā; galvenā ievade siltuma ieteikumam.",
        ),
        ("jointType_label", "Joint type", "Тип соединения", "Savienojuma veids"),
        (
            "jointType_hint",
            "Butt, fillet, lap or corner — influences recommended parameters.",
            "Тип шва (стыковой, угловой, нахлёст, угол) влияет на рекомендуемые параметры.",
            "Šuvju veids (butt, fillet, overlap, stūris) ietekmē ieteiktos parametrus.",
        ),
        (
            "wireDiameter_label",
            "Wire diameter (mm)",
            "Диаметр проволоки (мм)",
            "Stieples diametrs (mm)",
        ),
        (
            "wireDiameter_hint",
            "Filler wire diameter used in the process.",
            "Диаметр присадочной проволоки в процессе.",
            "Pildstieples diametrs procesā.",
        ),
        ("current_label", "Current", "Ток", "Strāva"),
        ("voltage_label", "Voltage", "Напряжение", "Spriegums"),
        ("travelSpeed_label", "Travel speed", "Скорость сварки", "Metināšanas ātrums"),
        ("butt_option", "Butt", "Стыковое", "Sadursavienojums"),
        ("fillet_option", "Fillet", "Угловое", "Stūra šuve"),
        ("lap_option", "Lap", "Нахлёст", "Pārlaidums"),
        ("corner_option", "Corner", "Угол", "Stūris"),
    ],
}


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


def seed_calculator_ui(apps, schema_editor):
    upsert_blocks(apps, "calculators", "common", COMMON_BLOCKS)
    for block, rows in PAGE_BLOCKS.items():
        upsert_blocks(apps, "calculators", block, rows)
    for block, rows in FIELD_BLOCKS.items():
        upsert_blocks(apps, "calculators", block, rows)


def remove_calculator_ui(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    SiteTextBlock.objects.filter(page="calculators").delete()


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0031_tools_list_ui_site_text_blocks"),
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
                ],
                max_length=50,
            ),
        ),
        migrations.RunPython(seed_calculator_ui, remove_calculator_ui),
    ]
