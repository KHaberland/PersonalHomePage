# Структура программы PersonalHomePage

Документ описывает фактическую структуру проекта `PersonalHomePage` на текущем состоянии репозитория: frontend на Next.js, backend на Django REST Framework, маршруты сайта, API, ключевые компоненты, источники данных, локализацию, SEO и медиа.

## 1. Общая Архитектура

Проект состоит из двух основных частей:

- `frontend/` — публичный сайт на Next.js App Router, React 19, `next-intl`, Tailwind CSS.
- `backend/` — Django REST API и админка для контента, блога, калькуляторов и контактов.

Основной сценарий работы:

- Frontend получает контент из Django API через `frontend/lib/api.ts`.
- Если API недоступен, часть страниц использует fallback-контент из локализационных JSON или статических массивов.
- Backend хранит данные в SQLite в локальной разработке: `backend/db.sqlite3`.
- Медиа и публичные статические файлы лежат в `frontend/public/` и `backend/media/`.

Текущая смысловая модель сайта — `Engineering Decision System`.

Главная цепочка восприятия:

```text
Problem -> Analysis -> Solution Pattern -> Real-world Validation -> Knowledge -> Tools
```

Доменная модель состоит из 3 слоёв:

- `Decision Layer` — инженерная логика и паттерны решений: `/solutions`, `/expertise`.
- `Evidence Layer` — подтверждение практикой и расчётами: `/experience`, `/tools`.
- `Knowledge Layer` — объяснения, публикации и авторский артефакт: `/knowledge`, `/blog`, `/book`.

Роли ключевых разделов:

- Home — engineering entry page: кто специалист и какой путь выбрать дальше.
- `/solutions` — solution patterns: типовые производственные проблемы, инженерный подход и модель решения без реальных кейсов.
- `/expertise` — engineering capabilities: карта компетенций, за счёт которых возможны решения.
- `/experience` — real cases and timeline: практическое подтверждение, действия и Engineering Impact.
- `/tools` — deterministic calculators: расчёты и проверка параметров.
- `/knowledge` — structured explanations: статьи, объяснения процессов и разборы дефектов.
- `/blog` — chronological publications: CMS/content layer для публикаций.
- `/book` — static authority artifact: авторский материал.
- `/contact` — conversion.

## 2. Frontend

Корень frontend:

- `frontend/app/` — App Router страницы, layout, sitemap, robots.
- `frontend/app/layout.tsx` — корневой HTML layout, шрифт Inter, базовые metadata.
- `frontend/components/` — переиспользуемые UI-компоненты.
- `frontend/components/calculators/` — интерактивные калькуляторы.
- `frontend/components/icons/` — SVG-иконки компетенций, сервисов и блока `WhyChoose`.
- `frontend/i18n/` — маршрутизация и helpers `next-intl`.
- `frontend/lib/` — API-клиент, типы, SEO helpers, fallback-контент, sanitizers.
- `frontend/messages/` — переводы `en`, `ru`, `lv`.
- `frontend/proxy.ts` — `next-intl` middleware/proxy для локализованных маршрутов.
- `frontend/public/` — изображения, дипломы, видео, публичные ассеты.

Ключевые файлы `frontend/lib/`:

- `api.ts` — HTTP-клиент Django REST API и функции получения данных.
- `api-types.ts` — TypeScript-типы ответов API и калькуляторов.
- `fallback-content.ts` — fallback для инструментов и карточек блога.
- `html-to-plain-text.ts` — очистка HTML до plain text для коротких CMS-полей.
- `ia.ts` — канонический IA mapping: primary navigation, 3 слоя `Engineering Decision System` и support links.
- `metadata.ts` — helpers для `generateMetadata`.
- `sanitize-html.ts` — DOMPurify-конфигурация для HTML из CMS/переводов.
- `seo.ts` — base URL, canonical, Open Graph, Twitter Card, JSON-LD.

Команды:

```powershell
Set-Location "D:\Work_Cursor\PersonalHomePage\frontend"
npm run dev
npm run lint
npm run build
```

## 3. Локализация И Маршруты

Локализация:

