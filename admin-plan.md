# План доработки Django Admin до 100% покрытия сайта

Цель: сделать так, чтобы все видимые тексты сайта, заголовки разделов, CTA, labels, SEO и повторяемые карточки редактировались через Django Admin, без поломки текущей программы.

Документ является рабочим планом. Выполнять его нужно маленькими этапами: одна страница, один крупный блок или один тип общих UI-строк за сессию.

## Главные правила

- Не удалять `frontend/messages/*.json` до тех пор, пока конкретная страница или блок не прошли полный цикл: API primary, JSON fallback, данные заведены в Admin, проверены `/en`, `/ru`, `/lv`.
- Не менять дизайн, маршруты, CSS-классы и информационную архитектуру без отдельной необходимости.
- Не ломать существующие API: `/api/about/`, `/api/book/`, `/api/contact/`, `/api/tools/`.
- Все новые редактируемые тексты добавлять в Django Admin, а не расширять `frontend/messages/*.json`.
- Для маленьких текстовых блоков использовать `SiteTextBlock`, если нет явной причины делать отдельную модель.
- Для повторяемых сущностей использовать отдельные модели только там, где нужен порядок, связи, изображения, slug или структурированные поля.
- Каждая миграция должна seed-ить English/Russian/Latvian значения из текущего JSON или текущих hardcoded значений.
- Каждый этап должен сохранять совместимость: сначала CMS primary + JSON fallback, затем отдельный этап удаления legacy JSON.

## Что уже покрыто админкой

Полностью или почти полностью:

- `Home`: hero, decision system, entry paths, proof, contact CTA через `SiteTextBlock`.
- `Solutions`: hero, validation, nav, solution sections, labels, final CTA через `SiteTextBlock`.
- `Expertise`: hero, competency cards, CTA через `SiteTextBlock`.
- `Contact`: hero, form labels, request types, contact methods, map через `SiteTextBlock`; контакты через `Contact`.
- `Book`: title/description/year через `Book`; subtitle, authority, purchase, CTA через `SiteTextBlock`.
- `About`: headings, labels, diploma UI и `Professional Profile Record` через `SiteTextBlock`; bio/education/qualifications/photo через `About`.
- `Blog` content: posts, categories, tags, authors через `blog` admin.
- `Tools` entities: calculator name/description через `Calculator`.
- SEO metadata: `SEOMetadata`.

Частично или не покрыто:

- `Experience` page headings, cases, related patterns, photo section.
- `Knowledge` page headings, section headings, bottom CTA cards.
- `Blog` list/detail UI labels.
- `Tools` page/detail UI labels and calculator field labels.
- `Header`, `Footer`, common navigation labels.
- `Home` about teaser.
- Static/hardcoded labels like platform names and brand text.

## Рекомендуемый порядок работ

### Этап 1. Admin UI для общих site labels

Создать или использовать `SiteTextBlock` для общих UI-групп:

- `page=common`, если расширить choices, или `page=home/tools/...` по текущей схеме;
- header labels;
- footer labels;
- common navigation labels;
- language labels;
- home progress labels;
- shared CTA labels.

Рекомендуемый вариант: расширить `SiteTextBlock.Page` значениями:

- `COMMON`
- `HEADER`
- `FOOTER`
- `CALCULATORS`

Если не хочется расширять enum, можно временно использовать существующие page names, но это хуже для поддержки.

Frontend:

- создать helper `getSiteText(pageOrGroup, locale)` или переиспользовать `getCmsPage`;
- подключать header/footer через server layout, если возможно;
- если компонент client-side, передавать labels props из server layout или оставить JSON до отдельной миграции.

Проверки:

```powershell
Set-Location "D:\Work_Cursor\PersonalHomePage\backend"
.\.venv\Scripts\python.exe manage.py makemigrations --check --dry-run
.\.venv\Scripts\python.exe manage.py check
```

```powershell
Set-Location "D:\Work_Cursor\PersonalHomePage\frontend"
npm run lint
npm run build
```

