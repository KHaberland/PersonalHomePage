# Раздел «About me» (страница `/about`)

Техническое и визуальное описание соответствует реализации в Next.js: `frontend/app/[locale]/about/page.tsx`, стили — `frontend/app/globals.css`, оболочка — `frontend/components/Layout.tsx`, шрифт — `frontend/app/layout.tsx`.

---

## 1. Маршрут и обёртка страницы

- **URL:** `/[locale]/about`, например `/en/about`, `/ru/about`, `/lv/about`.
- **Корневой layout:** `body` с классами `antialiased bg-background text-foreground min-h-screen`, шрифт **Inter** (Google Fonts), переменная `--font-inter`, подмножества **latin** и **cyrillic**.
- **Макет сайта:** `Layout` — колонка на всю высоту экрана: `flex min-h-screen flex-col bg-background text-foreground`, сверху шапка, основная область `main flex-1`, снизу подвал. Фон страницы совпадает с фоном всего приложения.

---

## 2. Фон страницы и цвета

| Элемент | Значение |
|--------|-----------|
| Фон приложения (`bg-background` / `body`) | `--background: #0a0c0f` |
| Основной текст | `--foreground: #e6edf3` |
| Приглушённый текст (абзацы блоков, списки) | через Tailwind: `text-foreground/80`, `text-foreground/90`, `text-foreground/55` |
| Акцент заголовков H1/H2 в шапке раздела | `--accent-orange: #f97316` (`text-accent-orange`) |
| Карточка «Почему выбирают…» | `bg-surface/50` (`--surface: #161b22`), рамка `border-border/80`, скругление `rounded-xl`, лёгкая внутренняя тень |
| Блок портрета | рамка `border-border` (`--border: #30363d`), скругление `rounded-lg` |
| Сетка дипломов | класс `card` — фон `var(--surface)`, рамка `var(--border)` |

Отдельного градиентного фона только для `/about` нет: используется тот же тёмный индустриальный фон, что и на остальных страницах.

---

## 3. Контейнер и отступы секции

- Один корневой блок контента: `container-narrow section`.
- **`container-narrow`:** `max-width: 48rem` (768px), горизонтальное центрирование.
- **`section`:** вертикальные отступы `padding-top/bottom: clamp(3rem, 8vw, 5rem)`, горизонтальные `padding-left/right: clamp(1rem, 4vw, 1.5rem)`.

---

## 4. Разметка (порядок блоков сверху вниз)

Семантика HTML:

1. **`h1`** — заголовок страницы (ключ перевода `about.title`).
2. **`<section aria-labelledby="about-why-heading">`** — вступительный блок «почему выбирают»: подпись, `h2`, маркированный список **без** стандартных маркеров (`list-none`).
3. **Сетка двух колонок** — `div` с классом `grid items-start gap-12 md:grid-cols-[23fr_17fr]`:
   - слева (на широком экране) — портрет;
   - справа — колонка текстовых секций.
4. **Правая колонка** — несколько `<section>` подряд с вертикальным интервалом `space-y-6`:
   - биография (если из API/HTML есть видимый текст),
   - образование,
   - квалификации,
   - достижения — **`ul`** со стилями `list-disc pl-5`.
5. **`<section class="mt-16">`** — заголовок уровня **H2** (`heading-2`) и компонент дипломов/сертификатов.
6. **`div`** — сетка рабочих фотографий `mt-16`, 2–4 колонки в зависимости от ширины.

На узком экране (`< md`) колонки складываются в одну: сначала портрет, затем текстовый столбец (порядок в DOM: фото, затем текст — визуально фото сверху).

---

## 5. Типографика и формат текста

### Глобальные классы заголовков (`globals.css`)

- **`heading-2`** (заголовок страницы и блок «Дипломы»): размер `calc(var(--text-h2) - 1pt)`, где `--text-h2: clamp(1.5rem, 4vw, 2.5rem)`; **`font-weight: 700`**, `letter-spacing: -0.01em`; на странице About для H1/H2 дополнительно цвет акцента или `text-foreground`.
- **`heading-3`:** по умолчанию `font-size: var(--text-h3)` (`clamp(1rem, 2vw, 1.25rem)`), `font-weight: 600`.
- **Экран ≥ 1024px:** для `body` задан уменьшенный базовый кегль; для `.heading-3` — `clamp(1.125rem, 2vw, 1.375rem)`.

### Блок «Почему выбирают…»