- Файл маршрутизации: `frontend/i18n/routing.ts`.
- Локали: `en`, `ru`, `lv`.
- Default locale: `en`.
- Все публичные страницы живут под префиксом локали: `/en`, `/ru`, `/lv`.
- В коде ссылки задаются без языкового префикса через `Link` из `@/i18n/navigation`.
- `frontend/proxy.ts` применяет `next-intl` к маршрутам и исключает `api`, `trpc`, `_next`, `_vercel` и файлы со статическим расширением.

Layout локали:

- Файл: `frontend/app/[locale]/layout.tsx`.
- Проверяет валидность локали через `hasLocale`.
- Загружает сообщения `next-intl`.
- Загружает контактные данные через `getContact()`.
- Оборачивает страницы в `NextIntlClientProvider` и `Layout`.

Физически доступные статические маршруты frontend:

- `/`
- `/about`
- `/experience`
- `/expertise`
- `/solutions`
- `/book`
- `/tools`
- `/knowledge`
- `/blog`
- `/contact`

`/blog` и `/blog/{slug}` остаются content routes. `/blog` входит в Footer IA и sitemap как часть `Knowledge System`; `/blog/{slug}` остаётся динамическим маршрутом статей.

`/book` входит в Footer IA и sitemap как часть `Knowledge System`, но не выводится в primary Header.

Публичная UX-навигация сайта:

- `/`;
- `/solutions`;
- `/experience`;
- `/expertise`;
- `/tools`;
- `/knowledge`;
- `/blog` — secondary link в Footer/Knowledge System;
- `/book` — secondary link в Footer/Knowledge System;
- `/about` — доступен из Footer/внутренних ссылок, но не primary nav;
- `/contact`.

Динамические маршруты:

- `/tools/{slug}`
- `/blog/{slug}`

## 4. Сквозной Layout

### 4.1. `Layout`

Файл: `frontend/components/Layout.tsx`.

Состав:

- `Header`
- `<main>`
- `Footer`

`Layout` получает `contact` из API и передает в `Footer`:

- email;
- LinkedIn;
- YouTube.

### 4.2. Header

Файл: `frontend/components/Header.tsx`.

Логотип:

- `Oleg Suvorov` → `/`

Основное меню:

- `Решения` → `/solutions`
- `Опыт` → `/experience`
- `Экспертиза` → `/expertise`
- `Инструменты` → `/tools`
- `База знаний` → `/knowledge`
- `Контакты` → `/contact`

Особенности:

- Список primary navigation берётся из `frontend/lib/ia.ts`.
- Header sticky.
- Desktop меню — горизонтальное.
- Mobile меню открывается кнопкой и повторяет основной список.
- Переключатель языка расположен в desktop и mobile вариантах.

### 4.3. Footer

Файл: `frontend/components/Footer.tsx`.

Содержит:

- бренд `Oleg Suvorov`;
- tagline из `footer.tagline`;
- email, LinkedIn, YouTube, если они есть в API;
- переключатель языка;
- soft CTA `Контакт` → `/contact` (`btn-secondary`);
- сгруппированную IA-карту `Engineering Decision System`;
- support links.

IA-группы Footer берутся из `frontend/lib/ia.ts`:

- `Engineering Reasoning`: `/solutions`, `/expertise`;
- `Engineering Proof`: `/experience`, `/tools`;
- `Knowledge System`: `/knowledge`, `/blog`, `/book`.

Support links Footer:

- `/`;
- `/about`;
- `/contact`.

## 5. Главная Страница `/`

Файл: `frontend/app/[locale]/page.tsx`.

Главная — короткая `engineering entry page`, а не preview всех разделов сайта.

Порядок блоков:

1. `Hero`
2. `EngineerIdentityStrip`
3. `#decision-system`
4. `#user-paths`
5. `#proof`
6. `#contact`

### 5.1. Hero

Файл: `frontend/components/Hero.tsx`.

Содержит:

- видео или градиентный фон;
- заголовок `International Welding Engineer (IWE)`;
- подзаголовок `Industrial welding process optimization & defect reduction`;
- акцент `10+ лет практики | MIG/MAG, TIG, MMA | Автор книги по сварке`;
- CTA:
  - primary `Смотреть решения` → `/solutions`;
  - secondary `Проверить расчёты` → `/tools`.

Медиа и настройки:

