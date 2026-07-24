# flake8: noqa: E501
from django.db import migrations


LEGAL_PRIVACY_BLOCKS = [
    (
        "title",
        "Privacy Policy",
        "Политика конфиденциальности",
        "Privātuma politika",
    ),
    (
        "body",
        '<p>This policy describes how Oleg Suvorov processes personal data when you use this website, subscribe to the blog newsletter, or send a message through contact forms.</p><p><strong>Data controller:</strong> Oleg Suvorov. For questions about this policy, use the <a href="/contact">contact page</a>.</p><p><strong>What we collect:</strong> email address, name (optional), message text, page URL, referrer, and UTM tags when you submit a form.</p><p><strong>Why we process data:</strong> to respond to inquiries, send blog updates after your consent, and maintain an internal record of subscriptions and messages.</p><p><strong>Retention:</strong> contact and article questions are kept as long as needed to handle the request and maintain service history. You may request deletion by email.</p>',
        '<p>Настоящая политика описывает, как Олег Суворов обрабатывает персональные данные при использовании сайта, подписке на рассылку блога и отправке сообщений через формы.</p><p><strong>Оператор данных:</strong> Олег Суворов. По вопросам политики используйте <a href="/contact">страницу контактов</a>.</p><p><strong>Какие данные собираем:</strong> email, имя (необязательно), текст сообщения, URL страницы, referrer и UTM-метки при отправке формы.</p><p><strong>Зачем обрабатываем:</strong> чтобы ответить на обращения, отправлять обновления блога после вашего согласия и вести внутренний учёт подписок и сообщений.</p><p><strong>Срок хранения:</strong> обращения и вопросы хранятся столько, сколько нужно для ответа и истории сервиса. Можно запросить удаление по email.</p>',
        '<p>Šī politika apraksta, kā Oleg Suvorov apstrādā personas datus, izmantojot vietni, abonējot bloga jaunumus vai sūtot ziņas caur formām.</p><p><strong>Pārzinis:</strong> Oleg Suvorov. Jautājumiem par politiku izmantojiet <a href="/contact">kontaktu lapu</a>.</p><p><strong>Kādus datus vācam:</strong> e-pastu, vārdu (neobligāti), ziņas tekstu, lapas URL, referrer un UTM tagus, iesniedzot formu.</p><p><strong>Mērķis:</strong> atbildēt uz jautājumiem, sūtīt bloga jaunumus pēc jūsu piekrišanas un uzturēt iekšējo abonementu un ziņu uzskaiti.</p><p><strong>Glabāšana:</strong> jautājumi tiek glabāti tik ilgi, cik nepieciešams atbildei un pakalpojuma vēsturei. Varat pieprasīt dzēšanu pa e-pastu.</p>',
    ),
    (
        "newsletterSection",
        "<h2>Newsletter and Brevo</h2><p>Blog newsletter delivery is handled by <strong>Brevo</strong> (Sendinblue), which acts as an email service provider. When you subscribe, we send a double opt-in confirmation email. You are added to the mailing list only after you confirm the subscription.</p><p>You can unsubscribe at any time using the link in any newsletter email. Confirmed subscriptions are stored locally in our database as a reference record; the master mailing list is maintained in Brevo.</p>",
        "<h2>Рассылка и Brevo</h2><p>Доставка рассылки блога выполняется через <strong>Brevo</strong> (Sendinblue) как провайдера email-услуг. При подписке мы отправляем письмо двойного подтверждения (double opt-in). В список рассылки вы попадаете только после подтверждения.</p><p>Отписаться можно в любой момент по ссылке в письме. Подтверждённые подписки хранятся локально в базе как справочная запись; основной список рассылки ведётся в Brevo.</p>",
        "<h2>Jaunumi un Brevo</h2><p>Bloga jaunumu sūtīšanu nodrošina <strong>Brevo</strong> (Sendinblue) kā e-pasta pakalpojumu sniedzējs. Abonējot, mēs nosūtām double opt-in apstiprinājuma e-pastu. Sarakstā nonākat tikai pēc apstiprinājuma.</p><p>Varat atrakstīties jebkurā brīdī, izmantojot saiti jebkurā vēstulē. Apstiprinātie abonementi tiek glabāti lokāli datubāzē; galveno sarakstu uztur Brevo.</p>",
    ),
]

COMMON_NAV_BLOCKS = [
    ("privacyNav", "Privacy", "Конфиденциальность", "Privātums"),
]

BLOG_UI_BLOCKS = [
    (
        "newsletterConfirmedBanner",
        "Your subscription is confirmed. Thank you!",
        "Подписка подтверждена. Спасибо!",
        "Abonements apstiprināts. Paldies!",
    ),
]

PRIVACY_NOTE_UPDATES = [
    (
        "newsletter",
        "privacyNote",
        "By subscribing, you agree to receive emails about new articles. You can unsubscribe in any message.",
        "Нажимая «Подписаться», вы соглашаетесь получать письма о новых статьях. Отписаться можно в любое письмо.",
        "Nospiežot «Abonēt», jūs piekrītat saņemt e-pastus par jauniem rakstiem. Atrakstīties var jebkurā vēstulē.",
    ),
    (
        "article_question",
        "privacyNote",
        "By sending a question, you agree to the processing of your data to provide an answer.",
        "Отправляя вопрос, вы соглашаетесь на обработку данных для ответа.",
        "Nosūtot jautājumu, jūs piekrītat datu apstrādei, lai sniegtu atbildi.",
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


def seed_legal_privacy(apps, schema_editor):
    seed_blocks(apps, "legal", "privacy", LEGAL_PRIVACY_BLOCKS)
    seed_blocks(apps, "common", "nav", COMMON_NAV_BLOCKS)
    seed_blocks(apps, "blog", "ui", BLOG_UI_BLOCKS)
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    for block, key, text_en, text_ru, text_lv in PRIVACY_NOTE_UPDATES:
        SiteTextBlock.objects.update_or_create(
            page="blog",
            block=block,
            key=key,
            defaults={
                "text_en": text_en,
                "text_ru": text_ru,
                "text_lv": text_lv,
            },
        )


def remove_legal_privacy(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    SiteTextBlock.objects.filter(page="legal", block="privacy").delete()
    SiteTextBlock.objects.filter(page="common", block="nav", key="privacyNav").delete()
    SiteTextBlock.objects.filter(
        page="blog", block="ui", key="newsletterConfirmedBanner"
    ).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0039_contact_form_hint_site_text_blocks"),
    ]

    operations = [
        migrations.RunPython(seed_legal_privacy, remove_legal_privacy),
    ]
