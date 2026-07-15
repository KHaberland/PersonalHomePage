# Рекомендуемые изменения: Desktop и Mobile

Документ дополняет `audit.md` (этапы 1–8 выполнены). Здесь — **точечные правки** по результатам повторного аудита типографики, дизайн-системы и UI-консистентности.

**Дата аудита:** 2026-07-15
**Область:** только `frontend/` (Next.js + Tailwind v4, `globals.css`).

---

## Ограничения при реализации

### Не ломать существующую программу

- Не менять backend, API, маршруты, CMS-логику, тексты и переводы.
- Не расширять `frontend/messages/*.json` ради дизайн-правок.
- Не переписывать страницы целиком: замена классов и правки в `globals.css` предпочтительнее рефакторинга разметки.
- Сохранять осознанные исключения: Hero (видео), `BookSpreadPreview` (имитация бумаги), SVG калькуляторов, editorial-стиль `/blog/[slug]`.
- После каждого этапа: `npm run lint` и визуальная проверка затронутых URL (`/en`, `/ru`, `/lv`).

### Экономное использование токенов (при работе с AI / реализации плана)

- **Один этап = один тип проблемы.** Не смешивать типографику, eyebrow и blog-prose в одном PR.
- **Читать только файлы текущего этапа** (списки ниже), не весь проект.
- **Не запускать широкие поиски**, если файл уже указан в этапе.
- **Не трогать backend** для чисто визуальных этапов.
- **Максимум 3–5 файлов за итерацию**, кроме массовой замены eyebrow (тогда — только перечисленные page-файлы).
- Фиксировать в комментарии к коммиту: что изменено, что проверено, что сознательно не тронуто.

---

## Текущая база (кратко)

| Элемент | Mobile (<640px) | Desktop (≥1024px) |
|---------|-----------------|-------------------|
| H1 (стандарт) | 32px / 700 | 56px / 700 |
| H1 (Hero) | ~22–28px | ~39px |
| H2 (section) | ~23px / 700 | ~39px / 700 |
| H2 на `<h2>` с `heading-3` | 16px / 600 | 18–22px / 600 |
| H3 | 16px / 600 | 18–22px / 600 |
| Body (CSS token) | **10px** | **10–12px** |
| Body (фактический контент) | **14px** (`text-sm`) | 14–18px (разные паттерны) |
| Section padding Y | ~48px | ~80px |
| Container max | 72rem | 72rem |

---

## A. Рекомендации для Desktop (≥1024px)

### A1. Критично — базовый размер текста

**Проблема:** `body { font-size: clamp(0.625rem, 0.5vw, 0.75rem) }` даёт 10–12px. Контент живёт в `text-sm` (14px), но наследование от `body` непредсказуемо.

**Рекомендация (только `@media (min-width: 1024px)` в `globals.css`):**

```css
/* Было: 10–12px. Стало: 14px — совпадает с доминирующим text-sm */
body {
  font-size: var(--text-small); /* 0.875rem = 14px */
}
```

**Не менять на desktop:**

- Размеры `.heading-1…3` и Hero overrides — визуально устоялись.
- `.about-content` (12px body / 14px lead) — отдельный editorial-режим страницы `/about`.

**Риск:** минимальный; блоки с явным `text-sm`/`text-lg` не изменятся. Проверить: `/tools`, Footer copyright, элементы без явного размера.

**Файлы:** `frontend/app/globals.css` (1 файл).

---

### A2. Важно — унификация page intro (lead)

**Проблема:** на desktop intro страниц задаётся тремя способами:

| Паттерн | Страницы | Desktop size |
|---------|----------|--------------|
| `.lead` | about, contact, knowledge, book | 16–18px |
| `text-lg leading-relaxed text-foreground/80` | expertise, experience, solutions, tools/[slug] | 18px |
| `text-foreground/80` без размера | tools list, blog, home sections | наследует body |

**Рекомендация:** на desktop все hero-intro inner pages перевести на `.lead` (или один модификатор `.lead-page` с тем же `clamp(1rem, 1.5vw, 1.125rem)`).