- default видео: `/Video/welding-bg.MP4`.
- `NEXT_PUBLIC_HERO_VIDEO_URL` — основной MP4 URL, если нужно переопределить default.
- `NEXT_PUBLIC_HERO_VIDEO_WEBM` — дополнительный WebM source.
- `NEXT_PUBLIC_HERO_VIDEO_POSTER` — poster для видео.
- `NEXT_PUBLIC_HERO_OVERLAY_OPACITY` — затемнение видео на desktop, значение `0..1`, default `0.55`.
- Если видео не загрузилось, остаётся CSS-градиент.

### 5.2. Блок `#decision-system`

Коротко объясняет 3 слоя `Engineering Decision System`:

- `Reasoning` → `/solutions`, `/expertise`;
- `Proof` → `/experience`, `/tools`;
- `Knowledge` → `/knowledge`, `/blog`, `/book`.

### 5.3. Блок `#user-paths`

Главный UX-хаб из четырёх путей:

- `Solve my problem` → `/solutions`;
- `See experience` → `/experience`;
- `Understand the process` → `/knowledge`;
- `Check engineering` → `/tools`.

Назначение блока — направить пользователя к одному из четырёх ответов: что решается, чем подтверждается опыт, где понять процесс, где расчётная проверка.

### 5.4. Блок `#proof`

Короткая proof strip:

- `10+ years`;
- `IWE`;
- `Book author`;
- `Industry experience`.

### 5.5. Блок `#contact`

Короткий CTA на `/contact` для реальной производственной задачи после выбора соответствующего слоя системы.

На главной больше нет preview-блоков `solutions`, `experience`, `expertise`, `tools`, `knowledge` и нет локальной навигации `HomeSectionProgress`.

## 6. Страница `/solutions`

Файл: `frontend/app/[locale]/solutions/page.tsx`.

Namespace переводов:

- `solutionsPage`.

Назначение: outcome-страница. Это единственное место сайта, где подробно раскрываются производственные задачи: проблема, возможная причина, инженерный анализ, решение и ожидаемый результат.

Блоки:

- Hero с H1 `Решения`.
- Навигационные карточки-якоря.
- Подробные секции решений.
- Один финальный hard CTA `Контакт` → `/contact`.

Навигационные карточки:

- `Снижение дефектов` → `#solutions-defect-reduction`;
- `Стабильность процесса` → `#solutions-process-optimization`;
- `Подбор защитных газов` → `#solutions-gas-selection`;
- `Обучение персонала` → `#solutions-training`;
- `Поддержка проектов / WPS` → `#solutions-wps-support`.

Якорные секции:

- `Снижение дефектов сварки` → `#solutions-defect-reduction`;
- `Стабильность сварочного процесса` → `#solutions-process-optimization`;
- `Подбор защитных газов` → `#solutions-gas-selection`;
- `Обучение персонала` → `#solutions-training`;
- `Поддержка проектов / внедрение WPS` → `#solutions-wps-support`.

Каждая секция содержит 5 карточек этапов:

- `Проблема`;
- `Причина`;
- `Инженерный анализ`;
- `Решение`;
- `Ожидаемый результат`.

## 7. Страница `/expertise`

Файл: `frontend/app/[locale]/expertise/page.tsx`.

Назначение: static capability layer. Это карта инженерных компетенций без кейсов, историй и продаж.

Блоки:

- H1 `Экспертиза`.
- Вводный текст `home.expertisePageIntro`.
- Сетка компетенций с capability-only описаниями.
- Групповые labels: `Processes`, `Materials`, `Gases`, `Metallurgy`, `Safety`.
- CTA в `/solutions` как применение компетенций.
- CTA в `/experience` как практическое подтверждение.

Компетенции и якоря:

- `MIG/MAG сварка` → `#expertise-mig-mag`;
- `TIG сварка алюминия / нержавеющей стали` → `#expertise-tig`;
- `Защитные газы для MIG/MAG/TIG` → `#expertise-gases`;
- `Металлургия сварки` → `#expertise-metallurgy`;
- `Газы для резки` → `#expertise-quality`;
- `Техника безопасности с газами` → `#expertise-safety`.

## 8. Страница `/about`

Файл: `frontend/app/[locale]/about/page.tsx`.

Данные:

- API `GET /api/about/?lang={locale}`;
- fallback из `messages/{locale}.json` namespace `about`.

Блоки:

- H1 `Обо мне`.
- Engineering profile summary.
- LinkedIn CTA.
- CV CTA, если задан `NEXT_PUBLIC_CV_URL`.
- Основное фото.
- Биография.
- `Образование`, если есть видимый текст.
- `Профессиональные квалификации`, если есть видимый текст.
- `Дипломы и сертификаты`.
- Галерея фотографий с работы.

Безопасность HTML:

- HTML биографии, образования и квалификаций проходит через `sanitizeAboutHtml`.

Документы:

- `Бакалавр` → `/images/photos/small/IMG_bakalv_165628.jpg`;
- `Магистр (РТУ)` → `/images/photos/small/magist1.jpg`;
- `Сертификат международного инженера по сварке (IWE)` → `/diplomas/IWE_diploms.pdf`;
- `Сварка MMA/MAG` → `/images/photos/small/MMA_dipl.jpg`;
- `Сварка TIG` → `/images/photos/small/BUTS1_dipl.jpg`.

Текущее замечание по ассетам:

- Файл `/diplomas/IWE_diploms.pdf` ожидается кодом страницы `/about`; если его нет в `frontend/public/diplomas/`, ссылка на документ откроет 404.
- Для документов-изображений preview совпадает с документом.
- Для PDF без `preview` показывается placeholder.

Компонент документов:

- `frontend/components/DiplomaCertificates.tsx`.

## 9. Страница `/experience`

Файл: `frontend/app/[locale]/experience/page.tsx`.

Данные:

- API `GET /api/experience/?lang={locale}`;
- fallback из namespace `experience`.

Блоки:

- H1 `Профессиональный опыт`.
- Таймлайн опыта.
- `#cases` с аккордеоном в структуре `Контекст` / `Проблема` / `Что было сделано` / `Результат`.
- `#engineering-impact` — единый блок `Engineering Impact`.
- Галерея фотографий.

Блок `Engineering Impact`:

- реализован локальными компонентами `EngineeringImpactSection` и `ImpactCard` в `frontend/app/[locale]/experience/page.tsx`;
- заменяет прежние отдельные секции `Проекты и направления` и `Результаты`;
- на desktop выводится сеткой из 2 колонок, на mobile карточки идут друг под другом;
- содержит 2 карточки:
  - `Engineering Approach` — короткие инженерные тезисы о подходе к процессу;
  - `Engineering Impact` — короткие тезисы о наблюдаемом производственном эффекте;
- контент хранится в `messages/{locale}.json` namespace `experience`:
  - `engineeringImpactTitle`;
  - `engineeringApproachTitle`;
  - `engineeringImpactCardTitle`;
  - `engineeringApproachItems`;
  - `engineeringImpactItems`.

Fallback-записи таймлайна:

- `Elme Messer Gaas` / `Инженер по сварке` / `2015 — настоящее время`;
- `Учебный центр BUTS` / `Преподаватель сварки` / `2013 — 2015`;
- `Производственный опыт` / `Сварщик` / `До 2013`.

Компонент кейсов:

- `frontend/components/ExperienceCaseAccordion.tsx`.

Кейсы:

- `Защитный газ и режимы MAG для металлоцеха`;
- `TIG по алюминию — тепловложение и контроль валика`;
- `Обучение и документация «под аудит»`.

Ссылки из кейсов:

- `/knowledge`;
- `/tools/heat-input`;
- `/contact`.

## 10. Техническая Страница `/book`

Файл: `frontend/app/[locale]/book/page.tsx`.

Статус: страница физически доступна, использует API книги и входит в `Knowledge System` как static authority artifact. Страница присутствует в Footer IA и sitemap, но не в primary Header.

Данные:

- API `GET /api/book/?lang={locale}`;
- fallback из namespace `book`.
- контакты через `GET /api/contact/`.

Блоки:

- H1 с названием книги.
- Локализованная обложка.
- Подзаголовок.
- Год.
- HTML-описание.
- Превью разворота книги.
- Цитата/социальное подтверждение.
- Блок покупки.

Локализованные обложки:

- `en` → `/images/book/welding_en.jpg`;
- `ru` → `/images/book/MIG_MAG_welding_ru.jpg`;
- `lv` → `/images/book/MIG_MAG_metinasana.jpg`.

Компоненты:

- `frontend/components/BookSpreadPreview.tsx`.

Ссылки:

