# План: двусторонняя навигация Admin ↔ Site

**Дата:** 2026-07-28
**Статус:** Фазы 0–5d и 6 (частично) выполнены · staff-badges и proxy-модели — опционально
**Связанные документы:** `text_structure.md`, `admin-plan.md` (миграция контента в CMS)

## Цель

Ускорить поиск нужного блока для редактирования текста за счёт двух режимов навигации:

| Режим | Направление | Что делает |
|-------|-------------|------------|
| **Admin → Site** | Админка → сайт | Ссылка «На сайте» открывает страницу с якорем на нужную секцию |
| **Site → Admin** | Сайт → админка | В dev-режиме badge на CMS-тексте ведёт в форму редактирования в Django Admin |

**Не входит в scope:** inline-редактирование текста прямо на странице (WYSIWYG на фронте). Единственное место правки — Django Admin, как сейчас.

---

## Принципы (не ломать программу)

1. **Только additive-изменения** — новые файлы, новые optional env-переменные, новые колонки/кнопки в admin. Не менять контракты API (`/api/content/page/{page}/`, `/api/about/` и т.д.).
2. **Feature flags** — Site → Admin выключен по умолчанию; без `NEXT_PUBLIC_CMS_EDIT=1` фронт ведёт себя идентично текущему.
3. **Без изменения дизайна** — badges только при hover, малый шрифт, не влияют на вёрстку для обычных пользователей.
4. **Без рефакторинга страниц «ради красоты»** — оборачивать тексты в `CmsText` точечно, по одной странице за сессию.
5. **Fallback сохраняется** — `frontend/messages/*.json` и текущая логика `getCmsPage` + merge не трогаются.
6. **Якоря — минимальный diff** — добавлять только недостающие `id` (например `#problem-value`), не переименовывать существующие.

---

## Экономия токенов при реализации

План рассчитан на работу **короткими сессиями в Agent mode** — по одной фазе или подзадаче за раз.

### Правила для агента / разработчика

| Правило | Зачем |
|---------|--------|
| Одна сессия = одна фаза или подфаза | Меньше контекста, меньше diff |
| Не читать весь репозиторий | Читать только файлы из таблицы «Файлы фазы» |
| Не дублировать `text_structure.md` | Реестр превью — отдельный компактный JSON/Python, выписанный один раз из документа |
| Не оборачивать все страницы сразу | MVP: только `page.tsx` (главная); остальное — по мере необходимости |
| Не делать dev API для admin URL в MVP | Changelist с `?page__exact=&block__exact=&q=` достаточно |
| Не трогать `admin-plan.md` | Это другой трек (покрытие CMS); текущий план — только навигация |
| После каждой фазы — smoke-check | `npm run dev` + `/admin/` + одна страница `/ru/` |

### Промпт-шаблон для сессии

```
Реализуй Фазу N из admin_plan.md.
Ограничения: только файлы из списка фазы; не менять API; не рефакторить соседний код.
Проверка: перечислить URL для ручного теста.
```

---

## Архитектура

```
┌─────────────────────┐         ┌─────────────────────┐
│  Django Admin       │         │  Next.js (frontend)  │
│  SiteTextBlockAdmin │         │  CmsText (opt-in)    │
│  + preview_link     │──URL──► │  /ru/#anchor         │
│  + кнопка на форме  │         │                      │
└─────────────────────┘         │  badge ──URL──► Admin │
         ▲                      └─────────────────────┘
         │                                │
         └──────── changelist /change/ ───┘

Общий реестр: backend/apps/pages/cms_preview_registry.py
(или backend/apps/pages/data/cms_preview.json — один источник для admin и docs)
```

### Реестр превью `(page, block) → (path, anchor?)`

Примеры (полный список заполняется из `text_structure.md`):

| page | block | path | anchor |
|------|-------|------|--------|
| home | hero | `/` | — |
| home | about_teaser | `/` | `problem-value` |
| home | decision_system | `/` | `decision-system` |
| home | entry_paths | `/` | `user-paths` |
| home | proof | `/` | `proof` |
| home | contact_cta | `/` | `contact` |
| solutions | section_* | `/solutions` | slug секции |
| contact | * | `/contact` | — |
| book | * | `/book` | — |

**Locale для превью:** по умолчанию `ru` (редакторский язык); позже — настройка `CMS_PREVIEW_LOCALE` в backend `.env`.