- Подпись над заголовком: `text-xs font-semibold uppercase tracking-wide text-foreground/55`.
- Заголовок `h2`: `heading-3 mt-2 text-accent-orange`.
- Список: `text-sm text-foreground/90`, пункты с `space-y-3`; первая часть пункта **semibold** `text-foreground`, описание после «—» — `text-foreground/80`.

### Заголовки подразделов «Биография / Образование / Квалификации»

- Классы: `about-block-title heading-3 mb-3 text-foreground`.
- Специально для About: **`.heading-3.about-block-title`** — кегль на **2pt меньше** базового `heading-3`, **`font-weight: 400`** (не жирные).

### Основной HTML-контент биографии, образования, квалификаций

- Контейнер: `about-content text-foreground/80` + для абзацев `[&_p]:mt-2 [&_p]:leading-relaxed [&_p:first-child]:mt-0`.
- **`.about-content`:** кегль **`calc(var(--text-body) - 2pt)`**, базовый `--text-body: clamp(0.625rem, 1vw, 0.75rem)`; **`font-weight: 400`**; для **`b` и `strong` внутри** принудительно **`font-weight: 400`** (визуально без жирного в этом блоке).
- **При ширине ≥ 1024px:** текст `.about-content` пересчитывается как `calc(clamp(0.75rem, 0.8vw, 0.875rem) - 2pt)`.

### Структурированные классы внутри HTML с бэкенда

Если в разметке контента используются классы **`home-about-lead`** и **`home-about-p`**:

| Класс | Размер / начертание | Цвет на `/about` |
|-------|---------------------|------------------|
| `.home-about-lead` | **17px**, `font-weight: 600`, `line-height: 1.375`, `letter-spacing: -0.025em` | `var(--foreground)` |
| `.home-about-p` | **14px**, `font-weight: 400`, `line-height: 1.45` | `color-mix(foreground 88%, transparent)` |

### Секция «Достижения»

- Список: базовый цвет `text-foreground/80`, маркеры `list-disc`, отступ слева `pl-5`, межстрочный интервал `leading-relaxed` для элементов.

### Карточки дипломов

- Заголовок карточки: `text-sm font-semibold text-foreground`.
- Краткое описание: `text-xs text-foreground/70 leading-relaxed`.

---

## 6. Фотография портрета (размер и поведение)

- Родительский блок: `relative aspect-[4/5] w-full overflow-hidden rounded-lg border border-border`.
- **Соотношение сторон 4:5** — высота задаётся пропорционально ширине колонки; **фиксированных пикселей по ширине нет**: ширина = доля сетки **23/40** контейнера на `md+` (первая колонка пропорции `23fr_17fr`), на мобильных — **100%** ширины `container-narrow`.
- Изображение Next.js `Image` с **`fill`**, **`object-cover object-top`** — обрезка по центру по горизонтали, прижатие к верху по вертикали.
- **`sizes`:** `(max-width: 768px) 100vw, 50vw` — подсказка для выбора разрешения.
- **Источник:** поле `photo` из API `getAbout(lang)`, иначе файл по умолчанию `/images/photos/small/author01_small.jpg`. Внешние URL: `unoptimized`.

---

## 7. Сетка колонок «фото + текст»

| Вьюпорт | Поведение |
|---------|-----------|
| **< 768px (`md`)** | Одна колонка, отступ между блоками `gap-12`. |
| **≥ 768px** | Две колонки: **~57.5%** и **~42.5%** ширины (соотношение **23fr : 17fr**), выравнивание по верху `items-start`. |

---

## 8. Дипломы и сертификаты

- Сетка: **`grid gap-4`**, **1** колонка на узком экране, **`sm:grid-cols-2`**, **`lg:grid-cols-4`**.
- У каждой карточки превью с **`aspect-[4/3]`**, ниже текст и кнопка «открыть в модальном окне» (стили `btn-primary`).
- Модальное окно: класс `diploma-dialog` (скругление, фон `surface`, затемнённый backdrop).

Список документов и превью задан в коде страницы (бакалавр, магистр, IWE PDF, MMA, TIG и т.д.).

---

## 9. Блок рабочих фотографий (ниже дипломов)

- Контейнер: `grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4`.
- Каждая ячейка: **`aspect-square`**, `rounded-lg`, `border border-border`, изображение `object-cover`.
- **`sizes`:** `(max-width: 640px) 50vw, 25vw`.
- Файлы из `/images/photos/` (имена задаются в массиве в `page.tsx`).

---

## 10. Источники контента