- `Связаться для приобретения` → `/contact`;
- `Написать на email` → `mailto:{email}?subject=...`, если email есть в API;
- `Купить в магазине` → `NEXT_PUBLIC_BOOK_PURCHASE_URL`, если задан;
- `Скачать фрагмент` → `NEXT_PUBLIC_BOOK_DOWNLOAD_URL`, если задан.

## 11. Страница `/tools`

Файл: `frontend/app/[locale]/tools/page.tsx`.

Назначение: truth layer. Раздел не является маркетинговой страницей, методологией или обучающим хабом; он показывает только расчёты и проверку параметров.

Данные:

- API `GET /api/tools/`;
- fallback через `buildFallbackTools()`.

Блоки:

- Eyebrow `Truth layer` / `Слой расчётов`.
- H1 `Инструменты`.
- Описание в стиле `calculator / parameter checks`.
- Сетка карточек инструментов.

Карточка инструмента:

- Компонент `frontend/components/ToolCardLink.tsx`.

Ссылки:

- `/tools/shielding-gas`;
- `/tools/heat-input`;
- `/tools/gas-flow`;
- `/tools/gas-cutting`;
- `/tools/welding-cost`;
- `/tools/welding-parameters`.

## 12. Страница Калькулятора `/tools/{slug}`

Файл: `frontend/app/[locale]/tools/[slug]/page.tsx`.

Реестр slug:

- `frontend/components/calculators/index.tsx`.

Динамическая загрузка:

- `frontend/components/calculators/loadCalculator.ts`.

Доступные slug:

- `heat-input`;
- `gas-flow`;
- `shielding-gas`;
- `gas-cutting`;
- `welding-cost`;
- `welding-parameters`.

Структура страницы:

- H1 с названием калькулятора.
- Lead из `calculators.pages.{slug}.lead`.
- Блок `Пример результата (иллюстрация)`.
- Блок `Инженерное применение` с пояснением, что расчёт является отправной точкой и проверяется по материалу, WPS, оборудованию и пробным швам.
- Интерактивный калькулятор.

Компоненты калькуляторов:

- `HeatInputCalculator.tsx`;
- `GasFlowCalculator.tsx`;
- `ShieldingGasCalculator.tsx`;
- `GasCuttingCalculator.tsx`;
- `WeldingCostCalculator.tsx`;
- `WeldingParametersCalculator.tsx`.

Общие компоненты:

- `CalculatorField.tsx`;
- `CalculatorStaticExample.tsx`.

Если slug не входит в `CALCULATOR_SLUGS`, открывается 404.

## 13. Страница `/knowledge`

Файл: `frontend/app/[locale]/knowledge/page.tsx`.

Назначение: reference layer / structured explanations. Раздел содержит тематические объяснения процессов и разборы дефектов; он не является источником static expertise, вторым blog или sales page книги.

Данные:

- `GET /api/categories/`;
- `GET /api/posts/?category_slug={slug}&lang={locale}&page=1`.

Блоки:

- Локализованный eyebrow knowledge/reference layer.
- H1 `База знаний по сварке`.
- Описание content hub.
- Тематические разделы статей.

Разделы:

- `Сварка MIG/MAG` → category slug `welding-technology`;
- `Сварка TIG` → category slug `welding-equipment`;
- `Защитные газы` → category slug `shielding-gases`;
- `Газовая резка` → category slug `gas-cutting`;
- `Сварочная металлургия` → category slug `welding-metallurgy`;
- `Дефекты сварки` → category slug `welding-defects`.

Ссылки:

- статья → `/blog/{slug}`;

`/knowledge` является reference layer: тематические группы, process logic и technical background. Карточки ведут на `/blog/{slug}`, но microcopy отделяет structured explanations от хронологического `/blog`. `/blog` и `/book` доступны как secondary routes в `Knowledge System`.

## 14. Страница `/blog`

Файл: `frontend/app/[locale]/blog/page.tsx`.

Данные:

- `GET /api/posts/?lang={locale}&page={page}`;
- `GET /api/categories/`;
- `GET /api/tags/`.

Фильтры query string:

- `category_slug`;
- `tag_slug`;
- `page`.

Блоки:

- H1 `Блог`.
- Описание.
- Ссылка на `/knowledge`.
- Фильтр категорий.
- Фильтр тегов, если теги есть.
- Сетка статей.
- Пагинация.