**Замены (class-only, без изменения текстов):**

| Файл | Было | Стало |
|------|------|-------|
| `expertise/page.tsx` | `text-lg leading-relaxed text-foreground/80` | `lead max-w-3xl` |
| `experience/page.tsx` | то же | `lead max-w-3xl` |
| `solutions/page.tsx` | то же | `lead max-w-3xl` |
| `tools/[slug]/page.tsx` | то же | `lead max-w-3xl` |
| `tools/page.tsx` | `text-foreground/80` | `lead` (или `lead mb-12`) |
| `blog/page.tsx` | `text-foreground/80` / `text-sm …` | `.lead` для description, `.caption` для secondary |

**Не трогать:** Hero, home section leads (`text-foreground/80` под `heading-2 text-white`), blog article prose.

**Файлы:** 6 page-файлов (по одному этапу или пачкой — только они).

---

### A3. Важно — eyebrow (синий label над H1)

**Проблема:** CSS-класс `.eyebrow` — orange; на landing pages используется inline `text-sm font-semibold uppercase tracking-wide text-accent-blue` (~10 мест).

**Рекомендация:** добавить в `globals.css` модификатор без новой палитры:

```css
.eyebrow-blue {
  composes: /* не в CSS — просто дублировать свойства .eyebrow */
}
/* Практичнее: */
.eyebrow--blue {
  color: var(--accent-blue);
  font-size: var(--text-small);
  font-weight: 600;
  line-height: 1.35;
  letter-spacing: 0.05em; /* tracking-wide, как сейчас inline */
  text-transform: uppercase;
}
```

Заменить inline на `eyebrow eyebrow--blue` (или один класс `.eyebrow-blue`).

**Файлы этапа:**

- `frontend/app/globals.css`
- `page.tsx`, `expertise/page.tsx`, `experience/page.tsx`, `solutions/page.tsx`, `knowledge/page.tsx`, `tools/page.tsx` (6 файлов)

**Не менять:** `.eyebrow` на `/about` (orange).

---

### A4. Желательно — иерархия H2 на desktop

**Проблема:** section H2 (~39px) vs card H2 с классом `heading-3` (~18–22px) — на широком экране контраст сильный, правило нигде не зафиксировано.

**Рекомендация (документ + опциональный alias в CSS):**

```css
/* Семантика: крупная секция страницы */
.heading-section { /* = .heading-2, alias для читаемости */ }

/* Семантика: заголовок карточки / подблока */
.heading-card { /* = .heading-3 */ }
```

Миграция **не обязательна** на первом проходе. Достаточно правила в комментарии `globals.css`:

- `<h2 class="heading-2">` — заголовок секции (nav, map, cases list).
- `<h2 class="heading-3">` — заголовок карточки/формы (допустимо по семантике DOM).

**Не менять семантику HTML** (не превращать card titles из `h2` в `h3`) без отдельной a11y-задачи.

---

### A5. Желательно — Home desktop: H2 секций

**Проблема:** `heading-2 font-semibold text-white` на главной vs `heading-2` + `text-foreground`/`text-accent-orange` на inner pages.

**Рекомендация:** оставить как **home-only variant**, зафиксировать в CSS:

```css
.heading-2-home {
  /* extends heading-2 */
  font-weight: 600;
  color: #fff; /* или var(--foreground) на surface — проверить контраст */
  letter-spacing: -0.025em; /* tracking-tight */
}
```

Замена в `page.tsx` (2 заголовка) — 1 файл, низкий риск.

---

### A6. Низкий приоритет — desktop-only polish

| Задача | Действие | Файлы |
|--------|----------|-------|
| `.text-muted` не используется | Либо применить к 2–3 meta-блокам вместо `/80`, либо удалить класс | `globals.css` + точечно |
| Blog in-article H2/H3 | `[&_h2]:text-xl` → привязать к `var(--text-h3)` или новой `--text-article-h2` | `blog/[slug]/page.tsx`, `globals.css` |
| Experience timeline panel | Обернуть в `.card-highlight` вместо inline `rounded-2xl…` | `experience/page.tsx` |
| Home about hardcoded `#fff` | Заменить на `var(--foreground)` | `globals.css` (.home-about-*) |

