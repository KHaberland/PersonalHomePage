# flake8: noqa: E501
from django.db import migrations


CONTACT_TEXT_BLOCKS = [
    (
        "hero",
        "title",
        "Request consultation",
        "Запросить консультацию",
        "Pieprasīt konsultāciju",
    ),
    (
        "hero",
        "description",
        "Describe your welding production task, defect pattern, process question, or training need. I will suggest the next practical step.",
        "Опишите производственную задачу, дефект, вопрос по процессу или потребность в обучении. Я предложу следующий практический шаг.",
        "Aprakstiet metināšanas ražošanas uzdevumu, defektu, procesa jautājumu vai apmācību vajadzību. Es ieteikšu nākamo praktisko soli.",
    ),
    (
        "form",
        "formTitle",
        "Consultation request",
        "Запрос на консультацию",
        "Konsultācijas pieprasījums",
    ),
    ("form", "formName", "Name", "Имя", "Vārds"),
    ("form", "formEmail", "Your email", "Ваш email", "Jūsu e-pasts"),
    (
        "form",
        "formRequestType",
        "Request type",
        "Тип запроса",
        "Pieprasījuma tips",
    ),
    (
        "form",
        "formRequestTypePlaceholder",
        "Choose one",
        "Выберите один вариант",
        "Izvēlieties vienu",
    ),
    (
        "form",
        "formMessage",
        "Message",
        "Сообщение",
        "Ziņa",
    ),
    (
        "form",
        "formHint",
        "Your message will be inserted into your email app. Send it manually if needed.",
        "Сообщение будет подставлено в письмо. При необходимости отправьте его вручную с вашего ящика.",
        "Ziņa tiks ievietota priekšā e-pasta programmā. Nepieciešamības gadījumā nosūtiet manuāli.",
    ),
    (
        "form",
        "formSubjectPrefix",
        "Website inquiry",
        "Запрос с сайта",
        "Pieprasījums no vietnes",
    ),
    ("form", "formBodyName", "Name", "Имя", "Vārds"),
    ("form", "formBodyEmail", "Email", "Email", "E-pasts"),
    (
        "form",
        "formBodyRequestType",
        "Request type",
        "Тип запроса",
        "Pieprasījuma tips",
    ),
    (
        "form",
        "requestConsultation",
        "Request consultation",
        "Запросить консультацию",
        "Pieprasīt konsultāciju",
    ),
    (
        "request_types",
        "requestTypeDefects",
        "Defects / weld quality",
        "Дефекты / качество шва",
        "Defekti / šuves kvalitāte",
    ),
    (
        "request_types",
        "requestTypeProcess",
        "Process / WPS support",
        "Процесс / поддержка WPS",
        "Process / WPS atbalsts",
    ),
    (
        "request_types",
        "requestTypeTraining",
        "Training / skills",
        "Обучение / навыки",
        "Apmācība / prasmes",
    ),
    ("contact_methods", "email", "Email", "Email", "E-pasts"),
    (
        "contact_methods",
        "linkedin",
        "Professional profile and updates",
        "Профессиональный профиль и обновления",
        "Profesionālais profils un atjauninājumi",
    ),
    (
        "contact_methods",
        "youtube",
        "Welding videos and tutorials",
        "Видео по сварке и обучающие материалы",
        "Metināšanas video un apmācības",
    ),
    (
        "empty",
        "noContact",
        "Contact information is being updated. Please check back later.",
        "Контактная информация обновляется. Загляните позже.",
        "Kontaktinformācija tiek atjaunināta. Lūdzu, pārbaudiet vēlāk.",
    ),
    ("map", "mapTitle", "Map", "Карта", "Karte"),
    (
        "map",
        "mapDescription",
        "Work region: Latvia and remote consulting. Map pin is approximate.",
        "Регион работы: Латвия и удалённые консультации. Точка на карте ориентировочная.",
        "Darba reģions: Latvija un attālās konsultācijas. Kartes punkts ir aptuvens.",
    ),
]


def seed_contact_site_text_blocks(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")

    for block, key, text_en, text_ru, text_lv in CONTACT_TEXT_BLOCKS:
        SiteTextBlock.objects.update_or_create(
            page="contact",
            block=block,
            key=key,
            defaults={
                "text_en": text_en,
                "text_ru": text_ru,
                "text_lv": text_lv,
            },
        )


def remove_contact_site_text_blocks(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    keys_by_block = {}
    for block, key, *_ in CONTACT_TEXT_BLOCKS:
        keys_by_block.setdefault(block, []).append(key)

    for block, keys in keys_by_block.items():
        SiteTextBlock.objects.filter(
            page="contact",
            block=block,
            key__in=keys,
        ).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0018_book_site_text_blocks"),
    ]

    operations = [
        migrations.RunPython(
            seed_contact_site_text_blocks,
            remove_contact_site_text_blocks,
        ),
    ]