- Заголовки и статические строки (достижения, подписи дипломов, alt-тексты): **next-intl**, пространство имён `about` и частично `home` (блок «почему выгирают»).
- **Биография, образование, квалификации, URL фото:** REST API **Django** (`getAbout`); при ошибке сети — fallback из переводов (`fallbackBio`, `fallbackEducation`, `fallbackQualifications`).

---

## 11. Краткая схема блоков (для верстальщика)

```
[ H1 страницы ]
[ Карточка: подпись + H2 + 4 пункта без маркеров ]
[ Grid 23/17 — md+ ]
  [ Портрет 4:5 | Bio + Education + Qualifications + Achievements UL ]
[ H2 Дипломы + сетка карточек 1/2/4 колонки ]
[ Сетка миниатюр 2/3/4 колонки, квадраты ]
```

---

## 12. Полный текст страницы (контент по locales)

Источник строк: `frontend/messages/en.json`, `ru.json`, `lv.json` (ключи `about.*` и для блока «почему выбирают» — `home.whyChoose*`). Биография, образование и квалификации на живом сайте могут приходить из API Django; если запрос не удался — подставляются **fallback** из тех же файлов (`fallbackBio`, `fallbackEducation`, `fallbackQualifications`). Ниже для каждого языка приведено всё видимое пользователю: заголовки, списки, подписи карточек дипломов, кнопки модального окна, alt-тексты, HTML fallback-блоков.

### English (`/en/about`)

| Место на странице | Текст |
|-------------------|--------|
| Подпись над блоком «почему» | Value for employers and clients |
| Заголовок H1 | About Me |
| Заголовок H2 блока «почему» | Why work with me |
| Пункт 1 | **Hands-on experience** — Welding engineer (IWE) with production-floor experience. |
| Пункт 2 | **Business outcomes** — Clear recommendations — fewer defects, predictable costs. |
| Пункт 3 | **People development** — I train welders and shop-floor leaders — skills that work where it matters. |
| Пункт 4 | **Authorship & long-term support** — Author of a MAG/MIG book; I support production teams over the long term. |
| Заголовок секции биографии | Biography |
| Заголовок секции образования | Education |
| Заголовок секции квалификаций | Professional Qualifications |
| Заголовок списка достижений | Achievements and expertise |
| Достижение 1 | Author of the practical guide “MAG/MIG welding” (2024). |
| Достижение 2 | Welding engineer (IWE): implementation and auditing of MIG/MAG, TIG, and MMA processes. |
| Достижение 3 | Experience supporting industrial production and training welders in industry and training centres. |
| Достижение 4 | Expertise in shielding gas selection and welding equipment. |
| Достижение 5 | Optimization of welding quality and process efficiency. |
| Заголовок блока дипломов | Diplomas & Certifications |
| Карточка: заголовок бакалавра | Bachelor's degree |
| Карточка: кратко бакалавр | Higher education: bachelor’s degree from RTU. |
| Карточка: заголовок магистра | Master's degree (RTU) |
| Карточка: кратко магистр | RTU master’s degree — advanced engineering preparation. |
| Карточка: IWE | International Welding Engineer (IWE) certificate |
| Карточка: кратко IWE | International welding engineer qualification under the IIW/EWF programme. |
| Карточка: MMA/MAG | MMA/MAG Welding |
| Карточка: кратко MMA/MAG | Qualification in manual metal arc and semi-automatic welding (MMA/MAG). |
| Карточка: TIG | TIG Welding |
| Карточка: кратко TIG | Certification in TIG / GTAW welding. |
| Кнопка карточки | View |
| Ссылка в модалке | Open in new tab |
| Кнопка закрыть модалку | Close |
| Заголовок iframe PDF | PDF document viewer |
| Alt портрета | Oleg Suvorov, welding engineer |
| Alt рабочих фото | Work photo |
| Шаблон alt превью диплома | Preview of document “{title}” (`{title}` — название карточки) |

**Fallback HTML — биография (если нет данных API):**

```html
<p class='home-about-lead'>Welding engineer (IWE) with teaching experience</p><p class='home-about-p'>Qualifications in TIG, MAG, and MMA welding processes; practical skills in oxy-fuel cutting, soldering, brazing, and thermal straightening.</p><p class='home-about-p'>Experience in welding and assembly of steel structures with minimal thermal distortion and optimization of welding processes.</p><p class='home-about-p home-about-p--gap-lg'>Expert support in selecting shielding gas mixtures for MAG, MIG, and TIG welding to improve quality and process stability.</p><p class='home-about-p home-about-p--gap-lg'>Author of a book on MAG/MIG welding.</p>
```

