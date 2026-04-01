# Раздел «About Me» (страница `/about`)

Документ описывает **фактическую** вёрстку и тексты страницы по состоянию кода: `frontend/app/[locale]/about/page.tsx`, компонент дипломов `frontend/components/DiplomaCertificates.tsx`, стили `frontend/app/globals.css`, оболочка `frontend/components/Layout.tsx`, шрифт в `frontend/app/layout.tsx`.

---

## 1. Маршрут, обёртка и SEO

| Что | Значение |
|-----|----------|
| **URL** | `/[locale]/about` — например `/en/about`, `/ru/about`, `/lv/about`. |
| **Корневой layout** | `body`: `antialiased bg-background text-foreground min-h-screen`, шрифт **Inter** (Google Fonts), подмножества **latin** и **cyrillic**. |
| **Макет сайта** | `Layout`: колонка на всю высоту (`flex min-h-screen flex-col`), шапка, `main flex-1`, подвал. Фон страницы такой же, как у всего приложения. |
| **`<title>` и meta description** | Пространство имён `seo`, ключи **`aboutTitle`** и **`aboutDescription`** (см. раздел 12). |

Отдельного фона только для `/about` нет.

---

## 2. Цвета и контейнер

| Элемент | Значение |
|--------|-----------|
| Фон | `--background: #0a0c0f` (`bg-background`) |
| Текст | `--foreground: #e6edf3` |
| Приглушённый текст в блоках | `text-foreground/80`, у карточек дипломов описание — `text-foreground/70` |
| Заголовок **H1** страницы | `text-accent-orange` (`--accent-orange: #f97316`) |
| Заголовок блока дипломов (**H2**) | `text-foreground` (не оранжевый) |
| Рамки портрета и галереи | `border-border` (`--border: #30363d`) |
| Карточки дипломов | класс `card`: фон `var(--surface)`, рамка `var(--border)`, hover — акцент оранжевый |

**Контент страницы** обёрнут в `div.container-wide.section`:

- **`container-wide`:** `max-width: var(--container-max)` = **72rem** (`1152px` при 1rem=16px), по центру.
- **`section`:** вертикальные отступы `padding-top/bottom: clamp(3rem, 8vw, 5rem)`, горизонтальные `clamp(1rem, 4vw, 1.5rem)`.

---

## 3. Порядок блоков сверху вниз (DOM)

1. **`<h1 class="heading-2 mb-6 text-accent-orange">`** — заголовок страницы (ключ `about.title`).
2. **Сетка из двух колонок** (`grid w-full items-start gap-8 md:grid-cols-2 md:gap-12`):
   - **Слева на `md+`:** блок портрета (на узком экране — на всю ширину, первым в потоке).
   - **Справа:** текстовая колонка `space-y-6`:
     - **Биография** — `<section>` **без** собственного подзаголовка: если HTML поля биографии содержит видимый текст, выводится только `div.about-content` с `dangerouslySetInnerHTML`.
     - **Образование** — если есть видимый текст: `<h2 class="about-block-title heading-3 …">` + HTML контента.
     - **Профессиональные квалификации** — аналогично образованию.
3. **`<section class="mt-16">`** — подзаголовок `h2.heading-2` «Дипломы…» + компонент **`DiplomaCertificates`**.
4. **`div` с `mt-16`** — сетка из **четырёх** рабочих фотографий (`grid-cols-2 sm:grid-cols-3 md:grid-cols-4`).

На узком экране колонки складываются: сначала фото, затем текст.

**Важно:** на странице **нет** блока «Почему выбирают меня», отдельной секции «Биография» с H2, списка «Достижения» — это относится к главной или к устаревшим макетам, не к текущему `about/page.tsx`.

---

## 4. Типографика

- **`heading-2`:** используется для H1 и для заголовка блока дипломов; для H1 дополнительно задаётся оранжевый цвет.
- **`heading-3` + `.about-block-title`:** подзаголовки «Образование» и «Профессиональные квалификации»; в `globals.css` для комбинации уменьшен кегль и `font-weight: 400`.
- **`.about-content`:** основной текст HTML-блоков; кегль и межстрочный интервал задаются в `globals.css`; внутри поддерживаются классы **`home-about-p`** и **`home-about-p--gap-lg`** (отступы между абзацами).

---

## 5. Портрет

- Обёртка: `relative mx-auto aspect-[4/5] w-full max-w-[26.88rem] overflow-hidden rounded-lg border border-border md:mx-0`.
- **Next/Image** `fill`, `object-cover object-top`, `priority`, `sizes="(max-width: 768px) 100vw, 26.88rem"`.
- **`src`:** поле `photo` ответа **`getAbout(lang)`** (Django API), иначе **`/images/photos/small/author01_small.jpg`**.
- Для URL, начинающихся с `http`, включён **`unoptimized`**.