### Этап 2. Home about teaser

Перенести из `frontend/messages/*.json`:

- `home.aboutTeaserAriaLabel`
- `home.aboutTeaserPhotoAlt`
- `home.aboutTeaserTitle`
- `home.aboutTeaserLead1`
- `home.aboutTeaserLead2`
- `home.aboutTeaserBulletProduction`
- `home.aboutTeaserBulletTroubleshooting`
- `home.aboutTeaserBulletTeams`
- `home.aboutTeaserBulletRequirements`
- `home.aboutTeaserAboutCta`
- `home.aboutTeaserExperienceCta`

Вариант реализации:

- добавить seed в новую migration `SiteTextBlock(page="home", block="about_teaser", key=...)`;
- на `HomePage` брать эти значения через `getCmsPage('home', locale)`;
- временно оставить JSON fallback только для этих ключей;
- после проверки удалить legacy JSON отдельным этапом.

Не использовать `AboutMain` для этих строк, потому что это не bio, а UI-teaser.

### Этап 3. About page UI

Перенести в `SiteTextBlock(page="about")`:

- `about.title`
- `about.profileSummaryEyebrow`
- `about.profileSummaryTitle`
- `about.profileSummaryLead`
- `about.profileProofs`
- `about.linkedinCta`
- `about.cvCta`
- `about.education`
- `about.qualifications`
- `about.diplomas`
- diploma labels and summaries:
  - `bachelor`, `master`, `iwe`, `mma_mag`, `tig`
  - `bachelorSummary`, `masterSummary`, `iweSummary`, `mma_magSummary`, `tigSummary`
- modal labels:
  - `diplomaOpenInModal`
  - `diplomaOpenNewTab`
  - `diplomaCloseModal`
  - `diplomaPdfViewerTitle`
  - `diplomaPreviewAlt`

Отдельно:

- `About.bio`, `education`, `qualifications`, `photo` уже редактируются через `About`.
- `Professional Profile Record` уже добавлен как `SiteTextBlock(page="about", block="profile_record")` с ключами `title`, `versionLabel`, `version`, `lastReviewedLabel`, `lastReviewed`, `description`, `footerUpdated`.
- `fallbackBio`, `fallbackEducation`, `fallbackQualifications` не удалять, пока `About` API не проверен для всех языков.

Риск:

- `profileProofs` сейчас массив в JSON. В `SiteTextBlock` лучше хранить как ключи `profileProofs_1`, `profileProofs_2`, `profileProofs_3`.

### Этап 4. Experience page UI

Перенести в `SiteTextBlock(page="experience")`:

- `experience.title`
- `experience.layerEyebrow`
- `experience.lead`
- `experience.present`
- `experience.casesTitle`
- `experience.casesIntro`
- `experience.relatedPatternsEyebrow`
- `experience.relatedPatternsTitle`
- `experience.relatedPatternsText`
- `experience.relatedPatternsCta`
- `experience.photosTitle`
- labels for accordion:
  - `caseToggleShow`
  - `caseToggleHide`
  - `caseContextLabel`
  - `caseProblemLabel`
  - `caseEngineeringActionLabel`
  - `caseResultLabel`

Решить отдельно, что делать со static cases:

Вариант A, быстрый:

- перенести `case1*`, `case2*`, `case3*` в `SiteTextBlock` с ключами.

Вариант B, правильный:

- создать модель `ExperienceCase`:
  - `slug`
  - `order`
  - `title_en/ru/lv`
  - `summary_en/ru/lv`
  - `context_en/ru/lv`
  - `problem_en/ru/lv`
  - `engineering_action_en/ru/lv`
  - `result_en/ru/lv`
  - `more_href`
  - `more_label_en/ru/lv`

Рекомендация: если кейсы будут редактироваться и добавляться, выбрать вариант B.

### Этап 5. Knowledge page UI

Перенести в `SiteTextBlock(page="knowledge")`:

