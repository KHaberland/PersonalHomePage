# flake8: noqa: E501
from django.db import migrations


COOKIE_CONSENT_BLOCKS = [
    (
        "bannerText",
        "We use cookies to improve your experience, analyse website traffic and provide personalised content. You can accept all cookies, reject non-essential cookies or manage your preferences.",
        "Мы используем cookies для улучшения работы сайта, анализа трафика и персонализации контента. Вы можете принять все cookies, отклонить необязательные или настроить предпочтения.",
        "Mēs izmantojam sīkdatnes, lai uzlabotu jūsu pieredzi, analizētu apmeklējumu un personalizētu saturu. Jūs varat pieņemt visas sīkdatnes, noraidīt neobligātās vai pārvaldīt preferences.",
    ),
    ("acceptAll", "Accept all", "Принять все", "Pieņemt visas"),
    ("rejectAll", "Reject all", "Отклонить все", "Noraidīt visas"),
    (
        "managePreferences",
        "Manage preferences",
        "Настроить",
        "Pārvaldīt preferences",
    ),
    (
        "cookiePolicyLink",
        "Read our Cookie Policy.",
        "Политика cookies.",
        "Sīkdatņu politika.",
    ),
    (
        "necessaryTitle",
        "Necessary cookies",
        "Необходимые cookies",
        "Nepieciešamās sīkdatnes",
    ),
    (
        "necessaryDesc",
        "Required for the site to work: session, security and language preferences.",
        "Нужны для работы сайта: сессия, безопасность и языковые настройки.",
        "Nepieciešamas vietnes darbībai: sesija, drošība un valodas preferences.",
    ),
    (
        "necessaryAlwaysActive",
        "Always active",
        "Всегда активны",
        "Vienmēr aktīvas",
    ),
    (
        "analyticsTitle",
        "Analytics cookies",
        "Аналитические cookies",
        "Analītikas sīkdatnes",
    ),
    (
        "analyticsDesc",
        "Help us understand how visitors use the site (e.g. Google Analytics). Disabled until you opt in.",
        "Помогают понять, как используют сайт (например, Google Analytics). Включены только с вашего согласия.",
        "Palīdz saprast, kā apmeklētāji lieto vietni (piem., Google Analytics). Ieslēgtas tikai ar jūsu piekrišanu.",
    ),
    (
        "marketingTitle",
        "Marketing cookies",
        "Маркетинговые cookies",
        "Mārketinga sīkdatnes",
    ),
    (
        "marketingDesc",
        "Used for email tracking pixels and advertising if enabled later. Currently not in use.",
        "Для tracking-пикселей и рекламы, если будут подключены. Сейчас не используются.",
        "E-pasta tracking pikseļiem un reklāmai, ja tiks ieslēgti. Pašlaik netiek izmantoti.",
    ),
    (
        "savePreferences",
        "Save preferences",
        "Сохранить",
        "Saglabāt preferences",
    ),
    (
        "modalTitle",
        "Cookie preferences",
        "Настройки cookies",
        "Sīkdatņu preferences",
    ),
    ("closeLabel", "Close", "Закрыть", "Aizvērt"),
    (
        "cookieSettings",
        "Cookie settings",
        "Настройки cookies",
        "Sīkdatņu iestatījumi",
    ),
]

COMMON_NAV_BLOCKS = [
    (
        "cookiePolicyNav",
        "Cookie Policy",
        "Политика cookies",
        "Sīkdatņu politika",
    ),
]

COOKIE_POLICY_BODY_EN = (
    "<p>This page describes how this website uses cookies and similar "
    "technologies.</p>"
    "<h2>How consent works</h2>"
    "<p>Analytics and marketing cookies are not loaded until you opt in via "
    "the cookie banner. You can change your choices at any time using the "
    "cookie settings control at the bottom of this page.</p>"
    "<h2>Cookie inventory</h2>"
    "<p>The table lists cookies and similar storage we use today, plus "
    "categories we may enable later. We do not describe trackers that are "
    "not deployed on this site.</p>"
    "<table>"
    "<thead><tr><th>Name</th><th>Category</th><th>Purpose</th>"
    "<th>Duration</th><th>Status</th></tr></thead>"
    "<tbody>"
    "<tr><td>Technical cookies (hosting / Next.js)</td><td>Necessary</td>"
    "<td>Basic site delivery, security and routing</td><td>Session</td>"
    "<td>Active</td></tr>"
    "<tr><td>cookie_consent_v1 (localStorage)</td><td>Necessary</td>"
    "<td>Stores your cookie consent choices</td><td>12 months</td>"
    "<td>Active</td></tr>"
    "<tr><td>_ga, _gid (Google Analytics)</td><td>Analytics</td>"
    "<td>Website usage statistics</td><td>Up to 24 months</td>"
    "<td>Not enabled — loaded only if we add Google Analytics and you opt in"
    "</td></tr>"
    "<tr><td>Marketing pixels</td><td>Marketing</td>"
    "<td>Advertising or email tracking</td><td>—</td>"
    "<td>Not in use</td></tr>"
    "</tbody></table>"
    "<p>Google Analytics is not currently enabled on this site.</p>"
)