---

## 6. Дипломы и сертификаты (`DiplomaCertificates`)

- Сетка карточек: **`grid grid-cols-5 gap-2`** с адаптивными зазорами (`min-[480px]:gap-3 sm:gap-4`) — **пять колонок** на широкой вёрстке.
- У каждой карточки: превью **`aspect-[4/3]`**, заголовок `h3`, краткий текст, кнопка **`btn-primary`** (открыть просмотр).
- Если у позиции нет растрового превью (например PDF без `preview`), показывается плейсхолдер с иконкой документа и подписью «PDF».
- **Модальное окно** `<dialog class="diploma-dialog">`: заголовок документа, ссылка «в новой вкладке», кнопка «Закрыть»; для **JPEG/PNG/WebP/GIF** показывается `<img>`, иначе — **`<iframe>`** с PDF (`#view=FitH`).

Список документов зашит в `page.tsx` (порядок отображения):

| id (ключ) | Файл | Папка |
|-----------|------|--------|
| `bachelor` | `IMG_bakalv_165628.jpg` | `public/images/photos/small/` |
| `master` | `magist1.jpg` | `public/images/photos/small/` |
| `iwe` | `IWE_diploms.pdf` | `public/diplomas/` |
| `mma_mag` | `MMA_dipl.jpg` | `public/images/photos/small/` |
| `tig` | `BUTS1_dipl.jpg` | `public/images/photos/small/` |

Публичные пути: `/images/photos/small/…` и `/diplomas/…`.

---

## 7. Галерея рабочих фото

Файлы в **`public/images/photos/small/`**:

- `FB_IMG_gas.jpg`
- `IMG_20250714_MAG.jpg`
- `mag_weld2.jpg`
- `tig_weld.jpg`

Ячейки: `aspect-square`, `rounded-lg`, `border`, `object-cover`, `alt` из ключа **`about.workPhotoAlt`**.

---

## 8. Источники контента

| Данные | Источник |
|--------|----------|
| Заголовок H1, подписи секций, тексты карточек дипломов, кнопки модалки, alt портрета и галереи | `next-intl`, namespace **`about`** в `frontend/messages/{en,ru,lv}.json` |
| **Биография, образование, квалификации, URL фото** | REST API **`getAbout(lang)`**; при ошибке биография берётся из **`fallbackBio`**, образование и квалификации — из **`fallbackEducation`** / **`fallbackQualifications`** (сейчас в переводах это **пустые строки**, поэтому без API эти два блока **не показываются**) |
| Meta title / description | **seo.**`aboutTitle`, **seo.**`aboutDescription` |

Функция **`htmlHasVisibleText`** отбрасывает блок, если после удаления тегов не осталось видимого текста.

---

## 9. Схема для вёрстки

```
[ H1 страницы (оранжевый) ]
[ Grid 2 колонки на md+ ]
  [ Портрет 4:5, max-width ~26.88rem | Биография (без H2) + Образование (H2) + Квалификации (H2) ]
[ H2 Дипломы + сетка карточек 5 колонок + dialog ]
[ Сетка 4 фото 2/3/4 колонки, квадраты ]
```

---

## 10. Метаданные страницы (SEO) по языкам

| Локаль | `aboutTitle` | `aboutDescription` |
|--------|----------------|-------------------|
| **en** | About Oleg Suvorov \| Welding Engineer | Biography, education and professional qualifications of welding engineer Oleg Suvorov. MMA/MAG, TIG certifications. |
| **ru** | Обо мне \| Олег Суворов — инженер по сварке | Биография, образование и квалификации инженера по сварке Олега Суворова. Сертификаты MMA/MAG, TIG. |
| **lv** | Par mani \| Olegs Suvorovs — metināšanas inženieris | Biogrāfija, izglītība un kvalifikācijas metināšanas inženiera Oļega Suvorova. MMA/MAG, TIG sertifikāti. |

---

## 11. Все короткие строки интерфейса (`about.*`)

Значения одинаковы по смыслу на трёх языках; ниже для каждого языка полный набор.

### English (`/en/about`)