---

## B. Рекомендации для Mobile (<640px)

### B1. Критично — читаемость body на маленьком экране

**Проблема:** `--text-body: clamp(0.625rem, 1vw, 0.75rem)` → **10px** на телефоне. Элементы без `text-sm` почти нечитаемы.

**Рекомендация (базовый слой, без media query — mobile-first):**

```css
:root {
  --text-body: var(--text-small); /* 14px вместо 10–12px */
}

body {
  font-size: var(--text-body);
}
```

**Альтернатива (ещё мягче, если 14px кажется крупным для индустриального стиля):**

```css
--text-body: 0.8125rem; /* 13px — компромисс */
```

Предпочтительно **14px** — совпадает с уже доминирующим `text-sm`.

**Не менять на mobile:**

- Hero title overrides (`.hero-title-line1` и др.) — отдельная шкала.
- `.about-content` smaller text — осознанное сжатие биографии.

**Проверить на mobile:** Header subtitle (`.caption`), pill labels, pagination, form hints.

**Файлы:** `frontend/app/globals.css` (можно объединить с A1 в один этап «body token»).

---

### B2. Важно — Hero mobile

**Текущее состояние (OK, менять не обязательно):**

- `min-h-[75vh]`, overlay слабее (`--hero-overlay-sm` ≤ 0.45).
- H1 через `.hero-title-line1` — меньше стандартного H1, ~2 строки.

**Рекомендация (только если после B1 текст кажется мелким):**

- Поднять минимум `.hero-title-line2` на mobile с `calc(1.125rem + 1pt)` до `1.125rem` flat (18px) — **только если** визуально подтверждено на 375px.
- Не трогать overlay и video logic.

**Файлы:** `globals.css` (опционально, после визуальной проверки B1).

---

### B3. Важно — EngineerIdentityStrip mobile

**Проблема:** lead `text-sm` (14px) на mobile, `sm:text-base` (16px) с 640px — единственный явный jump body между breakpoints.

**Рекомендация:** после B1 убрать `sm:text-base`, оставить единый `text-sm leading-relaxed` или класс `.lead` для абзацев strip.

**Файлы:** `frontend/components/EngineerIdentityStrip.tsx` (1 файл).

---

### B4. Желательно — eyebrow и caption на mobile

**Проблема:** inline eyebrow `text-sm` = 14px; `.eyebrow` orange на about — 14px с `letter-spacing: 0.12em` (шире, чем blue inline).

**Рекомендация:** этап A3 (`.eyebrow--blue`) автоматически выравнивает mobile и desktop. Отдельных mobile-правок не нужно.

**Caption на mobile:** `.caption` = ~12px (`calc(0.875rem - 0.125rem)`) — приемлемо для meta. Не уменьшать.

---

### B5. Желательно — touch targets и отступы mobile

**Текущее (OK):**

- Кнопки: `.btn-primary` padding ≥ 44px height с `.btn-lg` на Hero.
- Section X: `clamp(1rem, 4vw, 1.5rem)` — достаточно.
- Cards: `p-5` / `card-compact` — нормально для thumb.

**Рекомендация (точечно):**

| Элемент | Mobile правка | Файл |
|---------|---------------|------|
| Blog filter pills | Убедиться `min-h-[44px]` или `py-2.5` | `blog/page.tsx` |
| LanguageSwitcher | `text-[calc(0.875rem-2pt)]` → `text-sm` после B1 | `LanguageSwitcher.tsx` |
| Home entry path cards | Уже `card-interactive p-5` — OK | — |

Не менять grid breakpoints (`md:`, `lg:`) — layout стабилен.

---

### B6. Низкий приоритет — mobile grid и порядок

**EngineerIdentityStrip:** фото `order-1`, текст `order-2` на mobile — UX осознанный. **Не менять.**