COOKIE_POLICY_BODY_RU = (
    "<p>На этой странице описано, как сайт использует cookies и похожие "
    "технологии.</p>"
    "<h2>Как работает согласие</h2>"
    "<p>Аналитические и маркетинговые cookies не загружаются, пока вы не "
    "дадите согласие через баннер. Изменить выбор можно в любой момент через "
    "настройки cookies внизу страницы.</p>"
    "<h2>Список cookies</h2>"
    "<p>В таблице — cookies и похожее хранилище, которое используется сейчас, "
    "и категории, которые могут быть добавлены позже. Мы не описываем "
    "трекеры, которых нет на сайте.</p>"
    "<table>"
    "<thead><tr><th>Название</th><th>Категория</th><th>Назначение</th>"
    "<th>Срок</th><th>Статус</th></tr></thead>"
    "<tbody>"
    "<tr><td>Технические cookies (хостинг / Next.js)</td><td>Необходимые</td>"
    "<td>Базовая доставка сайта, безопасность и маршрутизация</td>"
    "<td>Сессия</td><td>Активны</td></tr>"
    "<tr><td>cookie_consent_v1 (localStorage)</td><td>Необходимые</td>"
    "<td>Хранит ваш выбор по cookies</td><td>12 месяцев</td>"
    "<td>Активно</td></tr>"
    "<tr><td>_ga, _gid (Google Analytics)</td><td>Аналитические</td>"
    "<td>Статистика использования сайта</td><td>До 24 месяцев</td>"
    "<td>Не включено — только если подключим Google Analytics и вы "
    "согласитесь</td></tr>"
    "<tr><td>Маркетинговые пиксели</td><td>Маркетинговые</td>"
    "<td>Реклама или email-tracking</td><td>—</td>"
    "<td>Не используются</td></tr>"
    "</tbody></table>"
    "<p>Google Analytics на сайте сейчас не подключён.</p>"
)

COOKIE_POLICY_BODY_LV = (
    "<p>Šajā lapā aprakstīts, kā vietne izmanto sīkdatnes un līdzīgas "
    "tehnoloģijas.</p>"
    "<h2>Kā darbojas piekrišana</h2>"
    "<p>Analītikas un mārketinga sīkdatnes netiek ielādētas, kamēr "
    "nepiekrītat caur baneri. Preferences var mainīt jebkurā brīdī, "
    "izmantojot sīkdatņu iestatījumus lapas apakšā.</p>"
    "<h2>Sīkdatņu saraksts</h2>"
    "<p>Tabulā ir sīkdatnes un līdzīga glabātuve, ko izmantojam šobrīd, "
    "un kategorijas, kuras varam ieslēgt vēlāk. Neaprakstām trackerus, "
    "kas nav izvietoti vietnē.</p>"
    "<table>"
    "<thead><tr><th>Nosaukums</th><th>Kategorija</th><th>Mērķis</th>"
    "<th>Ilgtspēja</th><th>Statuss</th></tr></thead>"
    "<tbody>"
    "<tr><td>Tehniskās sīkdatnes (hostings / Next.js)</td>"
    "<td>Nepieciešamās</td>"
    "<td>Pamata piegāde, drošība un maršrutēšana</td><td>Sesija</td>"
    "<td>Aktīvas</td></tr>"
    "<tr><td>cookie_consent_v1 (localStorage)</td><td>Nepieciešamās</td>"
    "<td>Glabā jūsu sīkdatņu izvēli</td><td>12 mēneši</td>"
    "<td>Aktīva</td></tr>"
    "<tr><td>_ga, _gid (Google Analytics)</td><td>Analītikas</td>"
    "<td>Apmeklējumu statistika</td><td>Līdz 24 mēnešiem</td>"
    "<td>Nav ieslēgts — tikai, ja pievienosim Google Analytics un "
    "piekrītat</td></tr>"
    "<tr><td>Mārketinga pikseļi</td><td>Mārketinga</td>"
    "<td>Reklāma vai e-pasta izsekošana</td><td>—</td>"
    "<td>Netiek izmantoti</td></tr>"
    "</tbody></table>"
    "<p>Google Analytics šobrīd nav ieslēgts.</p>"
)

COOKIE_POLICY_BLOCKS = [
    (
        "title",
        "Cookie Policy",
        "Политика cookies",
        "Sīkdatņu politika",
    ),
    (
        "body",
        COOKIE_POLICY_BODY_EN,
        COOKIE_POLICY_BODY_RU,
        COOKIE_POLICY_BODY_LV,
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
    seed_blocks(apps, "common", "cookie_consent", COOKIE_CONSENT_BLOCKS)
    seed_blocks(apps, "common", "nav", COMMON_NAV_BLOCKS)
    seed_blocks(apps, "legal", "cookie_policy", COOKIE_POLICY_BLOCKS)


def backwards(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    SiteTextBlock.objects.filter(page="common", block="cookie_consent").delete()
    SiteTextBlock.objects.filter(
        page="common", block="nav", key="cookiePolicyNav"
    ).delete()
    SiteTextBlock.objects.filter(page="legal", block="cookie_policy").delete()


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0041_article_faq_and_contact_types"),
    ]

    operations = [
        migrations.RunPython(forwards, backwards),
    ]