| Ключ / место | Текст |
|--------------|--------|
| `title` (H1) | About Me |
| `photoAlt` | Oleg Suvorov, welding engineer |
| `workPhotoAlt` | Work photo |
| `education` (H2) | Education |
| `qualifications` (H2) | Professional Qualifications |
| `diplomas` (H2) | Diplomas & Certifications |
| `bachelor` | Bachelor's degree |
| `master` | Master's degree (RTU) |
| `iwe` | International Welding Engineer (IWE) certificate |
| `mma_mag` | MMA/MAG Welding |
| `tig` | TIG Welding |
| `bachelorSummary` | Higher education: bachelor’s degree from RTU. |
| `masterSummary` | RTU master’s degree — advanced engineering preparation. |
| `iweSummary` | International welding engineer qualification under the IIW/EWF programme. |
| `mma_magSummary` | Qualification in manual metal arc and semi-automatic welding (MMA/MAG). |
| `tigSummary` | Certification in TIG / GTAW welding. |
| `diplomaOpenInModal` | View |
| `diplomaOpenNewTab` | Open in new tab |
| `diplomaCloseModal` | Close |
| `diplomaPdfViewerTitle` | PDF document viewer |
| `diplomaPreviewAlt` | Preview of document “{title}” |

### Russian (`/ru/about`)

| Ключ / место | Текст |
|--------------|--------|
| `title` (H1) | Обо мне |
| `photoAlt` | Олег Суворов, инженер по сварке |
| `workPhotoAlt` | Фото с работы |
| `education` (H2) | Образование |
| `qualifications` (H2) | Профессиональные квалификации |
| `diplomas` (H2) | Дипломы и сертификаты |
| `bachelor` | Бакалавр |
| `master` | Магистр (РТУ) |
| `iwe` | Сертификат международного инженера по сварке (IWE) |
| `mma_mag` | Сварка MMA/MAG |
| `tig` | Сварка TIG |
| `bachelorSummary` | Высшее техническое образование: бакалавриат РТУ. |
| `masterSummary` | Магистр РТУ — углублённая инженерная подготовка. |
| `iweSummary` | Международная квалификация инженера по сварке в рамках программы IIW/EWF. |
| `mma_magSummary` | Квалификация по ручной дуговой и полуавтоматической сварке (MMA/MAG). |
| `tigSummary` | Сертификация по аргонодуговой сварке (TIG/GTAW). |
| `diplomaOpenInModal` | Просмотреть |
| `diplomaOpenNewTab` | В новой вкладке |
| `diplomaCloseModal` | Закрыть |
| `diplomaPdfViewerTitle` | Просмотр PDF-документа |
| `diplomaPreviewAlt` | Превью документа «{title}» |

### Latvian (`/lv/about`)

| Ключ / место | Текст |
|--------------|--------|
| `title` (H1) | Par mani |
| `photoAlt` | Olegs Suvorovs, metināšanas inženieris |
| `workPhotoAlt` | Fotogrāfija no darba |
| `education` (H2) | Izglītība |
| `qualifications` (H2) | Profesionālās kvalifikācijas |
| `diplomas` (H2) | Diplomi un sertifikāti |
| `bachelor` | Bakalaura grāds |
| `master` | Maģistra grāds (RTU) |
| `iwe` | Starptautiskā metināšanas inženiera (IWE) sertifikāts |
| `mma_mag` | MMA/MAG metināšana |
| `tig` | TIG metināšana |
| `bachelorSummary` | Augstākā izglītība: bakalaura grāds RTU. |
| `masterSummary` | RTU maģistra grāds — padziļināta inženieru sagatavošana. |
| `iweSummary` | Starptautiska metināšanas inženiera kvalifikācija IIW/EWF programmas ietvaros. |
| `mma_magSummary` | Kvalifikācija manuālajā loka un pusautomātiskajā metināšanā (MMA/MAG). |
| `tigSummary` | Sertifikācija TIG / GTAW metināšanā. |
| `diplomaOpenInModal` | Skatīt |
| `diplomaOpenNewTab` | Jaunā cilnē |
| `diplomaCloseModal` | Aizvērt |
| `diplomaPdfViewerTitle` | PDF dokumenta skatītājs |
| `diplomaPreviewAlt` | Priekšskatījums dokumentam «{title}» |

---

## 12. Развёрнутый текст биографии при отсутствии данных API (`fallbackBio`)

На сайте HTML хранится в JSON; на странице он вставляется как есть. Ниже — **чистый текст** по абзацам (удобно для вычитки).

### English