Ссылки:

- категория → `/blog?category_slug={slug}`;
- тег → `/blog?tag_slug={slug}`;
- статья → `/blog/{slug}`;
- пагинация → `/blog?...&page={n}`.

## 15. Страница Статьи `/blog/{slug}`

Файл: `frontend/app/[locale]/blog/[slug]/page.tsx`.

Данные:

- `GET /api/posts/{slug}/?lang={locale}`.

Блоки:

- ссылка возврата к блогу;
- категория;
- H1 статьи;
- автор и дата публикации;
- обложка;
- HTML-контент;
- дополнительные изображения;
- теги;
- похожие статьи;
- JSON-LD `Article`.

Если статья не найдена, открывается 404.

## 16. Страница `/contact`

Файл: `frontend/app/[locale]/contact/page.tsx`.

Данные:

- `GET /api/contact/`.

Блоки:

- H1 `Запросить консультацию`.
- Описание.
- `ContactForm`, если email есть.
- Контактные карточки.
- Карта.

Форма:

- Компонент `frontend/components/ContactForm.tsx`.
- Формирует `mailto:{email}` с subject/body.
- Содержит максимум 3 типа запроса:
  - `Дефекты / качество шва`;
  - `Процесс / поддержка WPS`;
  - `Обучение / навыки`.

Контактные ссылки:

- email → `mailto:{email}`;
- LinkedIn → внешний URL;
- YouTube → внешний URL.

Карта:

- `NEXT_PUBLIC_MAP_EMBED_URL`, если задан;
- fallback OpenStreetMap с точкой в районе Риги.

## 17. Frontend API-Клиент

Файл: `frontend/lib/api.ts`.

Base URL:

- `NEXT_PUBLIC_API_URL`;
- fallback: `http://localhost:8000/api`.

Основные методы:

- `getPosts(lang, params)` → `/posts/`;
- `getPost(slug, lang)` → `/posts/{slug}/`;
- `getCategories()` → `/categories/`;
- `getTags()` → `/tags/`;
- `getAbout(lang)` → `/about/`;
- `getExperience(lang)` → `/experience/`;
- `getBook(lang)` → `/book/`;
- `getContact()` → `/contact/`;
- `getTools()` → `/tools/`.

Legacy/резервные методы, которые API сохраняет, но новая главная v3.0 не использует:

- `getHomeTechnicalSkills(lang)` → `/home-technical-skills/`;
- `getHomeBusinessOutcomes(lang)` → `/home-business-outcomes/`.

POST-методы калькуляторов:

- `calculateHeatInput()` → `/calculate/heat-input/`;
- `calculateGasFlow()` → `/calculate/gas-flow/`;
- `calculateShieldingGas()` → `/calculate/shielding-gas/`;
- `calculateGasCutting()` → `/calculate/gas-cutting/`;
- `calculateWeldingCost()` → `/calculate/welding-cost/`;
- `calculateWeldingParameters()` → `/calculate/welding-parameters/`.

Типы API:

- `frontend/lib/api-types.ts`.

## 18. Backend

Корень backend:

- `backend/manage.py`;
- `backend/config/settings.py`;
- `backend/config/urls.py`;
- `backend/apps/pages/`;
- `backend/apps/blog/`;
- `backend/apps/calculators/`;
- `backend/apps/users/`;
- `backend/media/`;
- `backend/staticfiles/`.

Команды:

```powershell
Set-Location "D:\Work_Cursor\PersonalHomePage\backend"
.\.venv\Scripts\python.exe manage.py runserver
```

Главный URLConf:

- `backend/config/urls.py`.

Подключенные routes:

- `/admin/`;
- `/ckeditor5/`;
- `/api/` → users;
- `/api/` → blog;
- `/api/` → pages;
- `/api/` → calculators;
- `/api/` → media.

## 19. Backend App `pages`

Файлы:

- `backend/apps/pages/models.py`;
- `backend/apps/pages/views.py`;
- `backend/apps/pages/serializers.py`;
- `backend/apps/pages/urls.py`;
- `backend/apps/pages/admin.py`.

Endpoints:

- `GET /api/about/`;
- `GET /api/experience/`;
- `GET /api/book/`;
- `GET /api/contact/`;
- `GET /api/home-technical-skills/`;
- `GET /api/home-business-outcomes/`.

