# flake8: noqa: E501
from django.db import migrations


PRIVACY_BODY_EN_BEFORE = '<p>This policy describes how Oleg Suvorov processes personal data when you use this website, subscribe to the blog newsletter, or send a message through contact forms.</p><p><strong>Data controller:</strong> Oleg Suvorov. For questions about this policy, use the <a href="/contact">contact page</a>.</p><p><strong>What we collect:</strong> email address, name (optional), message text, page URL, referrer, and UTM tags when you submit a form.</p><p><strong>Why we process data:</strong> to respond to inquiries, send blog updates after your consent, and maintain an internal record of subscriptions and messages.</p><p><strong>Retention:</strong> contact and article questions are kept as long as needed to handle the request and maintain service history. You may request deletion by email.</p>'

PRIVACY_BODY_RU_BEFORE = '<p>Настоящая политика описывает, как Олег Суворов обрабатывает персональные данные при использовании сайта, подписке на рассылку блога и отправке сообщений через формы.</p><p><strong>Оператор данных:</strong> Oleg Suvorov. По вопросам политики используйте <a href="/contact">страницу контактов</a>.</p><p><strong>Какие данные собираем:</strong> email, имя (необязательно), текст сообщения, URL страницы, referrer и UTM-метки при отправке формы.</p><p><strong>Зачем обрабатываем:</strong> чтобы ответить на обращения, отправлять обновления блога после вашего согласия и вести внутренний учёт подписок и сообщений.</p><p><strong>Срок хранения:</strong> обращения и вопросы хранятся столько, сколько нужно для ответа и истории сервиса. Можно запросить удаление по email.</p>'

PRIVACY_BODY_LV_BEFORE = '<p>Šī politika apraksta, kā Oleg Suvorov apstrādā personas datus, izmantojot vietni, abonējot bloga jaunumus vai sūtot ziņas caur formām.</p><p><strong>Pārzinis:</strong> Oleg Suvorov. Jautājumiem par politiku izmantojiet <a href="/contact">kontaktu lapu</a>.</p><p><strong>Kādus datus vācam:</strong> e-pastu, vārdu (neobligāti), ziņas tekstu, lapas URL, referrer un UTM tagus, iesniedzot formu.</p><p><strong>Mērķis:</strong> atbildēt uz jautājumiem, sūtīt bloga jaunumus pēc jūsu piekrišanas un uzturēt iekšējo abonementu un ziņu uzskaiti.</p><p><strong>Glabāšana:</strong> jautājumi tiek glabāti tik ilgi, cik nepieciešams atbildei un pakalpojuma vēsturei. Varat pieprasīt dzēšanu pa e-pastu.</p>'

PRIVACY_GDPR_EN = (
    "<h2>Legal basis (GDPR Art. 6)</h2>"
    "<ul>"
    "<li><strong>Consent</strong> — blog newsletter: we send updates only after "
    "you confirm your subscription (double opt-in).</li>"
    "<li><strong>Legitimate interest</strong> — responding to contact and "
    "article questions, maintaining a record of correspondence, and "
    "protecting the site against abuse.</li>"
    "<li><strong>Pre-contractual steps</strong> — when you submit a contact "
    "form to request information or discuss a project, we process your "
    "details to reply.</li>"
    "</ul>"
    "<h2>Your rights</h2>"
    "<p>Under the GDPR you have the right to:</p>"
    "<ul>"
    "<li>access your personal data;</li>"
    "<li>rectify inaccurate data;</li>"
    "<li>request erasure (“right to be forgotten”);</li>"
    "<li>restrict processing;</li>"
    "<li>data portability (where applicable);</li>"
    "<li>object to processing based on legitimate interest;</li>"
    "<li>withdraw consent at any time (without affecting prior lawful "
    "processing);</li>"
    "<li>lodge a complaint with your local data protection authority.</li>"
    "</ul>"
    "<p>To exercise these rights, contact us via the "
    '<a href="/contact">contact page</a>.</p>'
    "<h2>Cookies and consent</h2>"
    "<p>Non-essential cookies (analytics and marketing) are used only after "
    "you give consent through the cookie banner. Necessary cookies and "
    "similar storage required for the site to function are not optional.</p>"
    "<p>Details are in our "
    '<a href="/cookie-policy">Cookie Policy</a>. You can change or withdraw '
    "cookie consent at any time via the cookie settings control on the site "
    "or at the bottom of the Cookie Policy page.</p>"
)