1. I am a Welding Engineer (IWE) with hands-on production experience and teaching background. My journey in welding began in 2011 after completing training in MMA and MAG processes at the 3rd Riga Vocational School.
2. Over the years as a welder, I gained experience in various production companies, from repair welding work to manufacturing rebar frameworks and metal structures. This provided me with a deep understanding of a welder's work in real conditions and the difference between theory and practice.
3. For nearly three years, I taught materials science, welding technology, and practical welding classes at a training center in Riga, focusing on skills directly applicable in the workplace.
4. Currently, I work as a Welding Engineer in an international company specializing in gas production and sales. In this role, I collaborate with managers, advise on the selection of shielding and combustible gases, conduct testing, participate in welding technology adjustments, and optimize process quality and stability.
5. I am the author of a book on MAG/MIG welding. I hold a Bachelor's and Master's degree in Engineering (Instrumentation) from Riga Technical University. I have completed additional training: a Welding Coordination course according to DVS-IIW 1170 — International Welding Engineer (IWE), International Welding Engineer (IWE).

**Исходный фрагмент в репозитории** (`frontend/messages/en.json`, ключ `fallbackBio`): HTML с классами `home-about-p` и `home-about-p--gap-lg` на последнем абзаце.

### Russian

1. Я инженер по сварке (IWE) с практическим опытом работы на производстве и преподавательской деятельностью. Мой путь в сварке начался в 2011 году после обучения процессам MMA и MAG в 3-й рижской ремесленной школе.
2. За годы работы сварщиком я приобрёл опыт в различных производственных компаниях, начиная с ремонтных работ по сварке и заканчивая изготовлением арматурных каркасов и металлоконструкций. Это дало глубокое понимание работы сварщика в реальных условиях и разницы между теорией и практикой.
3. В течение почти трёх лет я преподавал материаловедение, технологию и проводил практические занятия по сварке в учебном центре Риги, делая упор на навыки, которые напрямую применимы в работе.
4. Сейчас я работаю инженером по сварке в международной компании, которая занимается производством и продажей газов. В ходе работы я, совместно с менеджерами, участвую в переговорах, консультирую по выбору защитных и горючих газов, провожу тесты, участвую в коррекции технологий сварки, оптимизирую качество и стабильность процессов.
5. Я автор книги по сварке MAG/MIG, у меня степень бакалавра и магистра инженерных наук по специальности «Приборостроение», окончил Рижский технический университет. Я прошёл дополнительное обучение: курс подготовки координаторов сварки в соответствии с DVS-IIW 1170 — «Международный инженер по сварке (IWE)», International Welding Engineer (IWE).

### Latvian

1. Es esmu metināšanas inženieris (IWE) ar praktisku pieredzi ražošanā un pedagoģisko darbu. Mana ceļš metināšanā sākās 2011. gadā pēc apmācības MMA un MAG procesos 3. Rīgas arodskolā.
2. Gadu gaitā, strādājot par metinātāju, esmu ieguvis pieredzi dažādās ražošanas uzņēmumos, sākot no remonta metināšanas darbiem līdz armatūras karkasu un metāla konstrukciju izgatavošanai. Tas sniedza man dziļu izpratni par metinātāja darbu reālos apstākļos un atšķirību starp teoriju un praksi.
3. Gandrīz trīs gadus esmu pasniedzis materiālzinības, tehnoloģiju un vadījis praktiskās metināšanas nodarbības Rīgas mācību centrā, uzsverot prasmes, kas tieši pielietojamas darbā.
4. Pašlaik strādāju par metināšanas inženieri starptautiskā uzņēmumā, kas nodarbojas ar gāzu ražošanu un tirdzniecību. Šajā darbā es sadarbojos ar vadītājiem, sniedzu konsultācijas par aizsarg- un degošo gāzu izvēli, veicu testus, piedalos metināšanas tehnoloģiju korekcijā, optimizēju kvalitāti un procesa stabilitāti.
5. Esmu grāmatas par MAG/MIG metināšanu autors.
6. Man ir bakalaura un maģistra grāds inženierzinātnēs specialitātē «Ierīču būve», pabeidzu Rīgas Tehnisko universitāti. Esmu izgājis papildapmācību: metināšanas koordinatora sagatavošanas kurss saskaņā ar DVS-IIW 1170 — «Starptautiskais metināšanas inženieris (IWE)», International Welding Engineer (IWE).

---

## 13. Пустые fallback для образования и квалификаций

В `frontend/messages/en.json`, `ru.json`, `lv.json` ключи **`fallbackEducation`** и **`fallbackQualifications`** заданы как пустые строки. Поэтому при недоступности API **секции «Образование» и «Профессиональные квалификации» не рендерятся**. Если API возвращает HTML для этих полей, на странице появятся соответствующие блоки с текстом с бэкенда.

---

*Документ синхронизирован с реализацией страницы About и файлами переводов; при изменении `page.tsx` или `messages/*.json` имеет смысл обновить этот файл.*