**Base URL сайта:** `FRONTEND_BASE_URL` (backend) / `NEXT_PUBLIC_SITE_URL` (frontend), fallback `http://localhost:3000`.

---

## Окружения

| Окружение | Admin → Site | Site → Admin |
|-----------|--------------|--------------|
| Локально | ✅ всегда (кнопка в admin) | ✅ при `NEXT_PUBLIC_CMS_EDIT=1` + hostname localhost |
| Staging | ✅ | ✅ рекомендуется |
| Production | ✅ (только внутри admin, безопасно) | ⚠️ выключено по умолчанию; опционально Фаза 5 (staff-only) |

---

## Фазы реализации

### Фаза 0. Подготовка (≈30 мин, без кода или минимум) ✅

**Задачи:**

- [x] Сверить якоря в `text_structure.md` с `id` в JSX; зафиксировать расхождения → см. [Приложение A](#приложение-a-аудит-якорей-фаза-0).
- [x] Выписать таблицу `(page, block) → (path, anchor)` для главной, solutions, contact → см. [Приложение B](#приложение-b-реестр-превью-mvp-фаза-0).
- [x] Договориться о именах env → см. [Приложение C](#приложение-c-переменные-окружения-фаза-0).

**Файлы:** `admin_plan.md`, краткая ссылка в `text_structure.md`.

**Критерий готовности:** таблица реестра MVP согласована — **выполнено**.

**Следующий шаг:** Фаза 1 — `cms_preview_registry.py` + колонка «На сайте» в admin (копировать строки из Приложения B).

---

### Фаза 1. Admin → Site — backend (≈1 сессия) ✅

**Задачи:**

- [x] Создать `backend/apps/pages/cms_preview_registry.py` — словарь + функция `build_preview_url(page, block, *, locale="ru")`.
- [x] В `SiteTextBlockAdmin`: колонка `preview_link` в `list_display`; метод `@admin.display(description="На сайте")`.
- [x] На форме change: `readonly_fields` или fieldset с HTML-ссылкой «Открыть на сайте» (поле `preview_on_site`).
- [x] Unit-тест: URL для `("home", "entry_paths")` → `.../ru/#user-paths`.

**Файлы (только эти):**

- `backend/apps/pages/cms_preview_registry.py` (новый)
- `backend/apps/pages/admin.py` (точечно)
- `backend/apps/pages/tests.py` (2–3 теста)

**Не трогать:** models, migrations, serializers, views, frontend.

**Smoke-check:**

- `/admin/pages/sitetextblock/?page__exact=home&block__exact=entry_paths` — колонка «На сайте» открывает `/ru/#user-paths`.
- Запись без реестра — прочерк или ссылка только на path без anchor.

**Следующий шаг:** Фаза 2 — якорь `#problem-value` на главной.

---

### Фаза 2. Якоря на главной (≈1 сессия) ✅

**Задачи:**

- [x] Добавить `id="problem-value"` на секцию `EngineerIdentityStrip` (или обёртку в `page.tsx`).
- [x] При необходимости — `id="hero"` на Hero для превью блока `home/hero`.
- [x] Не менять CSS и семантику beyond `id` + `scroll-mt-*` при необходимости.

**Файлы:**

- `frontend/components/EngineerIdentityStrip.tsx` и/или `frontend/app/[locale]/page.tsx`
- `frontend/components/Hero.tsx` (опционально)
- `backend/apps/pages/cms_preview_registry.py` — anchor `hero` для блока `home/hero`

**Smoke-check:** ссылки из Фазы 1 ведут на видимую секцию; `HomeSectionProgress` подсвечивает `#problem-value`.

**Следующий шаг:** Фаза 3 — badges Site → Admin на главной.

---

### Фаза 3. Site → Admin — frontend MVP (≈1–2 сессии) ✅

**Задачи:**

- [x] `frontend/lib/cms-edit.ts` — `isCmsEditEnabled()`, `buildAdminChangelistUrl(page, block, key)`.
- [x] `frontend/components/cms/CmsText.tsx` — client component, badge on hover (вместо отдельного `CmsEditBadge.tsx`).
- [x] Оборачивать тексты на главной — `page.tsx`, `Hero.tsx`, `EngineerIdentityStrip.tsx`.
- [x] Документировать env в `.env.example` (без включения по умолчанию).

**URL admin (MVP, без pk):**

```
{ADMIN_BASE}/admin/pages/sitetextblock/?page__exact={page}&block__exact={block}&q={key}
```

**Включение локально:**

```powershell
# frontend/.env.local
NEXT_PUBLIC_CMS_EDIT=1
NEXT_PUBLIC_ADMIN_URL=http://localhost:8000
```

Перезапуск `npm run dev` обязателен.

**Smoke-check:**

- Без `NEXT_PUBLIC_CMS_EDIT` — страница идентична текущей (нет badge).
- С `NEXT_PUBLIC_CMS_EDIT=1` на localhost — hover → badge → admin changelist с одной записью.

**Следующий шаг:** Фаза 4 — env в README и backend `.env.example`.

---

### Фаза 4. Env и документация (≈30 мин) ✅

**Задачи:**

- [x] Backend `.env.example`: `FRONTEND_BASE_URL=http://localhost:3000`, опционально `CMS_PREVIEW_LOCALE=ru`.
- [x] Frontend `.env.example` / корневой `.env.example`: `NEXT_PUBLIC_CMS_EDIT=0`, `NEXT_PUBLIC_ADMIN_URL=http://localhost:8000`.
- [x] Краткий раздел в `backend/README.md` или `README.md`: как включить режим, как пользоваться.

**Файлы:** `.env.example`, README (минимальный diff).

---

### Фаза 5. Расширение покрытия (отдельные сессии, по одной странице) ✅

| Подфаза | Страница | Статус |
|---------|----------|--------|
| 5a | Solutions — `solutions/page.tsx` | ✅ CmsText |
| 5b | Contact — `contact/page.tsx`, `ContactForm` | ✅ CmsText |
| 5c | About — `about/page.tsx`, `CmsModelText` для bio/education/qualifications | ✅ |
| 5d | Book — `book/page.tsx`, Experience — `experience/page.tsx` | ✅ CmsText + CmsModelText |

**Добавлено:**

- `backend/apps/pages/cms_edit_targets.py` — пути admin для моделей
- `frontend/lib/cms-page-text.tsx` — хелпер `cmsText()`
- `frontend/components/cms/CmsModelText.tsx` — badges для About/Book/Experience
- `buildAdminModelUrl()` в `cms-edit.ts` (опционально `objectId` → `/change/`)

---

### Фаза 6 (опционально). Удобства без большого diff ✅ (частично)

- [x] Прямая ссылка `/change/{id}/` — dev-only endpoint `GET /api/content/admin-link/` + 3 теста; `CmsText` запрашивает его при клике в dev.
- [x] Колонка «фрагмент RU» в admin list (`text_ru_preview`, до 60 символов).
- [ ] Staff-only badges на staging/production (cookie/session check) — отложено.
- [ ] Proxy-модели admin по страницам (`HomeSiteTextBlock`) — **не смешивать** с навигацией в одной сессии.

**Реестр превью расширен:** book (hero, authority, purchase, cta, cover, preview), experience (ui, cases → `#cases`).

---

### Тестирование выполнено (2026-07-28)

```powershell
# Backend — 10 тестов OK
Set-Location D:\Work_Cursor\PersonalHomePage\backend
.\.venv\Scripts\Activate.ps1
python manage.py test apps.pages.tests.CmsPreviewRegistryTests apps.pages.tests.CmsAdminLinkViewTests

# Frontend
Set-Location D:\Work_Cursor\PersonalHomePage\frontend
npm run lint    # 0 errors (3 pre-existing warnings)
npm run test    # 32 tests OK
npm run build   # OK (badges off без NEXT_PUBLIC_CMS_EDIT)
```

## Что не менять (явный запрет)

- `SiteTextBlock` schema (без миграций для label в MVP; label — отдельный трек если понадобится).
- `PageContentView` response shape.
- Маршруты Next.js, i18n, дизайн-тokens.
- Pre-commit hooks, CI, docker-compose.
- `admin-plan.md` (миграция текстов в CMS).

---

## Тестирование (минимум после каждой фазы)

```powershell
# Backend
Set-Location D:\Work_Cursor\PersonalHomePage\backend
.\.venv\Scripts\Activate.ps1
python manage.py test apps.pages.tests -k preview

# Frontend (если менялся)
Set-Location D:\Work_Cursor\PersonalHomePage\frontend
npm run lint
npm run test
```

**Ручной чеклист:**

1. `/admin/pages/sitetextblock/` — колонка «На сайте», ссылка открывается в новой вкладке.
2. Форма одной записи — кнопка/ссылка превью.
3. `http://localhost:3000/ru/` без CMS_EDIT — без артеfactов.
4. С `NEXT_PUBLIC_CMS_EDIT=1` — badge → admin → правка → F5 на сайте.
5. `/en`, `/lv` — badges используют тот же admin URL (редактирование всех языков в одной форме).
6. Production build: `npm run build` — не падает (env undefined → badges off).

---

## Оценка трудозатрат

| Фаза | Сессий | Риск поломки |
|------|--------|--------------|
| 0 | 0–1 | нет |
| 1 | 1 | низкий |
| 2 | 1 | низкий |
| 3 | 1–2 | низкий (flag off = no op) |
| 4 | 0.5 | нет |
| 5* | 1 на страницу | низкий |
| 6 | по необходимости | средний |

**MVP (фазы 0–4):** главная страница + Admin → Site для всех записей реестра ≈ **3–4 короткие сессии**.

---

## Порядок работ (рекомендуемый)

```
Фаза 0 → 1 → 2 → 3 → 4   ← MVP, остановиться и пользоваться
                ↓
         5a, 5b, … по запросу
                ↓
         6 — только если нужно
```

После MVP можно редактировать главную в обоих направлениях; остальные страницы — через Admin → Site (реестр) даже без badges на фронте.

---

## Связь с `admin-plan.md`

| Документ | Фокус |
|----------|--------|
| `admin-plan.md` | Перенос текстов в CMS, seed, покрытие страниц |
| `admin_plan.md` (этот файл) | Навигация редактор ↔ сайт, без смены источника данных |

Оба плана совместимы: миграция контента не блокирует и не дублирует навигацию.

---

## Приложение A. Аудит якорей (Фаза 0)

Сверка `text_structure.md` ↔ JSX на **2026-07-28**.

### Главная (`frontend/app/[locale]/page.tsx` + компоненты)

| CMS block | Якорь в доке | `id` в DOM | Файл | Статус |
|-----------|--------------|------------|------|--------|
| `hero` | — | `hero` (секция) | `Hero.tsx` | ✅ |
| `about_teaser` | `#problem-value` | `problem-value` | `EngineerIdentityStrip.tsx` | ✅ |
| `decision_system` | `#decision-system` | `decision-system` | `page.tsx` | ✅ |
| `entry_paths` | `#user-paths` | `user-paths` | `page.tsx` | ✅ |
| `proof` | `#proof` | `proof` | `page.tsx` | ✅ |
| `contact_cta` | `#contact` | `contact` | `page.tsx` | ✅ |

### Боковая навигация главной (`HomeSectionProgress.tsx`)

Компонент ссылается на якоря `/#problem-value`, `/#solutions`, `/#cases`, `/#expertise`, `/#tools`, `/#contact`.

| Якорь в progress | Есть на главной? | Примечание |
|------------------|-----------------|------------|
| `problem-value` | ✅ | Секция `about_teaser` |
| `solutions` | ❌ | Ведёт на несуществующий id; progress — legacy/skipped anchors (не блокировать MVP превью) |
| `cases` | ❌ | То же |
| `expertise` | ❌ | То же |
| `tools` | ❌ | То же |
| `contact` | ✅ | Секция `contact_cta` |

**Вывод для MVP:** реестр превью опирается на **CMS-секции**, не на все пункты `HomeSectionProgress`. Починка `#problem-value` — обязательна в Фазе 2; остальные progress-якоря — отдельная задача (вне scope Admin ↔ Site).

### Solutions (`frontend/app/[locale]/solutions/page.tsx`)

| CMS block | Якорь DOM | Статус |
|-----------|-----------|--------|
| `hero`, `validation`, `labels`, `final_cta`, `nav` | — (верх/середина страницы без id) | ⚠️ превью → `/ru/solutions` без hash |
| `section_defectReduction` | `solutions-defect-reduction` | ✅ |
| `section_processOptimization` | `solutions-process-optimization` | ✅ |
| `section_gasSelection` | `solutions-gas-selection` | ✅ |
| `section_training` | `solutions-training` | ✅ |
| `section_wpsSupport` | `solutions-wps-support` | ✅ |
| `nav_defectReduction` … `nav_wpsSupport` | те же, что у парного `section_*` | ✅ (тот же hash) |

### Contact (`frontend/app/[locale]/contact/page.tsx`)

| CMS block | Якорь DOM | Статус |
|-----------|-----------|--------|
| `hero`, `form`, `request_types`, `contact_methods`, `empty` | — | ⚠️ превью → `/ru/contact` |
| `map` | `contact-map-heading` (H2, не секция) | ⚠️ опционально `#contact-map-heading` в Фазе 5b |

---

## Приложение B. Реестр превью MVP (Фаза 0)

Формат для Фазы 1 (`cms_preview_registry.py`). Locale превью: **`ru`**. Path — без locale (добавляется при сборке URL: `{FRONTEND_BASE_URL}/ru{path}#{anchor}`).

### `page=home`

| block | path | anchor | Примечание |
|-------|------|--------|------------|
| `hero` | `/` | — | верх страницы |
| `about_teaser` | `/` | `problem-value` | anchor после Фазы 2 |
| `decision_system` | `/` | `decision-system` | |
| `entry_paths` | `/` | `user-paths` | |
| `proof` | `/` | `proof` | |
| `contact_cta` | `/` | `contact` | |

### `page=solutions`

| block | path | anchor |
|-------|------|--------|
| `hero` | `/solutions` | — |
| `validation` | `/solutions` | — |
| `nav` | `/solutions` | — |
| `labels` | `/solutions` | — |
| `final_cta` | `/solutions` | — |
| `section_defectReduction` | `/solutions` | `solutions-defect-reduction` |
| `section_processOptimization` | `/solutions` | `solutions-process-optimization` |
| `section_gasSelection` | `/solutions` | `solutions-gas-selection` |
| `section_training` | `/solutions` | `solutions-training` |
| `section_wpsSupport` | `/solutions` | `solutions-wps-support` |
| `nav_defectReduction` | `/solutions` | `solutions-defect-reduction` |
| `nav_processOptimization` | `/solutions` | `solutions-process-optimization` |
| `nav_gasSelection` | `/solutions` | `solutions-gas-selection` |
| `nav_training` | `/solutions` | `solutions-training` |
| `nav_wpsSupport` | `/solutions` | `solutions-wps-support` |

### `page=contact`

| block | path | anchor |
|-------|------|--------|
| `hero` | `/contact` | — |
| `form` | `/contact` | — |
| `request_types` | `/contact` | — |
| `contact_methods` | `/contact` | — |
| `empty` | `/contact` | — |
| `map` | `/contact` | `contact-map-heading` |

**Итого:** 27 строк реестра (6 home + 15 solutions + 6 contact).

### Пример итогового URL превью

```
http://localhost:3000/ru/#user-paths
http://localhost:3000/ru/solutions#solutions-defect-reduction
http://localhost:3000/ru/contact
http://localhost:3000/ru/contact#contact-map-heading
```

### Site → Admin (MVP, без pk)

Шаблон changelist (Фаза 3):

```
{NEXT_PUBLIC_ADMIN_URL}/admin/pages/sitetextblock/?page__exact={page}&block__exact={block}&q={key}
```

Пример:

```
http://localhost:8000/admin/pages/sitetextblock/?page__exact=home&block__exact=entry_paths&q=entryPathsTitle
```

---

## Приложение C. Переменные окружения (Фаза 0)

Согласованные имена для Фаз 1–4 (значения по умолчанию для локальной разработки).

### Backend (Django, `backend/.env`)

| Переменная | Пример | Назначение |
|------------|--------|------------|
| `FRONTEND_BASE_URL` | `http://localhost:3000` | База URL для ссылок «На сайте» из admin |
| `CMS_PREVIEW_LOCALE` | `ru` | Лocale в path превью (`/ru/…`); опционально, default `ru` |

### Frontend (Next.js, `frontend/.env.local`)

| Переменная | Пример | Назначение |
|------------|--------|------------|
| `NEXT_PUBLIC_CMS_EDIT` | `0` | `1` — badges Site → Admin; **default выкл.** |
| `NEXT_PUBLIC_ADMIN_URL` | `http://localhost:8000` | База Django для ссылок badge; fallback: убрать `/api` из `NEXT_PUBLIC_API_URL` |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Уже в `.env.example`; для SEO; можно переиспользовать как base site URL |

### Правила включения Site → Admin

| Условие | Локально | Staging | Production |
|---------|----------|---------|------------|
| `NEXT_PUBLIC_CMS_EDIT=1` | да | да | не рекомендуется |
| hostname `localhost` / `127.0.0.1` | обязательно в MVP | — | — |
| staff-auth (Фаза 6) | опционально | опционально | рекомендуется если включать |

### Добавление в `.env.example` (Фаза 4)

Только закомментированные строки с default `0` / localhost — без включения в репозитории.