PRIVACY_GDPR_RU = (
    "<h2>Правовые основания (GDPR, ст. 6)</h2>"
    "<ul>"
    "<li><strong>Согласие</strong> — рассылка блога: письма отправляются "
    "только после подтверждения подписки (double opt-in).</li>"
    "<li><strong>Законный интерес</strong> — ответы на обращения и вопросы "
    "к статьям, ведение истории переписки и защита сайта от злоупотреблений.</li>"
    "<li><strong>Действия до заключения договора</strong> — при отправке "
    "контактной формы для запроса информации или обсуждения проекта мы "
    "обрабатываем данные, чтобы ответить.</li>"
    "</ul>"
    "<h2>Ваши права</h2>"
    "<p>По GDPR вы имеете право:</p>"
    "<ul>"
    "<li>получить доступ к своим данным;</li>"
    "<li>исправить неточные данные;</li>"
    "<li>запросить удаление («право быть забытым»);</li>"
    "<li>ограничить обработку;</li>"
    "<li>на переносимость данных (где применимо);</li>"
    "<li>возразить против обработки на основании законного интереса;</li>"
    "<li>отозвать согласие в любой момент (без влияния на законность "
    "обработки до отзыва);</li>"
    "<li>подать жалобу в надзорный орган по защите данных.</li>"
    "</ul>"
    "<p>Для реализации прав свяжитесь с нами через "
    '<a href="/contact">страницу контактов</a>.</p>'
    "<h2>Cookies и согласие</h2>"
    "<p>Необязательные cookies (аналитика и маркетинг) используются только "
    "после согласия через баннер cookies. Необходимые cookies и похожее "
    "хранилище для работы сайта отключить нельзя.</p>"
    "<p>Подробности — в "
    '<a href="/cookie-policy">Политике cookies</a>. Изменить или отозвать '
    "согласие можно в любой момент через настройки cookies на сайте или внизу "
    "страницы Политики cookies.</p>"
)

PRIVACY_GDPR_LV = (
    "<h2>Tiesiskais pamats (VDAR 6. pants)</h2>"
    "<ul>"
    "<li><strong>Piekrišana</strong> — bloga jaunumi: vēstules tiek sūtītas "
    "tikai pēc abonementa apstiprinājuma (double opt-in).</li>"
    "<li><strong>Leģitīmās intereses</strong> — atbildes uz jautājumiem, "
    "sarakstes vēstures uzturēšana un vietnes aizsardzība pret ļaunprātīgu "
    "izmantošanu.</li>"
    "<li><strong>Darbības pirms līguma noslēgšanas</strong> — iesniedzot "
    "kontaktu formu, lai pieprasītu informāciju vai apspriestu projektu, "
    "mēs apstrādājam datus, lai atbildētu.</li>"
    "</ul>"
    "<h2>Jūsu tiesības</h2>"
    "<p>Saskaņā ar VDAR jums ir tiesības:</p>"
    "<ul>"
    "<li>pieprasīt piekļuvi saviem datiem;</li>"
    "<li>labot neprecīzus datus;</li>"
    "<li>pieprasīt dzēšanu («tiesības tikt aizmirstam»);</li>"
    "<li>ierobežot apstrādi;</li>"
    "<li>datu pārnesamība (kur piemērojams);</li>"
    "<li>iebilst pret apstrādi, kas balstīta uz leģitīmām interesēm;</li>"
    "<li>jebkurā brīdī atsaukt piekrišanu (neietekmējot iepriekšējo "
    "likumīgo apstrādi);</li>"
    "<li>iesniegt sūdzību datu aizsardzības iestādei.</li>"
    "</ul>"
    "<p>Lai izmantotu šīs tiesības, sazinieties ar mums caur "
    '<a href="/contact">kontaktu lapu</a>.</p>'
    "<h2>Sīkdatnes un piekrišana</h2>"
    "<p>Neobligātās sīkdatnes (analītika un mārketings) tiek izmantotas "
    "tikai pēc piekrišanas caur sīkdatņu baneri. Nepieciešamās sīkdatnes "
    "un līdzīga glabātuve vietnes darbībai nav atslēdzamas.</p>"
    "<p>Detalizēti — "
    '<a href="/cookie-policy">Sīkdatņu politikā</a>. Piekrišanu var '
    "mainīt vai atsaukt jebkurā brīdī, izmantojot sīkdatņu iestatījumus "
    "vietnē vai šīs lapas apakšā.</p>"
)

PRIVACY_BODY_EN = PRIVACY_BODY_EN_BEFORE + PRIVACY_GDPR_EN
PRIVACY_BODY_RU = PRIVACY_BODY_RU_BEFORE + PRIVACY_GDPR_RU
PRIVACY_BODY_LV = PRIVACY_BODY_LV_BEFORE + PRIVACY_GDPR_LV