**Fallback HTML — образование:**

```html
<p>Bachelor and Master degrees from RTU (Riga Technical University).</p>
```

**Fallback HTML — квалификации:**

```html
<p>Certified in MMA/MAG and TIG welding. Welding instructor qualification.</p>
```

---

### Russian (`/ru/about`)

| Место на странице | Текст |
|-------------------|--------|
| Подпись над блоком «почему» | Ценность для работодателя и заказчика |
| Заголовок H1 | Обо мне |
| Заголовок H2 блока «почему» | Почему выбирают меня |
| Пункт 1 | **Практический опыт** — Инженер по сварке (IWE) с опытом работы на производстве. |
| Пункт 2 | **Результаты для бизнеса** — Прозрачные рекомендации — меньше брака, прогнозируемые затраты. |
| Пункт 3 | **Обучение персонала** — Обучаю сварщиков и руководителей производственных бригад — навыки, которые реально работают в цеху. |
| Пункт 4 | **Авторство и сопровождение** — Автор книги по MAG/MIG, сопровождаю производственные команды на долгосрочной основе. |
| Заголовок секции биографии | Биография |
| Заголовок секции образования | Образование |
| Заголовок секции квалификаций | Профессиональные квалификации |
| Заголовок списка достижений | Достижения и экспертиза |
| Достижение 1 | Автор практического руководства «Сварка MAG/MIG» (2024) |
| Достижение 2 | Внедрение и аудит сварочных процессов MIG/MAG, TIG, MMA |
| Достижение 3 | Опыт сопровождения производств и обучения сварщиков |
| Достижение 4 | Подбор защитных газов и сварочного оборудования |
| Достижение 5 | Оптимизация качества и эффективности сварочных процессов |
| Заголовок блока дипломов | Дипломы и сертификаты |
| Карточка: бакалавр | Бакалавр |
| Кратко бакалавр | Высшее техническое образование: бакалавриат РТУ. |
| Карточка: магистр | Магистр (РТУ) |
| Кратко магистр | Магистр РТУ — углублённая инженерная подготовка. |
| Карточка: IWE | Сертификат международного инженера по сварке (IWE) |
| Кратко IWE | Международная квалификация инженера по сварке в рамках программы IIW/EWF. |
| Карточка: MMA/MAG | Сварка MMA/MAG |
| Кратко MMA/MAG | Квалификация по ручной дуговой и полуавтоматической сварке (MMA/MAG). |
| Карточка: TIG | Сварка TIG |
| Кратко TIG | Сертификация по аргонодуговой сварке (TIG/GTAW). |
| Кнопка карточки | Просмотреть |
| Ссылка в модалке | В новой вкладке |
| Кнопка закрыть | Закрыть |
| Заголовок iframe PDF | Просмотр PDF-документа |
| Alt портрета | Олег Суворов, инженер по сварке |
| Alt рабочих фото | Фото с работы |
| Шаблон alt превью | Превью документа «{title}» |

**Fallback HTML — биография:**

```html
<p class='home-about-lead'>Инженер по сварке (IWE) с опытом преподавания</p><p class='home-about-p'>Квалификация по TIG, MAG, MMA сварочным процессам, практическое владение газокислородной резкой, пайкой и термической правкой.</p><p class='home-about-p'>Опыт в технологии сварки-сборки металлических конструкций с минимальными термическими деформациями и оптимизацией сварочных процессов.</p><p class='home-about-p home-about-p--gap-lg'>Оказываю экспертную помощь в выборе защитной газовой смеси при сварке MAG/MIG/TIG для повышения качества и стабильности процессов.</p><p class='home-about-p home-about-p--gap-lg'>Автор книги по MAG/MIG.</p>
```

**Fallback HTML — образование:**

```html
<p>Степень бакалавра и магистра инженерных наук получена в Рижском техническом университете (RTU), Рига, Латвия.</p><p>Специализация — технология приборостроения.</p><p>Дополнительное обучение инженера по сварке:<br />Schweißtechnische Lehr- und Versuchsanstalt Mecklenburg-Vorpommern GmbH, Росток, Германия.</p>
```

**Fallback HTML — квалификации:**

```html
<p>Квалификация сварщика MMA/MAG — 3-я ремесленная школа, Рига, Латвия</p><p>Квалификация сварщика TIG — учебный центр Buts, Рига, Латвия</p><p>Уровень знаний International Welding Engineer (IWE)</p>
```

