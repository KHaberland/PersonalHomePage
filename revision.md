# План добавления Professional Profile Record

Цель: добавить на страницу `/about` небольшой блок `Professional Profile Record` и строку `Profile updated: July 2026` так, чтобы текст можно было периодически обновлять через Django Admin, без поломки существующей программы и без лишнего расширения архитектуры.

## Главный принцип

- Использовать существующую модель `SiteTextBlock`.
- Не создавать новую модель, endpoint или отдельный API-контракт.
- Не менять дизайн, маршруты, навигацию и структуру страницы сверх нужного блока.
- Не добавлять новые ключи в `frontend/messages/*.json`.
- Работать только с `/about`, потому что запись относится к профессиональному профилю.
- Делать изменения маленькими шагами: один backend seed, один frontend-блок, затем проверки.

## Предлагаемая CMS-структура

Использовать:

- `page="about"`
- `block="profile_record"`

Ключи:

- `title`
- `versionLabel`
- `version`
- `lastReviewedLabel`
- `lastReviewed`
- `description`
- `footerUpdated`

Пример English seed:

- `title`: `Professional Profile Record`
- `versionLabel`: `Version:`
- `version`: `2026.1`
- `lastReviewedLabel`: `Last reviewed:`
- `lastReviewed`: `July 2026`
- `description`: `This profile is periodically updated based on professional experience, engineering projects and new qualifications.`
- `footerUpdated`: `Profile updated: July 2026`

Для `ru` и `lv` добавить аккуратные локализованные значения в той же миграции.

## Этап 1. Backend seed-данные

Создать новую Django migration в `backend/apps/pages/migrations/`.

Что сделать:

- Добавить `RunPython`, который создаёт/обновляет `SiteTextBlock` записи для `page="about"`, `block="profile_record"`.
- Заполнить `text_en`, `text_ru`, `text_lv`.
- В reverse-функции удалить только эти конкретные ключи, не трогая остальные `about` blocks.

Что не делать:

- Не менять модель `SiteTextBlock`.
- Не создавать отдельную модель `ProfessionalProfileRecord`.
- Не менять serializers/views/urls, потому что `/api/content/page/about/` уже отдаёт нужные блоки.

Проверка этапа:

```powershell
Set-Location "D:\Work_Cursor\PersonalHomePage\backend"
.\.venv\Scripts\python.exe manage.py makemigrations --check --dry-run
.\.venv\Scripts\python.exe manage.py check
```

## Этап 2. Frontend-блок на `/about`

Файл:

- `frontend/app/[locale]/about/page.tsx`

Что сделать:

- Использовать уже загруженный `content` из `getCmsPage('about', locale)`.
- Добавить helper:
  - `const profileRecordText = (key: string) => content.profile_record?.[key] || '';`
- Вставить блок в конце страницы после галереи фотографий.
- Сделать отображение условным: если нет `title` и `footerUpdated`, блок не показывать.

Рекомендуемая структура UI:

- Небольшая `section` после галереи.
- Заголовок `Professional Profile Record`.
- Две metadata-строки:
  - `Version: 2026.1`
  - `Last reviewed: July 2026`
- Короткое описание.
- Маленькая строка внизу: `Profile updated: July 2026`.

Что не делать:

- Не добавлять глобальную строку в `Footer`, чтобы не усложнять layout передачей route-specific labels.
- Не менять `Layout`, `Footer`, `Header`.
- Не добавлять client component.
- Не менять `frontend/messages/*.json`.

Проверка этапа:

```powershell
Set-Location "D:\Work_Cursor\PersonalHomePage\frontend"
npm run lint
npm run build
```

## Этап 3. Проверка данных через API

После применения миграции проверить, что CMS отдаёт новый block:

```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/content/page/about/?lang=en" -UseBasicParsing
```

Ожидаемо в ответе должен появиться block:

```text
profile_record
```

Проверить также:

```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/content/page/about/?lang=ru" -UseBasicParsing
Invoke-WebRequest -Uri "http://localhost:8000/api/content/page/about/?lang=lv" -UseBasicParsing
```

## Этап 4. Визуальная smoke-проверка

Проверить страницы:

```powershell
$urls = @(
  "http://localhost:3000/en/about",
  "http://localhost:3000/ru/about",
  "http://localhost:3000/lv/about"
)

foreach ($url in $urls) {
  $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 15
  "$($response.StatusCode) $url"
}
```

Что проверить глазами:

- Блок находится в конце `/about`.
- Текст читаемый и не выглядит как основной CTA.
- Нет поломки галереи и дипломов.
- Для `en`, `ru`, `lv` строки отображаются на соответствующем языке.

## Этап 5. Обновление документации

После реализации обновить:

- `structure.md` — добавить в раздел `/about` новый блок `Professional Profile Record`.
- При необходимости `admin-plan.md` — отметить, что блок добавлен через `SiteTextBlock(page="about", block="profile_record")`.

## Definition of Done

Изменение считается завершённым, если:

- Есть migration с seed-данными `en`, `ru`, `lv`.
- В Django Admin записи доступны как `SiteTextBlock`.
- `/api/content/page/about/?lang=en|ru|lv` отдаёт `profile_record`.
- `/about` показывает блок в конце страницы.
- `frontend/messages/*.json` не расширялись.
- Не добавлены новые API endpoints.
- `python manage.py check` проходит.
- `python manage.py makemigrations --check --dry-run` не создаёт новых миграций.
- `npm run lint` проходит без новых ошибок.
- `npm run build` проходит.

## Экономия токенов при выполнении

- Перед началом читать только:
  - `backend/apps/pages/models.py`, если нужно сверить `SiteTextBlock`;
  - последнюю migration по `SiteTextBlock`;
  - `frontend/app/[locale]/about/page.tsx`.
- Не читать весь проект и не проводить глобальный аудит.
- Не трогать unrelated files.
- Не рефакторить `/about`, а только добавить маленький блок.
- Не переносить строку в глобальный `Footer` на первом шаге.
- Не удалять fallback JSON и не менять SEO.
