# План переноса: Shielding Gas Selection Calculator → `/tools/shielding-gas`

**Дата:** 2026-07-15
**Источник:** `D:/Work_Cursor/Shield_calc/` ([osuv.fhost.lv/gas_shield/](https://osuv.fhost.lv/gas_shield/))
**Цель:** интеграция в сайт как страница инструмента `/[locale]/tools/shielding-gas` внутри `Layout`
**Подход:** Variant 2 — полная интеграция (без iframe / popup)

---

## Профиль первого релиза (зафиксировано)

| Параметр | Решение |
|----------|---------|
| **Языки** | **только EN / RU / LV** — локаль из URL сайта, без переключателя внутри калькулятора |
| **Scope** | **MVP:** мастер 5 шагов + Result (ISO, application, criteria scores) + **root protection** (Cr-Ni + TIG). **Без compare.** |
| **Данные** | **JSON-fixture + `GET /api/shielding-gas/catalog/`** — каталог из экспорта `data.js`; Django models + Admin — **после MVP** (этап 9) |

**Этапы первого релиза:** 0 → 1 → 2 → 3 → 4 → 5 → 7.
**Вне первого релиза:** этап 6 (compare), этап 8 (deprecate L/min API — желательно сразу после MVP), этап 9 (Admin для данных газов).

**Оценка первого релиза:** ~5–7 дней.

---

## 1. Контекст

### 1.1. Что переносим

| Компонент источника | Файл | Назначение | Первый релиз |
|---------------------|------|------------|--------------|
| Данные | `js/data.js` | материалы, процессы, толщины, газы, свойства, критерии, scores | JSON-fixture (en/ru/lv) |
| Логика | `js/calculator.js` | класс `Calculator` | порт в TypeScript |
| UI | `js/ui.js` | мастер, result, compare | шаги 1–5 + result; **compare — этап 6** |
| UI-тексты | `js/i18n.js` | подписи wizard | CMS + en/ru/lv |
| Инициализация | `js/app.js` | тема, язык, счётчик | **не переносим** |

**Мастер:** Material → Process → Thickness → Gas → Result.

### 1.2. Что уже есть на сайте

| Компонент | Путь | Статус |
|-----------|------|--------|
| Маршрут и оболочка | `frontend/app/[locale]/tools/[slug]/page.tsx` | готов |
| Slug | `shielding-gas` | зарегистрирован |
| Заглушка UI | `frontend/components/calculators/ShieldingGasCalculator.tsx` | **заменить (этап 5)** |
| API | `POST /api/calculate/shielding-gas/` | legacy L/min — deprecate на **этапе 8** |
| CMS | `shielding-gas_page`, `shielding-gas_fields` | **обновить (этап 4)** |

---

## 2. Справка: отложенные альтернативы

> Решения уже приняты (см. «Профиль первого релиза»). Ниже — кратко, **почему** compare и Django models не входят в v1.

### 2.1. Compare — этап 6 (post-MVP)

- Checkbox «Сравнить» и side-by-side на Result.
- Без compare пользователь может вернуться на шаг 4 или пройти мастер повторно.
- +1–2 дня, больше state в UI; эталон — сценарий #10.

### 2.2. Django models + Admin — этап 9 (post-MVP)

- До этапа 9 каталог газов правится через JSON/fixture + деплой.
- Тексты wizard — в `SiteTextBlock` с первого релиза (CMS-правила соблюдены для UI).
- Переход JSON → БД **без смены** URL `GET /api/shielding-gas/catalog/`.

### 2.3. Языки DE / LT / ET

- В источнике есть; на сайте **не показываем** до расширения локалей next-intl.

---

## 3. Ограничения при реализации

### 3.1. Не ломать сайт

- Не менять маршруты, Layout, дизайн-систему без необходимости.
- Не ломать `/api/about/`, `/api/book/`, `/api/contact/`, `/api/tools/`.
- Не трогать другие калькуляторы.
- Не менять структуру `tools/[slug]/page.tsx` — только inner-компонент.
- UI-тексты wizard — Django Admin; `messages/*.json` — только fallback.

### 3.2. Не ломать логику Shield_calc

- **`D:/Work_Cursor/Shield_calc/` не редактировать** — эталон.
- Порт `calculator.js` **пов поведению**, без рефакторинга алгоритмов на первом проходе.
- Структура данных из `data.js` — **1:1** в JSON-fixture.
- Не переносить: Gas Card Editor, `localStorage` overrides, счётчик, theme/lang switcher.

### 3.3. Экономия токенов (AI)

- Один этап = один тип изменений (backend **или** frontend **или** CMS).
- Читать только файлы из таблицы этапа.
- Не читать `D:/Work_Cursor/Gas/` (gas-cutting).
- Не смешивать с audit01 / correction01.
- Сверка первого релиза — **сценарии #1–#9** (раздел 6), не #10.
- `npm run build` — только перед финальной приёмкой MVP.

---

## 4. Целевая архитектура (первый релиз)

```
/[locale]/tools/shielding-gas          ← page.tsx (без изменений структуры)
  └── ShieldingGasCalculator.tsx       ← React wizard, MVP без compare
        └── lib/shielding-gas/
              calculator.ts            ← порт Calculator
              types.ts
              catalog.ts               ← createCalculator(catalog)
        └── GET /api/shielding-gas/catalog/?lang=en|ru|lv
              ← backend/apps/calculators/shielding_gas_catalog.json

POST /api/calculate/shielding-gas/     ← legacy L/min, не используется MVP UI; этап 8
```

**Post-MVP:** этап 9 — catalog из Django models; контракт GET API тот же.

---

## 5. Поэтапный план

### Этап 0. Инвентаризация — **v1** ✅

| | |
|---|---|
| **Scope** | только чтение |
| **Риск** | нулевой |
| **Файлы** | `Shield_calc/js/data.js`, `calculator.js`, `ShieldingGasCalculator.tsx`, `services.py` |

- [x] Сценарии #1–#9 (раздел 6) прогнаны на локальном Shield_calc (2026-07-15)
- [x] Список gas id зафиксирован (см. ниже)

#### Отчёт инвентаризации (2026-07-15)

**Источник (эталон):** `D:/Work_Cursor/Shield_calc/` — не изменён.

**Сценарии #1–#9** — прогнаны программно через `Calculator` + `data.js` (локально). Все **PASS**:

| # | Material | Process | Thickness | Газы (факт) | Root protection |
|---|----------|---------|-----------|-------------|-----------------|
| 1 | fe-steel | MAG | thin | ferroline-c6x1, ferroline-c8 | — |
| 2 | fe-steel | MAG | thick | ferroline-c25, ferroline-c18, ferroline-c12x2 | — |
| 3 | fe-steel | TIG | thin | ar | — |
| 4 | fe-steel | TIG | thick | aluline-he30 | — |
| 5 | cr-ni-steel | MAG | thin | inoxline-c3h1, inoxline-c2, inoxline-x2 | — |
| 6 | cr-ni-steel | MAG | thick | inoxline-he15c2 | — |
| 7 | cr-ni-steel | TIG | thin | ar, inoxline-he3h1 | ✅ ar, forming-gas |
| 8 | al-alloys | MIG | thin | ar, aluline-he30 | — |
| 9 | al-alloys | TIG | thick | aluline-he30, aluline-he50, aluline-he70 | — |

**Материалы (3):** `fe-steel`, `cr-ni-steel`, `al-alloys`.

**Gas id (17 уникальных):**

| id | Группа criteria | gasProperties | gasCriteriaScores | Примечание |
|----|-----------------|---------------|-------------------|------------|
| `ferroline-c6x1` | ferroline | ✅ | ✅ | |
| `ferroline-c8` | ferroline | ✅ | ✅ | |
| `ferroline-c12x2` | ferroline | ✅ | ✅ | |
| `ferroline-c18` | ferroline | ✅ | ✅ | |
| `ferroline-c25` | ferroline | ✅ | ✅ | |
| `inoxline-c2` | inoxlineMag | ✅ | ✅ | |
| `inoxline-c3h1` | inoxlineMag | ✅ | ✅ | |
| `inoxline-x2` | inoxlineMag | ✅ | ✅ | |
| `inoxline-he15c2` | inoxlineMag | ✅ | ✅ | |
| `inoxline-he3h1` | tigGroup | ✅ | ✅ | |
| `inoxline-h5` | tigGroup | ✅ | ✅ | только cr-ni TIG thick |
| `ar` | aluline | ✅ | ✅ | i18n name (en/ru/lv) |
| `aluline-he30` | aluline | ✅ | ✅ | |
| `aluline-he50` | aluline | ✅ | ✅ | |
| `aluline-he70` | aluline | ✅ | ✅ | |
| `forming-gas` | — | ❌ | ❌ | только root protection (#7) |

**Criteria groups (4):** `ferroline`, `inoxlineMag`, `tigGroup`, `aluline`.

**Структура `data.js` для экспорта (этап 1):** `materials`, `thicknessOptions`, `gases`, `rootProtectionGases`, `gasProperties`, `criteriaGroups`, `gasCriteriaScores`, `propertyLabels`, `rootProtectionWarning`. Локали в MVP: **en / ru / lv** (de/lt/et — отбросить).

**Сайт сейчас (gap analysis):**

| Компонент | Состояние | Что менять |
|-----------|-----------|------------|
| `ShieldingGasCalculator.tsx` | Legacy L/min форма (wire Ø, steel/stainless/aluminum, MIG/TIG) | Полная замена на этапе 5 |
| `POST /api/calculate/shielding-gas/` | `calculate_shielding_gas()` — расход L/min по диаметру проволоки | Оставить до этапа 8 |
| `GET /api/shielding-gas/catalog/` | **отсутствует** | Этап 1 |
| CMS `shielding-gas_page` | Lead про L/min | Этап 4 |
| `CalculatorStaticExample` | SVG min/typ/max (L/min band) | Этап 7 |

**Calculator API (эталон):** 316 строк, методы: `getMaterials`, `selectMaterial`, `getAvailableProcesses`, `selectProcess`, `getAvailableThicknesses`, `selectThickness`, `getAvailableGases`, `selectGas`, `getGasInfo`, `getGasInfoById`, `getCriteriaGroupByGasId`, `getCriteriaForGas`, `getCriteriaAverageScore`, `getAllGasesList`, `isRootProtectionRequired`, `getRootProtectionGases`, `getRootProtectionWarning`, `getPropertyLabel`, `reset`, `getState`, `getThicknessLabel`.

---

### Этап 1. Backend — JSON catalog API — **v1**

| | |
|---|---|
| **Scope** | `backend/apps/calculators/` |
| **Риск** | средний |
| **Не трогать** | другие `calculate_*` |

1. Экспорт `data.js` → `shielding_gas_catalog.json` — **только поля en / ru / lv**.
2. `GET /api/shielding-gas/catalog/?lang={en|ru|lv}` — валидация lang, fallback `en`.
3. `POST /api/calculate/shielding-gas/` (L/min) — **оставить** до этапа 8.
4. Тесты: структура каталога, 3 локали, ≥1 газ с properties + criteria.

**Приёмка:**

- [x] API отдаёт 3 материала и полный набор газов для MVP-сценариев
- [x] `manage.py test apps.calculators` — OK

---

### Этап 2. Frontend — порт `Calculator` — **v1**

| | |
|---|---|
| **Scope** | `frontend/lib/shielding-gas/calculator.ts`, `types.ts` |
| **Риск** | средний |

- Порт класса без DOM / localStorage.
- Unit-тесты на сценарии #1–#9.

**Приёмка:**

- [x] Логика совпадает с `Shield_calc` для #1–#9

---

### Этап 3. Frontend — API client — **v1**

| | |
|---|---|
| **Scope** | `frontend/lib/api.ts`, `frontend/lib/shielding-gas/catalog.ts` |

- `getShieldingGasCatalog(lang)` — lang только `en` | `ru` | `lv`.
- `createCalculator(catalog)`.

**Приёмка:**

- [x] Типы совпадают с backend
- [x] `npm run lint` — OK

---

### Этап 4. CMS — тексты wizard — **v1**

| | |
|---|---|
| **Scope** | migration `SiteTextBlock`, `calculator-content.ts` |
| **Источник текстов** | `Shield_calc/js/i18n.js` — ключи **en / ru / lv** |

- Block `shielding-gas_wizard`: step labels, back, reset, errors, root protection, score note.
- Обновить `shielding-gas_page`: lead/example про **подбор смеси**, не L/min.
- Убрать/не использовать в MVP mapping для `wireDiameter_*` (legacy L/min).

**Приёмка:**

- [x] Lead не про L/min на `/en`, `/ru`, `/lv`
- [x] JSON fallback работает при пустом CMS

---

### Этап 5. Frontend — React wizard (MVP) — **v1**

| | |
|---|---|
| **Scope** | `ShieldingGasCalculator.tsx` + step components |
| **Риск** | высокий |
| **Не трогать** | `page.tsx`, другие калькуляторы |
| **Явно не делать** | compare checkbox, compare panel, Gas Card Editor |

| Шаг | Содержание |
|-----|------------|
| 1 | Material — 3 карточки |
| 2 | Process — по `getAvailableProcesses()` |
| 3 | Thickness — thin / thick |
| 4 | Gas — список из `getAvailableGases()` |
| 5 | Result — ISO, application, criteria scores, средний балл; **root protection** для cr-ni-steel + TIG |

- Back / Reset — тексты из CMS props.
- Стили — классы сайта (`card`, `btn-primary`, `text-accent-orange`).

**Приёмка:**

- [x] Полный проход 1→5 на `/en`, `/ru`, `/lv`
- [x] Сценарии #1–#9 совпадают с Shield_calc
- [x] Root protection на сценарии #7
- [x] Layout (шапка/футер); `npm run lint` — OK

---

### Этап 7. Static example + metadata — **v1**

| | |
|---|---|
| **Scope** | `CalculatorStaticExample.tsx`, запись `Calculator` slug `shielding-gas` |

- `ShieldingGasExample` — схема 5 шагов (не L/min band).
- name/description калькулятора — про подбор защитного газа.

**Приёмка:**

- [x] Карточка на `/tools` и example block согласованы с MVP

---

### Этап 6. Compare — **post-MVP**

| | |
|---|---|
| **Scope** | Step 4/5 |
| **Зависимость** | приёмка этапа 5 |

- Checkbox compare, блок сравнения, сброс при смене criteria group.

**Приёмка:** сценарий #10.

---

### Этап 8. Deprecate L/min API — **post-MVP** (рекомендуется сразу после v1)

| | |
|---|---|
| **Scope** | `services.py`, `views.py`, `frontend/lib/api.ts` (legacy `calculateShieldingGas`) |

- Удалить или заменить `calculate_shielding_gas()` (расход L/min).

---

### Этап 9. Django models + Admin — **post-MVP**

| | |
|---|---|
| **Scope** | models, admin, data migration JSON → БД |

- Редактирование газов / criteria в Admin вместо Gas Card Editor.
- **Контракт** `GET /api/shielding-gas/catalog/` — без изменений.

---

## 6. Эталонные сценарии

| # | Material | Process | Thickness | Ожидаемые газы | Релиз |
|---|----------|---------|-----------|----------------|-------|
| 1 | fe-steel | MAG | thin | ferroline-c6x1, ferroline-c8 | **v1** |
| 2 | fe-steel | MAG | thick | ferroline-c25, c18, c12x2 | **v1** |
| 3 | fe-steel | TIG | thin | ar | **v1** |
| 4 | fe-steel | TIG | thick | aluline-he30 | **v1** |
| 5 | cr-ni-steel | MAG | thin | inoxline-c3h1, c2, x2 | **v1** |
| 6 | cr-ni-steel | MAG | thick | inoxline-he15c2 | **v1** |
| 7 | cr-ni-steel | TIG | thin | ar, inoxline-he3h1 | **v1** + root protection |
| 8 | al-alloys | MIG | thin | ar, aluline-he30 | **v1** |
| 9 | al-alloys | TIG | thick | aluline-he30, he50, he70 | **v1** |
| 10 | fe-steel | MAG | thin → c6x1 vs c8 | ferroline group | **этап 6** (compare) |

---

## 7. Проверка

### После каждого этапа v1

```powershell
Set-Location "D:\Work_Cursor\PersonalHomePage\frontend"
npm run lint

Set-Location "D:\Work_Cursor\PersonalHomePage\backend"
.\.venv\Scripts\python.exe manage.py test apps.calculators
```

### Финальная приёмка первого релиза (этапы 0–5, 7)

| Viewport | URL | Что смотреть |
|----------|-----|--------------|
| 375×812 | `/en/tools/shielding-gas`, `/ru/...`, `/lv/...` | 5 шагов, result, root protection (#7) |
| 1280×800 | те же | stepper, criteria scores, CTA контакт |

---

## 8. Definition of Done

### Первый релиз (v1) — **обязательно**

- [x] Профиль релиза: EN/RU/LV, MVP без compare, JSON catalog API.
- [x] Мастер 1–5 в Layout; сценарии #1–#9 = Shield_calc.
- [x] Root protection на Cr-Ni + TIG.
- [x] CMS wizard texts; JSON fallback.
- [x] Static example — 5 шагов; карточка `/tools` обновлена.
- [x] `Shield_calc` на диске не изменён.
- [x] Другие инструменты и API без регрессий.
- [x] `npm run lint` и `manage.py test apps.calculators` — OK.

### Post-MVP — **отдельные итерации**

- [ ] Этап 6: compare (#10)
- [ ] Этап 8: L/min API удалён
- [ ] Этап 9: данные газов в Django Admin

---

## 9. Оценка

| Объём | Срок |
|-------|------|
| **Первый релиз (v1):** этапы 0–5, 7 | ~5–7 дней |
| + Compare (этап 6) | +1–2 дня |
| + Deprecate L/min (этап 8) | +0.5 дня |
| + Django Admin (этап 9) | +2–3 дня |

---

## 10. Следующий шаг

**v1 завершён (2026-07-15).** Следующие итерации — post-MVP: этап 6 (compare), этап 8 (deprecate L/min API), этап 9 (Django Admin для каталога газов).

---

## 11. Связь с другими документами

| Документ | Связь |
|----------|-------|
| `admin-plan.md` | CMS-правила, блок calculators |
| `structure.md` §12 | страница `/tools/{slug}` |
| `.cursor/rules/cms-migration.mdc` | тексты wizard в Admin |
| `correction01.md` | не смешивать с CSS-правками home |
