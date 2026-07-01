# План перестройки админ-панели: Django как единая CMS

## Цель

Перевести сайт на модель:

- Django Admin = единственное место управления контентом.
- Django API = единый источник данных для frontend.
- Next.js = только отображение данных.
- JSON `frontend/messages/*.json` временно остаётся fallback-слоем и удаляется только после полной миграции.

Главное правило: сначала добавляем, потом подключаем, потом переключаем, потом удаляем JSON.

## Ограничения

- Не делать большой переписыватель CMS.
- Двигаться по страницам и секциям.
- Не ломать существующие API: `/api/about/`, `/api/book/`, `/api/contact/`, `/api/tools/`.
- Любая новая CMS-логика должна иметь fallback на текущий JSON.
- Один этап = маленький PR / маленькая сессия, чтобы экономить токены.

## Текущее состояние

- `SiteTextBlock` уже есть в `backend/apps/pages/models.py`, но сейчас структура: `page`, `block`, `key`, `text_en`, `text_ru`, `text_lv`.
- В ТЗ целевая структура: `page`, `section`, `key`, `language`, `value`.
- В `backend/apps/pages/admin.py` модель уже зарегистрирована в админке.
- В `backend/apps/pages/views.py` нет общего эндпоинта страницы `/api/content/page/{page}`.
- В `frontend/lib/api.ts` есть общий API-клиент, но нет `getPageContent`.
- Основной текст страниц остаётся в `frontend/messages/en.json`, `ru.json`, `lv.json`.

## Этап 0. Подготовка и правила миграции

**Статус:** выполнено. Правила и чеклист зафиксированы в `cms_migration.md`, постоянное правило для Cursor добавлено в `.cursor/rules/cms-migration.mdc`.

1. Зафиксировать правило: новый редактируемый текст добавляется только в Django.
2. JSON не удалять до финального этапа.
3. Для каждой страницы вести чеклист: `JSON fallback есть`, `API primary подключён`, `данные заведены в admin`, `визуально проверено en/ru/lv`.
4. Не трогать дизайн и маршруты без необходимости.
5. Не объединять миграцию нескольких страниц в одну большую задачу.

## Этап 1. Backend CMS API

**Статус:** выполнено. `SiteTextBlock` оставлен в текущей безопасной схеме, индексы и админка уже настроены, добавлен endpoint `GET /api/content/page/{page}/?lang=en`.

### 1.1. Решить схему `SiteTextBlock`

Рекомендуемый безопасный путь для текущего проекта:

- Пока не ломать существующую таблицу.
- Использовать `block` как аналог `section`.
- Добавить API-слой, который наружу отдаёт поле как `section`.
- Полный переход на `page + section + key + language + value` делать отдельной миграцией только если реально понадобится.

Причина: текущая модель уже поддерживает 3 языка в одной записи и проще для админки.

### 1.2. Улучшить индексы

Добавить индекс под выборку страницы:

- `page`
- `block`
- при необходимости `page + block + key`

Если будет выбран вариант из ТЗ с отдельным `language`, тогда индекс: `page + section + language`.

### 1.3. Добавить API страницы

Создать endpoint:

`GET /api/content/page/{page}/?lang=en`

Формат ответа:

```json
{
  "hero": {
    "title": "xxx",
    "subtitle": "xxx"
  },
  "cta": {
    "title": "xxx"
  }
}
```

Правила:

- брать только записи `SiteTextBlock.page = page`;
- группировать по `block`;
- внутри блока собирать `key: localized_text`;
- если `ru/lv` пустой, возвращать `en`;
- если страницы нет, возвращать `{}`, а не 500.

### 1.4. Админка `SiteTextBlock`

Улучшить удобство без усложнения:

- `list_display`: `page`, `block`, `key`, `updated_at`;
- `list_filter`: `page`, `block`;
- `search_fields`: `page`, `block`, `key`, тексты;
- оставить CKEditor для `TextField`;
- не добавлять универсальные page builders.

## Этап 2. Frontend content service

### 2.1. Добавить `getPageContent`

В `frontend/lib/api.ts` добавить функцию:

- `getPageContent(page, lang)`;
- использовать существующий `fetchApi`;
- тип результата: `Record<string, Record<string, string>>`.

### 2.2. Добавить fallback helper

Создать лёгкий слой:

- `getCmsPageOrFallback(page, lang, fallbackBuilder)`;
- сначала пробует API;
- если API упал или вернул пустой объект, использует `next-intl` JSON.

Не делать глобальный сложный CMS-клиент. Для начала достаточно одной функции.

## Этап 3. Миграция Home

Первая цель: `frontend/app/[locale]/page.tsx` и `frontend/components/Hero.tsx`.