Модели:

- `AboutMain` — legacy/резервный краткий блок `Обо мне`.
- `About` — полная страница `/about`.
- `Experience` — записи таймлайна.
- `Book` — контент страницы книги.
- `HomeTechnicalSkillsIntro` — legacy/резервный lead технических навыков.
- `HomeTechnicalSkillCard` — legacy/резервные карточки технических навыков.
- `HomeBusinessOutcomesIntro` — legacy/резервный intro business outcomes.
- `HomeBusinessOutcomeCard` — legacy/резервные карточки business outcomes.
- `Contact` — email, LinkedIn, YouTube.

## 20. Backend App `blog`

Файлы:

- `backend/apps/blog/models.py`;
- `backend/apps/blog/views.py`;
- `backend/apps/blog/serializers.py`;
- `backend/apps/blog/filters.py`;
- `backend/apps/blog/urls.py`;
- `backend/apps/blog/admin.py`.

Endpoints:

- `GET /api/posts/`;
- `GET /api/posts/{slug}/`;
- `GET /api/categories/`;
- `GET /api/tags/`.

Модели:

- `Author`;
- `Category`;
- `Tag`;
- `Post`;
- `PostImage`.

Особенности:

- Посты мультиязычные: `title_en/ru/lv`, `content_en/ru/lv`, `excerpt_en/ru/lv`.
- Статусы постов: `draft`, `published`.
- Список постов поддерживает фильтрацию по category/tag.

## 21. Backend App `calculators`

Файлы:

- `backend/apps/calculators/models.py`;
- `backend/apps/calculators/views.py`;
- `backend/apps/calculators/serializers.py`;
- `backend/apps/calculators/services.py`;
- `backend/apps/calculators/urls.py`;
- `backend/apps/calculators/admin.py`.

Endpoints:

- `GET /api/tools/`;
- `POST /api/calculate/heat-input/`;
- `POST /api/calculate/gas-flow/`;
- `POST /api/calculate/shielding-gas/`;
- `POST /api/calculate/gas-cutting/`;
- `POST /api/calculate/welding-cost/`;
- `POST /api/calculate/welding-parameters/`.

Модель:

- `Calculator` — имя, описание, slug.

Расчётные функции:

- `calculate_heat_input`;
- `calculate_gas_flow`;
- `calculate_shielding_gas`;
- `calculate_gas_cutting`;
- `calculate_welding_cost`;
- `calculate_welding_parameters`.

## 22. Backend App `users`

Файлы:

- `backend/apps/users/models.py`;
- `backend/apps/users/views.py`;
- `backend/apps/users/serializers.py`;
- `backend/apps/users/backends.py`;
- `backend/apps/users/admin_forms.py`;
- `backend/apps/users/urls.py`;
- `backend/apps/users/management/commands/create_superuser.py`.

Endpoints:

- `POST /api/login`;
- `POST /api/refresh`.

Особенности:

- Используется JWT через `djangorestframework-simplejwt`.
- В админке подключена форма входа `EmailOrUsernameAdminAuthenticationForm`.

## 23. Backend App `media`

Файлы:

- `backend/apps/media/apps.py`;
- `backend/apps/media/urls.py`;
- `backend/apps/media/views.py`;
- `backend/apps/media/utils.py`.

Endpoint:

- `POST /api/upload`.

Назначение:

- загрузка изображений для админки/API;
- требует JWT-аутентификации;
- принимает multipart поле `file`;
- поддерживает `image/jpeg`, `image/png`, `image/gif`, `image/webp`;
- максимальный размер файла: 10 MB;
- сохраняет файл в `folder` из request data или в `uploads`;
- возвращает `url`, `path`, `thumbnails`.

## 24. Локализация Текстов

Файлы переводов:

- `frontend/messages/en.json`;
- `frontend/messages/ru.json`;
- `frontend/messages/lv.json`.

Основные namespaces:

- `seo`;
- `footer`;
- `common`;
- `home`;
- `solutionsPage`;
- `about`;
- `experience`;
- `calculators`;
- `knowledge`;
- `blog`;
- `contact`;
- `book`.

Правило:

- При добавлении ключа он должен быть синхронизирован во всех трех локалях.
- Страницы с `next-intl` падают при отсутствии обязательного ключа.

## 25. SEO, Robots И Sitemap