- `knowledge.eyebrow`
- `knowledge.title`
- `knowledge.description`
- `knowledge.schemaNote`
- `knowledge.noArticles`
- `knowledge.viewAllInCategory`
- `knowledge.readMore`
- `knowledge.systemLinksTitle`
- `knowledge.solutionCtaTitle`
- `knowledge.solutionCtaText`
- `knowledge.solutionCta`
- `knowledge.blogLinkTitle`
- `knowledge.blogLinkText`
- `knowledge.bookLinkTitle`
- `knowledge.bookLinkText`

Для section headings есть два варианта:

Вариант A:

- оставить фиксированный порядок `KNOWLEDGE_SECTIONS`, но брать title из `Category.name_*` по slug.

Вариант B:

- создать admin-модель `KnowledgeSection`:
  - `slug`
  - `category`
  - `order`
  - `title_en/ru/lv`
  - `is_active`

Рекомендация: вариант A проще и меньше ломает текущую логику. Вариант B нужен, если порядок и состав секций должен редактироваться в админке.

### Этап 6. Blog UI

Перенести в `SiteTextBlock(page="blog")`:

- `blog.title`
- `blog.description`
- `blog.knowledgeCrossLink`
- `blog.filterByCategory`
- `blog.allCategories`
- `blog.filterByTag`
- `blog.allTags`
- `blog.noArticles`
- `blog.pagination`
- `blog.previous`
- `blog.next`
- `blog.pageOf`
- `blog.backToBlog`
- `blog.relatedPosts`
- `blog.readMore`

Контент статей, заголовки статей, категории, теги и авторы уже в админке.

### Этап 7. Tools list UI

**Статус:** выполнено. `frontend/app/[locale]/tools/page.tsx` теперь берёт UI-тексты через `getCmsPage('tools', locale)` из блока `list_intro`; JSON `home.*` остаётся fallback-слоем. Seed-данные добавлены migration `0031_tools_list_ui_site_text_blocks`.

Перенести в `SiteTextBlock(page="tools")`:

- `home.toolsEyebrow`
- `home.toolsTitle`
- `home.toolsDescription`
- `home.toolsCta`

Важно:

- Сейчас эти ключи живут в namespace `home`, но используются страницей `/tools`.
- Новые ключи должны быть в `page="tools"`, block `hero` или `list_intro`.

После миграции `frontend/app/[locale]/tools/page.tsx` должен использовать `getCmsPage('tools', locale)`.

Calculator cards уже редактируются через `Calculator`.

### Этап 8. Tools detail and calculator labels

**Статус:** выполнено. `frontend/app/[locale]/tools/[slug]/page.tsx` теперь берёт detail-тексты и общие UI labels через `getCmsPage('calculators', locale)`, а client-калькуляторы получают CMS-тексты через props с fallback на `frontend/messages/*.json`. Seed-данные добавлены migration `0032_calculator_ui_site_text_blocks`.

Это самый широкий блок. Делить по одному калькулятору или по одному типу labels.

Общие calculator UI labels:

- `calculate`
- `calculating`
- `errorInvalid`
- `errorSpeedPositive`
- `errorFlowPositive`
- `errorWireDiameter`
- `errorPlateThickness`
- `errorCylinderVolume`
- `errorCalculationFailed`
- `exampleSectionTitle`
- `engineeringNoteTitle`
- `engineeringNote`
- `validationCtaTitle`
- `validationCtaText`
- `validationCta`

Per-calculator detail text:

- `calculators.pages.{slug}.lead`
- `calculators.pages.{slug}.exampleTitle`
- `calculators.pages.{slug}.exampleCaption`

Field labels and hints:

- `heatInput.*`
- `gasFlow.*`
- `shieldingGas.*`
- `gasCutting.*`
- `weldingCost.*`
- `weldingParameters.*`

Рекомендуемая модель:

`CalculatorTextBlock` или `SiteTextBlock(page="calculators")`.

Если использовать `SiteTextBlock`:

- common labels: `page="calculators", block="common", key="calculate"`;
- detail page: `page="calculators", block="{slug}_page", key="lead"`;
- fields: `page="calculators", block="{slug}_fields", key="voltage_label"`, `voltage_hint`.

Не трогать расчётную бизнес-логику.

### Этап 9. Header/Footer/Common labels

Перенести:

Header:

- `header.systemLabel`
- `header.systemFlow`
- `header.menuOpen`
- `header.menuClose`

Footer:

- `footer.tagline`
- `footer.contact`
- `footer.linkedin`
- `footer.youtube`
- `footer.rights`
- `footer.ctaHint`
- `footer.languages`
- `footer.navigationAriaLabel`
- `footer.engineeringReasoning`
- `footer.engineeringProof`
- `footer.knowledgeSystem`
- `footer.supportTitle`

Common:

- nav labels:
  - `home`
  - `about`
  - `experience`
  - `book`
  - `tools`
  - `knowledge`
  - `blog`
  - `contact`
  - `expertise`
  - `solutions`
- progress labels:
  - `homePageSections`
  - `homeSectionAbout`
  - `homeSectionWhy`
  - `homeSectionExperience`
  - `homeSectionBook`
  - `homeSectionProblemValue`
  - `homeSectionTools`
  - `homeSectionBlog`
  - `homeSectionContact`
  - `homePageProgressLabel`

Риск:

- `Header`, `Footer`, `HomeSectionProgress` являются client components. Для CMS labels лучше передавать props из server layout или создать server wrapper.

Рекомендация:

- Не переводить эти компоненты резко.
- Сначала сделать API/helper и server-side загрузку labels.
- Затем заменить один компонент: Footer.
- Потом Header.
- Потом HomeSectionProgress.

### Этап 10. Book leftovers

**Статус:** выполнено. `frontend/app/[locale]/book/page.tsx` теперь берёт `coverAlt`, `emailSubjectBook`, `previewTitle`, `previewCaption` через `getCmsPage('book', locale)` из блоков `cover`, `cta`, `preview`; JSON `book.*` остаётся fallback-слоем. Seed-данные добавлены migration `0034_book_leftover_site_text_blocks`.

Перенести в Admin:

- `book.coverAlt`
- `book.emailSubjectBook`
- `book.previewTitle`
- `book.previewCaption`

Варианты:

- `SiteTextBlock(page="book", block="preview")`;
- поля в `Book`, если эти значения логически относятся к книге.

Обложки:

- сейчас `localizedBookCovers` hardcoded в frontend.
- если нужно 100% покрытие, добавить в `Book` поля:
  - `cover_image_en`
  - `cover_image_ru`
  - `cover_image_lv`
  - или отдельную модель `BookAsset`.

Минимальный безопасный шаг: оставить текущие static covers, потому что это не текстовый заголовок.

### Этап 11. Hardcoded labels and brand text

**Статус:** выполнено. Brand name, Contact platform labels (`LinkedIn`, `YouTube`) и `LanguageSwitcher` aria-label теперь заведены в `SiteTextBlock`: `common.brand`, `common.platforms`, `common.language`, `contact.contact_methods`. Frontend использует CMS как primary source с inline/JSON fallback для прежних значений. Seed-данные добавлены migration `0035_hardcoded_label_site_text_blocks`.

Найти и перенести:

- platform names in Contact (`LinkedIn`, `YouTube`);
- brand name `Oleg Suvorov`;
- static aria labels where visible;
- any remaining hardcoded section headings.

Команда для аудита:

```powershell
Set-Location "D:\Work_Cursor\PersonalHomePage"
rg "<h[123]|heading-[123]|LinkedIn|YouTube|Oleg Suvorov|title=|aria-label" frontend
```

После переноса список hardcoded видимых строк должен быть осознанным и коротким.

### Этап 12. Удаление legacy JSON

