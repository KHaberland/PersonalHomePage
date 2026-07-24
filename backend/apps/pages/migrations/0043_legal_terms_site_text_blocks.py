# flake8: noqa: E501
from django.db import migrations


TERMS_BODY_EN = (
    "<p>These Terms of Use govern access to and use of this website operated by "
    "Oleg Suvorov.</p>"
    "<h2>Acceptance</h2>"
    "<p>By using this site you agree to these terms. If you do not agree, "
    "please do not use the website.</p>"
    "<h2>Informational content</h2>"
    "<p>Articles, calculators, and other materials are provided for general "
    "engineering information. They are not a substitute for project-specific "
    "engineering judgement, codes, or certified procedures. You remain "
    "responsible for how you apply any information.</p>"
    "<h2>No warranty</h2>"
    "<p>The site is provided “as is”. We do not warrant uninterrupted "
    "availability, completeness, or fitness for a particular purpose.</p>"
    "<h2>Intellectual property</h2>"
    "<p>Unless stated otherwise, text, images, and other content on this site "
    "are owned by Oleg Suvorov. You may not copy or redistribute substantial "
    "parts without prior written permission.</p>"
    "<h2>Privacy and cookies</h2>"
    "<p>Personal data is described in the "
    '<a href="/privacy">Privacy Policy</a>. Cookie use is described in the '
    '<a href="/cookie-policy">Cookie Policy</a>.</p>'
    "<h2>Contact</h2>"
    "<p>Questions about these terms: use the "
    '<a href="/contact">contact page</a>.</p>'
)

TERMS_BODY_RU = (
    "<p>Настоящие Условия использования регулируют доступ к сайту и его "
    "использование. Сайт ведёт Олег Суворов.</p>"
    "<h2>Принятие условий</h2>"
    "<p>Используя сайт, вы соглашаетесь с этими условиями. Если вы не "
    "согласны — пожалуйста, не используйте сайт.</p>"
    "<h2>Информационный характер</h2>"
    "<p>Статьи, калькуляторы и другие материалы носят общий информационный "
    "характер. Они не заменяют проектное инженерное решение, нормы или "
    "сертифицированные процедуры. Ответственность за применение информации "
    "остаётся на вас.</p>"
    "<h2>Отказ от гарантий</h2>"
    "<p>Сайт предоставляется «как есть». Мы не гарантируем бесперебойную "
    "работу, полноту или пригодность для конкретной цели.</p>"
    "<h2>Интеллектуальная собственность</h2>"
    "<p>Если не указано иное, тексты, изображения и другой контент принадлежат "
    "Олегу Суворову. Копировать или распространять существенные части без "
    "предварительного письменного разрешения нельзя.</p>"
    "<h2>Конфиденциальность и cookies</h2>"
    "<p>Обработка персональных данных описана в "
    '<a href="/privacy">Политике конфиденциальности</a>. Использование cookies '
    "— в "
    '<a href="/cookie-policy">Политике cookies</a>.</p>'
    "<h2>Контакты</h2>"
    "<p>Вопросы по условиям: "
    '<a href="/contact">страница контактов</a>.</p>'
)

TERMS_BODY_LV = (
    "<p>Šie Lietošanas noteikumi regulē piekļuvi šai vietnei un tās "
    "izmantošanu. Vietni uztur Oleg Suvorov.</p>"
    "<h2>Pieņemšana</h2>"
    "<p>Izmantojot vietni, jūs piekrītat šiem noteikumiem. Ja nepiekrītat, "
    "lūdzu, neizmantojiet vietni.</p>"
    "<h2>Informatīvs saturs</h2>"
    "<p>Raksti, kalkulatori un citi materiāli ir vispārīga inženiertehniska "
    "informācija. Tie neaizstāj projekta specifisku inženieru vērtējumu, "
    "normatīvus vai sertificētas procedūras. Par informācijas pielietojumu "
    "atbildat jūs.</p>"
    "<h2>Bez garantijas</h2>"
    "<p>Vietne tiek nodrošināta «kā ir». Mēs negarantējam nepārtrauktu "
    "pieejamību, pilnīgumu vai piemērotību konkrētam mērķim.</p>"
    "<h2>Intelektuālais īpašums</h2>"
    "<p>Ja nav norādīts citādi, teksti, attēli un cits saturs pieder "
    "Olegam Suvorovam. Būtisku daļu kopēšana vai izplatīšana bez iepriekšējas "
    "rakstiskas atļaujas nav atļauta.</p>"
    "<h2>Privātums un sīkdatnes</h2>"
    "<p>Personas datu apstrāde ir aprakstīta "
    '<a href="/privacy">Privātuma politikā</a>. Sīkdatņu izmantošana — '
    '<a href="/cookie-policy">Sīkdatņu politikā</a>.</p>'
    "<h2>Kontakti</h2>"
    "<p>Jautājumiem par noteikumiem izmantojiet "
    '<a href="/contact">kontaktu lapu</a>.</p>'
)

LEGAL_TERMS_BLOCKS = [
    (
        "title",
        "Terms of Use",
        "Условия использования",
        "Lietošanas noteikumi",
    ),
    (
        "body",
        TERMS_BODY_EN,
        TERMS_BODY_RU,
        TERMS_BODY_LV,
    ),
]

COMMON_NAV_BLOCKS = [
    (
        "termsNav",
        "Terms of Use",
        "Условия использования",
        "Lietošanas noteikumi",
    ),
]


def seed_blocks(apps, page, block, blocks):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    for key, text_en, text_ru, text_lv in blocks:
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


def forwards(apps, schema_editor):
    seed_blocks(apps, "legal", "terms", LEGAL_TERMS_BLOCKS)
    seed_blocks(apps, "common", "nav", COMMON_NAV_BLOCKS)


def backwards(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    SiteTextBlock.objects.filter(page="legal", block="terms").delete()
    SiteTextBlock.objects.filter(page="common", block="nav", key="termsNav").delete()


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0042_cookie_consent_ui_site_text_blocks"),
    ]

    operations = [
        migrations.RunPython(forwards, backwards),
    ]