SEO helper:

- `frontend/lib/metadata.ts`;
- `frontend/lib/seo.ts`.

Root metadata:

- `frontend/app/layout.tsx`;
- использует `getBaseUrl()` и `SITE_NAME` из `frontend/lib/seo`;
- подключает шрифт Inter с latin/cyrillic subsets.

Robots:

- `frontend/app/robots.ts`;
- `allow: /`;
- `disallow: /api/`, `/_next/`;
- sitemap URL: `{getBaseUrl()}/sitemap.xml`.

Sitemap:

- `frontend/app/sitemap.ts`.

Текущий `STATIC_PATHS`:

- `/`;
- `/about`;
- `/experience`;
- `/expertise`;
- `/solutions`;
- `/tools`;
- `/knowledge`;
- `/blog`;
- `/book`;
- `/contact`.

Также sitemap добавляет:

- все страницы калькуляторов `/tools/{slug}` для каждой локали.

Важное текущее замечание:

- `/blog` и `/book` входят в sitemap как routes `Knowledge System`.
- `/blog/{slug}` остаётся динамическим маршрутом статей и не добавляется в sitemap без отдельного решения по CMS/индексации.

Приоритеты:

- главная: `1`;
- статические страницы: `0.8`;
- калькуляторы: `0.7`.

## 26. Медиа И Публичные Файлы

Frontend public:

- `frontend/public/images/` — изображения страниц, фотографий и книги.
- `frontend/public/images/photos/` — основные фотографии.
- `frontend/public/images/photos/small/` — оптимизированные/малые изображения и документы-изображения.
- `frontend/public/images/book/` — локализованные обложки книги.
- `frontend/public/Video/welding-bg.MP4` — default MP4 для Hero.
- `frontend/public/diplomas/` — ожидаемое место для PDF-документов дипломов, включая `/diplomas/IWE_diploms.pdf`.

Книга:

- `/images/book/welding_en.jpg`;
- `/images/book/MIG_MAG_welding_ru.jpg`;
- `/images/book/MIG_MAG_metinasana.jpg`.

Backend media:

- `backend/media/` — загружаемые изображения из Django admin/API.

Преобразование относительных URL API:

- Функция `getImageSrc()` на frontend дополняет относительный путь базовым URL из `NEXT_PUBLIC_API_URL`.

## 27. Важные Переменные Окружения

Frontend:

- `NEXT_PUBLIC_API_URL` — базовый URL API, fallback `http://localhost:8000/api`.
- `NEXT_PUBLIC_SITE_URL` — публичный URL сайта для canonical, OG, robots и sitemap.
- `NEXT_PUBLIC_MAP_EMBED_URL` — карта на странице контактов.
- `NEXT_PUBLIC_BOOK_PURCHASE_URL` — внешняя ссылка покупки книги.
- `NEXT_PUBLIC_BOOK_DOWNLOAD_URL` — ссылка на скачивание фрагмента книги.
- `NEXT_PUBLIC_CV_URL` — ссылка на CV на странице `/about`.
- `NEXT_PUBLIC_HERO_VIDEO_URL` — MP4 Hero-видео, fallback `/Video/welding-bg.MP4`.
- `NEXT_PUBLIC_HERO_VIDEO_WEBM` — WebM Hero-видео.
- `NEXT_PUBLIC_HERO_VIDEO_POSTER` — poster Hero-видео.
- `NEXT_PUBLIC_HERO_OVERLAY_OPACITY` — затемнение Hero-видео `0..1`.

SEO:

- base URL берется через `frontend/lib/seo`.

## 28. Проверка Работы

Frontend:

```powershell
Set-Location "D:\Work_Cursor\PersonalHomePage\frontend"
npm run lint
npm run build
```

Backend:

```powershell
Set-Location "D:\Work_Cursor\PersonalHomePage\backend"
.\.venv\Scripts\python.exe manage.py check
```

Dev-серверы:

```powershell
Set-Location "D:\Work_Cursor\PersonalHomePage\backend"
.\.venv\Scripts\python.exe manage.py runserver
```

```powershell
Set-Location "D:\Work_Cursor\PersonalHomePage\frontend"
npm run dev
```

Ожидаемые локальные адреса:

- Backend: `http://localhost:8000`;
- Frontend: `http://localhost:3000`.