**Experience timeline:** на mobile одна колонка — OK. Перевод panel на `.card-highlight` (A6) улучшит консистентность без смены layout.

---

## C. Общие этапы реализации (порядок)

Этапы упорядочены по ROI и минимальному риску. Каждый этап — отдельная итерация.

### Этап C1. Body token (mobile + desktop)

| | |
|---|---|
| **Scope** | `globals.css` только `@media` и `:root` / `body` |
| **Desktop** | A1 |
| **Mobile** | B1 |
| **Риск** | низкий |
| **Проверка** | `/en`, `/en/tools`, `/en/about`, Footer; viewport 375px и 1280px |

### Этап C2. Page intro → `.lead`

| | |
|---|---|
| **Scope** | 6 page-файлов (см. A2) |
| **Риск** | низкий (class swap) |
| **Не трогать** | home, hero, blog/[slug] prose |

### Этап C3. Eyebrow blue

| | |
|---|---|
| **Scope** | `globals.css` + 6 page-файлов (A3) |
| **Риск** | низкий |

### Этап C4. Identity strip + мелочи mobile

| | |
|---|---|
| **Scope** | `EngineerIdentityStrip.tsx`, опционально `LanguageSwitcher.tsx` (B3, B5) |
| **Риск** | низкий |

### Этап C5. Home heading variant (optional)

| | |
|---|---|
| **Scope** | `globals.css`, `page.tsx` (A5) |
| **Риск** | низкий |

### Этап C6. Polish (optional)

| | |
|---|---|
| **Scope** | A6, B6 items по одному |
| **Риск** | средний для blog prose — проверять CMS-статьи |

---

## D. Что сознательно НЕ менять

| Область | Причина |
|---------|---------|
| Font family (Inter) | Стабильно, кириллица подключена |
| Hero H1 scale (`.hero-title-line*`) | Длинные заголовки, 2 строки на mobile |
| Blog article H1 `text-foreground` | Editorial pattern |
| Blog `.blog-content` arbitrary sizes | Отдельный этап C6, риск CMS HTML |
| `BookSpreadPreview` colors | Имитация бумаги |
| Calculator SVG `text-[11px]` | Диаграмма, не UI copy |
| API, routes, CMS, messages JSON | Вне scope |
| `.about-content` 12px на `/about` | Отдельный контентный режим |

---

## E. Проверка после каждого этапа

```powershell
Set-Location "D:\Work_Cursor\PersonalHomePage\frontend"
npm run lint
```

Визуально (DevTools device toolbar):

| Viewport | URL |
|----------|-----|
| 375×812 (mobile) | `/en`, `/en/expertise`, `/en/contact`, `/en/blog` |
| 1280×800 (desktop) | те же + `/en/solutions`, `/en/about` |

Критерии:

- нет горизонтального scroll;
- H1 не обрезается;
- intro читаем без zoom;
- кнопки и pills нажимаются пальцем (mobile);
- `/ru` и `/lv` без регрессий layout (только class/CSS изменения — достаточно spot-check).

---

## F. Definition of Done (audit01)

- [x] Mobile body ≥ 13px (целевой 14px), desktop body = 14px.
- [x] Page intro inner pages используют один класс (`.lead`).
- [x] Blue eyebrow — один CSS-класс, без inline дублей.
- [x] `EngineerIdentityStrip` без лишнего `sm:text-base` jump (после body token).
- [x] `npm run lint` проходит.
- [ ] Визуально проверены mobile (375px) и desktop (1280px) на `/en`.
- [x] API, маршруты, CMS и тексты не затронуты.

---

## G. Связь с audit.md

| audit.md | audit01.md |
|----------|------------|
| Этапы 1–8 (токены, muted, CTA, cards, Section) | ✅ база готова |
| Этап 4 (формы) — не отмечен выполненным | Фактически OK (`input-industrial` в ContactForm) |
| — | C1–C6 закрыты (2026-07-15) |

При конфликте приоритетов: **сначала C1 (body token)**, затем C2–C3 — максимальный эффект при минимальном diff.