---

### Latvian (`/lv/about`)

| Место на странице | Текст |
|-------------------|--------|
| Подпись над блоком «почему» | Vērtība darba devējam un klientam |
| Заголовок H1 | Par mani |
| Заголовок H2 блока «почему» | Kāpēc izvēlas mani |
| Пункт 1 | **Praktiska pieredze** — Metināšanas inženieris (IWE) ar pieredzi ražošanā. |
| Пункт 2 | **Rezultāti biznesam** — Skaidri ieteikumi — mazāk brāķa, paredzamas izmaksas. |
| Пункт 3 | **Personāla apmācība** — Apmācu metinātājus un ražošanas brigāžu vadītājus — prasmes, kas tiešām strādā cehā. |
| Пункт 4 | **Autorība un pavadība** — Grāmatas par MAG/MIG autors; ilgtermiņā pavadošu ražošanas komandas. |
| Заголовок биографии | Biogrāfija |
| Заголовок образования | Izglītība |
| Заголовок квалификаций | Profesionālās kvalifikācijas |
| Заголовок достижений | Sasniegumi un ekspertīze |
| Достижение 1 | Praktiskā rokasgrāmata «MAG/MIG metināšana» (2024) autors. |
| Достижение 2 | Metināšanas inženieris (IWE): MIG/MAG, TIG un MMA procesu ieviešana un audits. |
| Достижение 3 | Pieredze ražošanas atbalstā un metinātāju apmācībā rūpniecībā un mācību centros. |
| Достижение 4 | Ekspertīze aizsarggāzu un metināšanas iekārtu izvēlē. |
| Достижение 5 | Metināšanas kvalitātes un procesa efektivitātes optimizācija. |
| Заголовок дипломов | Diplomi un sertifikāti |
| Карточка: бакалавр | Bakalaura grāds |
| Кратко | Augstākā izglītība: bakalaura grāds RTU. |
| Магистр | Maģistra grāds (RTU) |
| Кратко | RTU maģistra grāds — padziļināta inženieru sagatavošana. |
| IWE | Starptautiskā metināšanas inženiera (IWE) sertifikāts |
| Кратко IWE | Starptautiska metināšanas inženiera kvalifikācija IIW/EWF programmas ietvaros. |
| MMA/MAG | MMA/MAG metināšana |
| Кратко | Kvalifikācija manuālajā loka un pusautomātiskajā metināšanā (MMA/MAG). |
| TIG | TIG metināšana |
| Кратко TIG | Sertifikācija TIG / GTAW metināšanā. |
| Кнопка | Skatīt |
| В новой вкладке | Jaunā cilnē |
| Закрыть | Aizvērt |
| PDF viewer | PDF dokumenta skatītājs |
| Alt портрета | Olegs Suvorovs, metināšanas inženieris |
| Alt работы | Fotogrāfija no darba |
| Превью | Priekšskatījums dokumentam «{title}» |

**Fallback HTML — биография:**

```html
<p class='home-about-lead'>Metināšanas inženieris (IWE) ar pasniegšanas pieredzi</p><p class='home-about-p'>Kvalifikācija TIG, MAG un MMA metināšanas procesos; praktiskās prasmes autogēnā griešanā, lodēšanā un termiskajā iztaisnošanā.</p><p class='home-about-p'>Pieredze metāla konstrukciju metināšanas un montāžas tehnoloģijās ar minimālām termiskām deformācijām un metināšanas procesu optimizāciju.</p><p class='home-about-p home-about-p--gap-lg'>Eksperta atbalsts aizsarggāzu maisījumu izvēlē MAG, MIG un TIG metināšanai, lai paaugstinātu kvalitāti un procesa stabilitāti.</p><p class='home-about-p home-about-p--gap-lg'>Grāmatas par MAG/MIG metināšanu autors.</p>
```

**Fallback HTML — образование:**

```html
<p>Bakalaura un maģistra grāds RTU (Rīgas Tehniskā universitāte).</p>
```

**Fallback HTML — квалификации:**

```html
<p>Sertifikācija MMA/MAG un TIG. Metināšanas instruktora kvalifikācija.</p>
```

---

Этого набора достаточно, чтобы воспроизвести или согласовать макет «About me» с текущей реализацией фронтенда; раздел 12 дублирует все пользовательские строки страницы по состоянию файлов переводов.