**Статус:** выполнено частично и безопасными группами. Из `frontend/messages/en.json`, `ru.json`, `lv.json` удалены legacy UI-группы, которые уже переведены на CMS primary: `header`, `footer`, `common`, `home.aboutTeaser*`, `home.tools*`, `about` UI/diploma labels, `experience` UI/cases, `knowledge` UI, `blog` UI, `calculators` UI/fields/pages, `book` leftovers. Frontend больше не обращается к этим удалённым keys как к runtime fallback.

**Оставлены намеренно:** `seo` как fallback для metadata, `home.heroCtaContact` и `home.fallbackTool` для технического fallback списка инструментов при пустом API, а также `about.photoAlt`, `about.workPhotoAlt`, `about.fallbackBio`, `about.fallbackEducation`, `about.fallbackQualifications` до отдельной проверки/решения по этим fallback-данным.

Удалять только после полного перехода конкретной группы:

1. API primary подключён.
2. JSON fallback ещё работает.
3. Данные есть в Django Admin.
4. Проверены `/en`, `/ru`, `/lv`.
5. Только потом удалить legacy JSON keys.

Не удалять за один раз:

- весь `common`;
- весь `footer`;
- весь `calculators`;
- весь `about`;
- весь `experience`.

Удалять по группам, например:

- `about.profile_summary`;
- `experience.page_intro`;
- `tools.list_intro`;
- `calculators.common`;
- `footer.navigation`.

## Definition of Done для каждого этапа

Этап считается выполненным, если:

- есть миграция с seed-данными для `en`, `ru`, `lv`;
- нужные модели зарегистрированы в Django Admin;
- frontend использует API/CMS как primary source;
- JSON fallback работает до отдельного этапа удаления;
- нет TypeScript/lint ошибок;
- `python manage.py check` проходит;
- `python manage.py makemigrations --check --dry-run` не создаёт новых миграций;
- `npm run build` проходит;
- вручную или HTTP проверены `/en`, `/ru`, `/lv` для затронутых маршрутов.

## Стандартные проверки

Backend:

```powershell
Set-Location "D:\Work_Cursor\PersonalHomePage\backend"
.\.venv\Scripts\python.exe manage.py check
.\.venv\Scripts\python.exe manage.py makemigrations --check --dry-run
.\.venv\Scripts\python.exe manage.py migrate
```

Frontend:

```powershell
Set-Location "D:\Work_Cursor\PersonalHomePage\frontend"
npm run lint
npm run build
```

HTTP smoke-check:

```powershell
$urls = @(
  "http://localhost:3000/en",
  "http://localhost:3000/ru",
  "http://localhost:3000/lv"
)

foreach ($url in $urls) {
  $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 15
  "$($response.StatusCode) $url"
}
```

## Экономия токенов при выполнении

- За одну сессию выполнять только один этап или одну страницу.
- Перед началом этапа читать только связанные файлы.
- Не проводить глобальный рефакторинг.
- Не переписывать дизайн.
- Не менять unrelated files.
- Для повторяющихся seed-данных использовать scripts или structured migration, а не ручные большие правки в нескольких местах.
- Сначала делать минимальный вертикальный срез: backend seed → API → frontend read → checks.
- После каждого этапа кратко фиксировать:
  - что мигрировано;
  - какие JSON keys остались fallback;
  - какие проверки прошли.

## Приоритеты

Если цель — быстрее получить почти полное покрытие заголовков:

1. About UI.
2. Experience page UI.
3. Knowledge page UI.
4. Tools list/detail UI.
5. Blog UI.
6. Header/Footer/Common.
7. Calculator field labels.
8. Book leftovers.
9. Hardcoded labels cleanup.
10. Legacy JSON cleanup.

Если цель — минимальный риск:

1. About UI.
2. Book leftovers.
3. Tools list intro.
4. Knowledge page intro.
5. Blog UI.
6. Experience page UI.
7. Header/Footer.
8. Calculator labels.

## Важное замечание

100% покрытие админкой не означает, что нужно удалить весь JSON сразу. JSON остаётся техническим fallback-слоем до тех пор, пока каждая конкретная группа строк не прошла проверку на всех языках и маршрутах.