Порядок секций:

1. `home.hero`: `heroTitleLine1`, `heroTitleLine2`, `heroTitleLineHighlight`, `heroTitleLine3`, CTA.
2. `home.decision_system`: заголовок, lead, 3 карточки, ссылки.
3. `home.entry_paths`: заголовок, lead, 4 карточки.
4. `home.proof`: 4 proof labels.
5. `home.contact_cta`: title, text, button.

Приёмка:

- если Django API недоступен, главная выглядит как раньше;
- если заполнен только `en`, `ru/lv` не падают;
- структура массивов пока может остаться в коде, в CMS переносить только тексты.

## Этап 4. Миграция Book

Цель: `frontend/app/[locale]/book/page.tsx`.

Перенести в `SiteTextBlock`:

- `book.subtitle`;
- `book.authorityTitle`;
- `book.authorityQuote`;
- `book.authorityAttribution`;
- `book.purchaseTitle`;
- `book.purchaseIntro`;
- CTA labels.

Существующую модель `Book` оставить для сущности книги: `title`, `description`, `year`, `cover_image`.

## Этап 5. Миграция Contact

Цель: `frontend/app/[locale]/contact/page.tsx` и `frontend/components/ContactForm.tsx`.

Перенести:

- title;
- description;
- form labels;
- request type labels;
- submit button;
- map title/description;
- empty state.

Контактные данные (`email`, `linkedin_url`, `youtube_url`) оставить в модели `Contact`.

## Этап 6. Solutions и Expertise

### Solutions

Переносить последовательно:

1. hero;
2. validation block;
3. navigation cards;
4. solution sections;
5. final CTA.

Если массивы станут слишком громоздкими для `SiteTextBlock`, добавить отдельную простую модель `SolutionItem`, но только после попытки миграции текстов через `SiteTextBlock`.

### Expertise

Переносить:

- hero eyebrow/title/intro;
- competency card titles/descriptions;
- CTA blocks.

Иконки, anchors и порядок оставить в коде.

## Этап 7. SEO из Django Admin

Добавить модель `SEOMetadata`:

- `page`;
- `language`;
- `title`;
- `description`;
- `updated_at`;
- unique: `page + language`.

Добавить API:

`GET /api/content/seo/{page}/?lang=en`

Frontend:

- обновить `createPageMetadata`;
- сначала брать SEO из API;
- fallback: namespace `seo` из JSON.

## Этап 8. Мультиязычные сущности

Blog:

- `TagTranslation`: `tag`, `language`, `name`;
- `AuthorTranslation`: `author`, `language`, `name`, `bio`;
- `PostImageTranslation`: `image`, `language`, `caption`.

Tools:

- либо добавить `name_en/name_ru/name_lv`, `description_en/ru/lv` в `Calculator`;
- либо `CalculatorTranslation`, если нужно масштабировать.

Рекомендуемый первый шаг: поля `name_en/name_ru/name_lv`, потому что сущность маленькая.

## Этап 9. Переключение primary source

Для каждой страницы выполнить один и тот же сценарий:

1. API подключён, JSON fallback работает.
2. Контент заведён в Django Admin.
3. Страница использует CMS как primary source.
4. JSON-ключи помечены как legacy.
5. После проверки всех языков JSON удаляется отдельным этапом.

## Этап 10. Удаление JSON

Удалять только после полного перехода страницы:

- удалить ключи страницы из `messages/*.json`;
- удалить fallback builder для страницы;
- проверить build;
- проверить маршруты `en`, `ru`, `lv`.

Не удалять весь JSON сразу: общие UI-строки, header/footer и системные labels могут мигрировать отдельно.

## Минимальный порядок работ

1. Backend: API `/api/content/page/{page}/`.
2. Frontend: `getPageContent`.
3. Home hero с fallback.
4. Остальная Home.
5. Book.
6. Contact.
7. Solutions.
8. Expertise.
9. SEO.
10. Blog/Tools translations.
11. Удаление legacy JSON.

## Проверки после каждого этапа

Примеры команд для PowerShell:

```powershell
Set-Location "D:\Work_Cursor\PersonalHomePage\backend"
python manage.py check
python manage.py makemigrations --check --dry-run
```

```powershell
Set-Location "D:\Work_Cursor\PersonalHomePage\frontend"
npm run lint
npm run build
```

Ручная проверка:

- `/en`
- `/ru`
- `/lv`

## Правило экономии токенов

Каждую сессию ограничивать одной задачей:

- один backend endpoint;
- или одна frontend service-функция;
- или одна страница;
- или одна секция сложной страницы.

Не просить агента "перенести весь сайт в CMS" одной задачей.
