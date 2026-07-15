# flake8: noqa: E501
from django.db import migrations


ABOUT_UI_BLOCKS = [
    ("title", "About Me", "Обо мне", "Par mani"),
    (
        "profileSummaryEyebrow",
        "Engineering profile",
        "Инженерный профиль",
        "Inženiera profils",
    ),
    (
        "profileSummaryTitle",
        "Welding engineer for production, training, and process stability",
        "Инженер по сварке для производства, обучения и стабильности процесса",
        "Metināšanas inženieris ražošanai, apmācībai un procesa stabilitātei",
    ),
    (
        "profileSummaryLead",
        "I combine hands-on welder experience, IWE engineering training, teaching practice, and industrial gas consulting to help production teams connect weld quality, parameters, shielding gases, and practical implementation.",
        "Я соединяю практический опыт сварщика, инженерную подготовку IWE, преподавание и консультации по промышленным газам, чтобы помогать производственным командам связывать качество шва, режимы, защитные газы и практическое внедрение.",
        "Es apvienoju praktisku metinātāja pieredzi, IWE inženiera sagatavošanu, pasniedzēja darbu un industriālo gāzu konsultācijas, lai palīdzētu ražošanas komandām sasaistīt šuves kvalitāti, parametrus, aizsarggāzes un praktisku ieviešanu.",
    ),
    (
        "profileProofs_1",
        "International Welding Engineer (IWE)",
        "International Welding Engineer (IWE)",
        "International Welding Engineer (IWE)",
    ),
    (
        "profileProofs_2",
        "Experience as welder, instructor, and welding engineer",
        "Опыт работы сварщиком, преподавателем и инженером по сварке",
        "Pieredze metinātāja, pasniedzēja un metināšanas inženiera darbā",
    ),
    (
        "profileProofs_3",
        "Focus on MIG/MAG, TIG, shielding gases, defects, and WPS support",
        "Фокус на MIG/MAG, TIG, защитных газах, дефектах и поддержке WPS",
        "Fokuss uz MIG/MAG, TIG, aizsarggāzēm, defektiem un WPS atbalstu",
    ),
    (
        "linkedinCta",
        "View LinkedIn profile",
        "Открыть профиль LinkedIn",
        "Atvērt LinkedIn profilu",
    ),
    ("cvCta", "Download CV", "Скачать CV", "Lejupielādēt CV"),
    ("education", "Education", "Образование", "Izglītība"),
    (
        "qualifications",
        "Professional Qualifications",
        "Профессиональные квалификации",
        "Profesionālās kvalifikācijas",
    ),
    (
        "diplomas",
        "Diplomas & Certifications",
        "Дипломы и сертификаты",
        "Diplomi un sertifikāti",
    ),
    ("bachelor", "Bachelor's degree", "Бакалавр", "Bakalaura grāds"),
    ("master", "Master's degree (RTU)", "Магистр (РТУ)", "Maģistra grāds (RTU)"),
    (
        "iwe",
        "International Welding Engineer (IWE) certificate",
        "Сертификат международного инженера по сварке (IWE)",
        "Starptautiskā metināšanas inženiera (IWE) sertifikāts",
    ),
    ("mma_mag", "MMA/MAG Welding", "Сварка MMA/MAG", "MMA/MAG metināšana"),
    ("tig", "TIG Welding", "Сварка TIG", "TIG metināšana"),
    (
        "bachelorSummary",
        "Higher education: bachelor’s degree from RTU.",
        "Высшее техническое образование: бакалавриат РТУ.",
        "Augstākā izglītība: bakalaura grāds RTU.",
    ),
    (
        "masterSummary",
        "RTU master’s degree — advanced engineering preparation.",
        "Магистр РТУ — углублённая инженерная подготовка.",
        "RTU maģistra grāds — padziļināta inženieru sagatavošana.",
    ),
    (
        "iweSummary",
        "International welding engineer qualification under the IIW/EWF programme.",
        "Международная квалификация инженера по сварке в рамках программы IIW/EWF.",
        "Starptautiska metināšanas inženiera kvalifikācija IIW/EWF programmas ietvaros.",
    ),
    (
        "mma_magSummary",
        "Qualification in manual metal arc and semi-automatic welding (MMA/MAG).",
        "Квалификация по ручной дуговой и полуавтоматической сварке (MMA/MAG).",
        "Kvalifikācija manuālajā loka un pusautomātiskajā metināšanā (MMA/MAG).",
    ),
    (
        "tigSummary",
        "Certification in TIG / GTAW welding.",
        "Сертификация по аргонодуговой сварке (TIG/GTAW).",
        "Sertifikācija TIG / GTAW metināšanā.",
    ),
    ("diplomaOpenInModal", "View", "Просмотреть", "Skatīt"),
    ("diplomaOpenNewTab", "Open in new tab", "В новой вкладке", "Jaunā cilnē"),
    ("diplomaCloseModal", "Close", "Закрыть", "Aizvērt"),
    (
        "diplomaPdfViewerTitle",
        "PDF document viewer",
        "Просмотр PDF-документа",
        "PDF dokumenta skatītājs",
    ),
    (
        "diplomaPreviewAlt",
        "Preview of document “{title}”",
        "Превью документа «{title}»",
        "Priekšskatījums dokumentam «{title}»",
    ),
]


def seed_about_ui(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    for key, text_en, text_ru, text_lv in ABOUT_UI_BLOCKS:
        SiteTextBlock.objects.update_or_create(
            page="about",
            block="ui",
            key=key,
            defaults={
                "text_en": text_en,
                "text_ru": text_ru,
                "text_lv": text_lv,
            },
        )


def remove_about_ui(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    SiteTextBlock.objects.filter(
        page="about",
        block="ui",
        key__in=[key for key, *_ in ABOUT_UI_BLOCKS],
    ).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0026_home_about_teaser_site_text_blocks"),
    ]

    operations = [
        migrations.RunPython(seed_about_ui, remove_about_ui),
    ]