COOKIE_POLICY_BODY_EN_BEFORE = (
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

COOKIE_POLICY_BODY_RU_BEFORE = (
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
    "<tr><td>_ga, _gid (Google Analytics)</td><td>Analytics</td>"
    "<td>Статистика использования сайта</td><td>До 24 месяцев</td>"
    "<td>Не включено — только если подключим Google Analytics и вы "
    "согласитесь</td></tr>"
    "<tr><td>Маркетинговые пиксели</td><td>Маркетинговые</td>"
    "<td>Реклама или email-tracking</td><td>—</td>"
    "<td>Не используются</td></tr>"
    "</tbody></table>"
    "<p>Google Analytics на сайте сейчас не подключён.</p>"
)

COOKIE_POLICY_BODY_LV_BEFORE = (
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

COOKIE_POLICY_EXTRA_EN = (
    "<h2>How to change your settings</h2>"
    "<p>You can manage cookie preferences in three ways:</p>"
    "<ol>"
    "<li><strong>Cookie banner</strong> — on your first visit (or after "
    "consent expires), use Accept all, Reject all, or Manage preferences.</li>"
    "<li><strong>This page</strong> — click the Cookie settings link at the "
    "bottom of this page to reopen the preferences dialog.</li>"
    "<li><strong>Site footer</strong> — use the Cookie settings link in the "
    "footer on any page.</li>"
    "</ol>"
    "<p>In the preferences dialog you can enable or disable analytics and "
    "marketing categories separately. Necessary cookies remain always active.</p>"
    "<h2>Consent storage and expiry</h2>"
    "<p>Your choices are saved in browser localStorage under the key "
    "<code>cookie_consent_v1</code> for <strong>12 months</strong> from the "
    "date of consent. After expiry, the cookie banner is shown again and "
    "non-essential cookies are not loaded until you choose again.</p>"
    "<p>Withdrawing analytics consent stops new analytics scripts from "
    "loading on subsequent page views. If analytics was previously enabled, "
    "you may need to reload the page or clear existing analytics cookies "
    "in your browser.</p>"
    "<h2>Categories</h2>"
    "<ul>"
    "<li><strong>Necessary</strong> — site delivery, security, language, "
    "and storing your consent record.</li>"
    "<li><strong>Analytics</strong> — optional usage statistics (not enabled "
    "until you opt in and we configure a provider).</li>"
    "<li><strong>Marketing</strong> — optional advertising or email "
    "tracking pixels (not in use today).</li>"
    "</ul>"
)

COOKIE_POLICY_EXTRA_RU = (
    "<h2>Как изменить настройки</h2>"
    "<p>Управлять cookies можно тремя способами:</p>"
    "<ol>"
    "<li><strong>Баннер cookies</strong> — при первом визите (или после "
    "истечения срока согласия): Принять все, Отклонить все или Настроить.</li>"
    "<li><strong>Эта страница</strong> — ссылка «Настройки cookies» внизу "
    "страницы открывает диалог предпочтений.</li>"
    "<li><strong>Footer сайта</strong> — ссылка «Настройки cookies» в "
    "подвале на любой странице.</li>"
    "</ol>"
    "<p>В диалоге можно отдельно включить или отключить аналитику и "
    "маркетинг. Необходимые cookies всегда активны.</p>"
    "<h2>Хранение согласия и срок</h2>"
    "<p>Выбор сохраняется в localStorage браузера под ключом "
    "<code>cookie_consent_v1</code> на <strong>12 месяцев</strong> с даты "
    "согласия. После истечения срока баннер показывается снова, и "
    "необязательные cookies не загружаются, пока вы не выберете заново.</p>"
    "<p>Отзыв согласия на аналитику останавливает загрузку новых "
    "аналитических скриптов при следующих просмотрах. Если аналитика "
    "ранее была включена, может потребоваться перезагрузка страницы или "
    "очистка analytics-cookies в браузере.</p>"
    "<h2>Категории</h2>"
    "<ul>"
    "<li><strong>Необходимые</strong> — доставка сайта, безопасность, "
    "язык и запись вашего согласия.</li>"
    "<li><strong>Аналитические</strong> — опциональная статистика (не "
    "включена, пока вы не согласитесь и мы не подключим провайдера).</li>"
    "<li><strong>Маркетинговые</strong> — опциональная реклама или "
    "tracking-пиксели (сейчас не используются).</li>"
    "</ul>"
)

COOKIE_POLICY_EXTRA_LV = (
    "<h2>Kā mainīt iestatījumus</h2>"
    "<p>Sīkdatņu preferences var pārvaldīt trīs veidos:</p>"
    "<ol>"
    "<li><strong>Sīkdatņu baneris</strong> — pirmajā apmeklējumā (vai pēc "
    "piekrišanas termiņa beigām): Pieņemt visas, Noraidīt visas vai "
    "Pārvaldīt preferences.</li>"
    "<li><strong>Šī lapa</strong> — saite «Sīkdatņu iestatījumi» lapas "
    "apakšā atver preferences dialogu.</li>"
    "<li><strong>Vietnes kājene</strong> — saite «Sīkdatņu iestatījumi» "
    "kājenē jebkurā lapā.</li>"
    "</ol>"
    "<p>Dialogā var atsevišķi ieslēgt vai izslēgt analītiku un mārketingu. "
    "Nepieciešamās sīkdatnes vienmēr ir aktīvas.</p>"
    "<h2>Piekrišanas glabāšana un termiņš</h2>"
    "<p>Izvēle tiek saglabāta pārlūka localStorage ar atslēgu "
    "<code>cookie_consent_v1</code> uz <strong>12 mēnešiem</strong> no "
    "piekrišanas datuma. Pēc termiņa beigām baneris parādās atkal, un "
    "neobligātās sīkdatnes netiek ielādētas, kamēr neizvēlaties vēlreiz.</p>"
    "<p>Analītikas piekrišanas atsaukšana aptur jaunu analītikas skriptu "
    "ielādi nākamajos skatījumos. Ja analītika iepriekš bija ieslēgta, "
    "var būt nepieciešama lapas pārlāde vai analītikas sīkdatņu dzēšana "
    "pārlūkā.</p>"
    "<h2>Kategorijas</h2>"
    "<ul>"
    "<li><strong>Nepieciešamās</strong> — vietnes piegāde, drošība, valoda "
    "un jūsu piekrišanas ieraksts.</li>"
    "<li><strong>Analītikas</strong> — neobligāta statistika (nav ieslēgta, "
    "kamēr nepiekrītat un mēs nekonfigurējam pakalpojumu).</li>"
    "<li><strong>Mārketinga</strong> — neobligāta reklāma vai tracking "
    "pikseļi (šobrīd netiek izmantoti).</li>"
    "</ul>"
)

COOKIE_POLICY_BODY_EN = COOKIE_POLICY_BODY_EN_BEFORE.replace(
    "<h2>Cookie inventory</h2>",
    COOKIE_POLICY_EXTRA_EN + "<h2>Cookie inventory</h2>",
    1,
)

COOKIE_POLICY_BODY_RU = COOKIE_POLICY_BODY_RU_BEFORE.replace(
    "<h2>Список cookies</h2>",
    COOKIE_POLICY_EXTRA_RU + "<h2>Список cookies</h2>",
    1,
)

COOKIE_POLICY_BODY_LV = COOKIE_POLICY_BODY_LV_BEFORE.replace(
    "<h2>Sīkdatņu saraksts</h2>",
    COOKIE_POLICY_EXTRA_LV + "<h2>Sīkdatņu saraksts</h2>",
    1,
)

UPDATES = [
    ("legal", "privacy", "body", PRIVACY_BODY_EN, PRIVACY_BODY_RU, PRIVACY_BODY_LV),
    (
        "legal",
        "cookie_policy",
        "body",
        COOKIE_POLICY_BODY_EN,
        COOKIE_POLICY_BODY_RU,
        COOKIE_POLICY_BODY_LV,
    ),
]

ROLLBACK = [
    (
        "legal",
        "privacy",
        "body",
        PRIVACY_BODY_EN_BEFORE,
        PRIVACY_BODY_RU_BEFORE,
        PRIVACY_BODY_LV_BEFORE,
    ),
    (
        "legal",
        "cookie_policy",
        "body",
        COOKIE_POLICY_BODY_EN_BEFORE,
        COOKIE_POLICY_BODY_RU_BEFORE,
        COOKIE_POLICY_BODY_LV_BEFORE,
    ),
]


def apply_updates(apps, blocks):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    for page, block, key, text_en, text_ru, text_lv in blocks:
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
    apply_updates(apps, UPDATES)


def backwards(apps, schema_editor):
    apply_updates(apps, ROLLBACK)


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0043_legal_terms_site_text_blocks"),
    ]

    operations = [
        migrations.RunPython(forwards, backwards),
    ]
