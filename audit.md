# План исправлений после Typography / Design System / UI Consistency Audit

Цель: постепенно привести frontend к более устойчивой дизайн-системе, не ломая текущую логику, маршруты, API, CMS-миграцию и существующие тексты.

## Главные принципы

- Не менять backend, API-контракты и структуру данных без отдельной причины.
- Не менять маршруты, информационную архитектуру и CMS-логику.
- Не расширять `frontend/messages/*.json` ради дизайн-правок.
- Делать изменения маленькими этапами: один тип UI-проблемы за раз.
- Не переписывать страницы целиком, если достаточно заменить классы или вынести маленький компонент.
- Перед каждой реализацией читать только файлы, относящиеся к текущему этапу.
- После каждого этапа проверять только затронутую область, затем запускать общую проверку frontend.

## Обнаруженные проблемы

- Типографика задана в `frontend/app/globals.css`, но нет полного масштаба: отсутствует `heading-4`, нет отдельных классов для `eyebrow`, `lead`, `caption`, `muted`.
- На `/about` главный заголовок использует `heading-2`, тогда как остальные страницы в основном используют `heading-1`.
- Secondary text не унифицирован: встречаются `text-foreground/50`, `/55`, `/60`, `/65`, `/70`, `/75`, `/78`, `/80`, `/85`, `/90`.
- Есть hardcoded цвета и размеры: например blog pagination, `WhyChooseCard`, hero decoration, SVG-инфографика.
- Карточки используют несколько параллельных паттернов: `.card`, `rounded-xl`, `rounded-2xl`, прозрачные фоны и локальные hover-стили.
- Формы расходятся: калькуляторы используют `.input-industrial`, а `ContactForm` дублирует похожие стили inline-классами.
- Есть несколько типов CTA: `btn-primary`, `btn-secondary`, link CTA и pill CTA без формальной иерархии.
- `Section` существует, но используется не на всех страницах; часть страниц вручную повторяет `container-* section`.
- H4-семантика фактически заменена `text-sm font-semibold uppercase tracking-wide`.

## Этап 1. Зафиксировать минимальные дизайн-токены

Файл:

- `frontend/app/globals.css`

Что сделать:

- Добавить или формализовать семантические классы:
  - `.heading-4`
  - `.eyebrow`
  - `.lead`
  - `.text-muted`
  - `.caption`
- Использовать уже существующие CSS-переменные, не вводить новую палитру.
- Подключить `--foreground-muted` и `--text-small`, если они реально нужны в этих классах.
- Не менять визуальный стиль радикально: новые классы должны отражать текущий дизайн.

Что не делать:

- Не менять все страницы в этом же этапе.
- Не добавлять Tailwind config, если текущий Tailwind v4 через `@theme inline` достаточно покрывает задачу.
- Не менять font family.

Проверка:

```powershell
Set-Location "D:\Work_Cursor\PersonalHomePage\frontend"
npm run lint
```

## Этап 2. Исправить самые заметные типографические расхождения

Файлы читать только по необходимости:

- `frontend/app/[locale]/about/page.tsx`
- `frontend/app/[locale]/blog/[slug]/page.tsx`
- `frontend/app/[locale]/knowledge/page.tsx`
- `frontend/app/[locale]/contact/page.tsx`
- `frontend/app/[locale]/book/page.tsx`

Что сделать:

- Привести H1 на `/about` к общему паттерну, если визуально это не ломает страницу.
- Решить правило для цвета H1:
  - page-list / landing pages: `text-accent-orange`;
  - article detail может оставаться `text-foreground`, если это осознанный editorial-паттерн.
- Унифицировать intro/lead-текст страниц: выбрать один основной паттерн для page hero.
- Заменять только явные расхождения, не перетряхивать всю страницу.

Что не делать:

- Не менять содержимое текстов.
- Не менять порядок секций.
- Не менять CMS fallback-логику.

Проверка:

```powershell
Set-Location "D:\Work_Cursor\PersonalHomePage\frontend"
npm run lint
```

## Этап 3. Упорядочить muted text и labels

**Статус:** выполнено. Второстепенный текст в страницах и общих компонентах приведён к ограниченной шкале `text-foreground/80`, `text-foreground/60`, `text-foreground/50`; нестандартные `/78`, `/75`, `/70`, `/65`, `/55`, `/45` заменены там, где они были muted/caption/label. `.caption` и `.eyebrow` применены точечно, без массовой смены цветовых акцентов.

Файлы:

- страницы в `frontend/app/[locale]/`
- общие компоненты в `frontend/components/`

Что сделать:

- Свести второстепенный текст к ограниченной шкале:
  - обычный текст: `text-foreground/80` или новый `.text-muted`;
  - meta/caption: `text-foreground/60` или `.caption`;
  - disabled/very low emphasis: `text-foreground/50`.
- Заменить нестандартные значения вроде `text-foreground/78`, если они не имеют явной причины.
- Формализовать eyebrow-паттерн через `.eyebrow`, где это не меняет смысл.

Что не делать:

- Не менять цветовые акценты страниц массово.
- Не трогать SVG-инфографику калькуляторов на этом этапе.

Проверка:

```powershell
Set-Location "D:\Work_Cursor\PersonalHomePage\frontend"
npm run lint
```

## Этап 4. Унифицировать формы

Файлы:

- `frontend/components/ContactForm.tsx`
- `frontend/components/calculators/CalculatorField.tsx`
- `frontend/components/calculators/*Calculator.tsx`

Что сделать:

- Перевести поля `ContactForm` на `.input-industrial`, если внешний вид остаётся приемлемым.
- Согласовать label/hint паттерн между контактной формой и калькуляторами.
- При необходимости сделать маленький общий компонент поля только после проверки, что он реально уменьшает дублирование.

Что не делать:

- Не менять `mailto:`-логику формы.
- Не менять расчётные формулы калькуляторов.
- Не менять API или submit-flow.

Проверка:

```powershell
Set-Location "D:\Work_Cursor\PersonalHomePage\frontend"
npm run lint
```

## Этап 5. Упорядочить кнопки и CTA

**Статус:** выполнено. В `globals.css` зафиксирована иерархия CTA (primary / secondary / link-accent / pill) и модификаторы размеров `.btn-lg`, `.btn-sm`, `.btn-pill-sm`; локальные `px-*` / `py-*` / `text-*` overrides убраны в Hero, decision-system pills, DiplomaCertificates и ExperienceCaseAccordion. Book page и EngineerIdentityStrip уже использовали базовые классы без лишних overrides.

Файлы читать точечно:

- `frontend/components/Hero.tsx`
- `frontend/app/[locale]/page.tsx`
- `frontend/app/[locale]/book/page.tsx`
- `frontend/components/EngineerIdentityStrip.tsx`
- `frontend/components/DiplomaCertificates.tsx`
- `frontend/components/ExperienceCaseAccordion.tsx`

Что сделать:

- Описать и применить минимальную иерархию:
  - primary action: `.btn-primary`;
  - secondary action: `.btn-secondary`;
  - text/link action: `.link-accent`;
  - pill action: отдельный класс только если он повторяется.
- Уменьшить локальные overrides `px-* py-* text-*` у кнопок там, где они не нужны.
- Не стремиться сделать все кнопки одинаковыми по размеру: hero, modal и compact actions могут иметь разные размеры.

Что не делать:

- Не менять ссылки и маршруты.
- Не менять текст CTA.

Проверка:

```powershell
Set-Location "D:\Work_Cursor\PersonalHomePage\frontend"
npm run lint
```

## Этап 6. Упорядочить карточки

**Статус:** выполнено. В `globals.css` зафиксированы variants: `.card`, `.card-compact`/`.card-comfortable`, `.card-interactive`, `.card-nav`, `.card-highlight`, `.card-highlight-soft`, `.card-cta`, `.card-cta-blue`, `.card-subtle`, `.card-accent`, `.card-nested`, `.card-stat`, `.card-expanded`. Inline `rounded-xl`/`rounded-2xl` заменены на variants в home, expertise, contact, tools, experience, solutions. `WhyChooseCard` удалён как неиспользуемый код. Специальные блоки (timeline experience, hero photo panel) сохранены без изменений.

Файлы читать точечно:

- `frontend/components/CompetencyCard.tsx`
- `frontend/components/ToolCardLink.tsx`
- `frontend/components/ExperienceCaseAccordion.tsx`
- `frontend/components/WhyChooseCard.tsx`
- страницы, где есть inline `rounded-xl` / `rounded-2xl` card-like блоки

Что сделать:

- Составить короткую карту card variants:
  - default card;
  - highlight card;
  - CTA card;
  - compact card.
- Заменить hardcoded дубли `.card`, где это безопасно.
- Решить судьбу `WhyChooseCard`: удалить как мёртвый код, если он действительно не используется, или привести к общему card-паттерну.
- Сохранить специальные карточки, где они несут смысл: hero panels, timeline, CTA-блоки.

Что не делать:

- Не менять data mapping карточек.
- Не менять изображения и порядок элементов.
- Не убирать hover-эффекты без визуальной проверки.

Проверка:

```powershell
Set-Location "D:\Work_Cursor\PersonalHomePage\frontend"
npm run lint
```

## Этап 7. Убрать явные hardcoded-дубли токенов

**Статус:** выполнено. В `globals.css` добавлены `--accent-orange-soft` и `--surface-deep`; пагинация блога и декор Hero переведены на токены; `BookSpreadPreview` и SVG калькуляторов без изменений (специальные цвета). `WhyChooseCard` уже удалён на этапе 6.

Файлы:

- `frontend/app/[locale]/blog/page.tsx`
- `frontend/components/Hero.tsx`
- `frontend/components/WhyChooseCard.tsx`
- `frontend/components/BookSpreadPreview.tsx`
- `frontend/components/DiplomaCertificates.tsx`
- `frontend/components/calculators/CalculatorStaticExample.tsx`

Что сделать:

- В первую очередь заменить hardcoded значения, которые дублируют уже существующие токены:
  - `#30363d` → `border-border`;
  - `#161b22` → `bg-surface`;
  - `#e6edf3` → `text-foreground`;
  - `#f97316` → `text-accent-orange` / `bg-accent-orange`.
- Оставить специальные цвета, если они имитируют отдельный объект, например бумагу в `BookSpreadPreview`.
- Для hero accent `#fdba74` принять отдельное решение: оставить как contrast-special или вынести в CSS-переменную.

Что не делать:

- Не заменять специальные SVG/diagram colors механически.
- Не менять визуальную семантику акцентных блоков.

Проверка:

```powershell
Set-Location "D:\Work_Cursor\PersonalHomePage\frontend"
npm run lint
```

## Этап 8. Расширить применение `Section`

**Статус:** выполнено. В `Section.tsx` добавлены `container` (`wide` | `narrow`) и `as` (`section` | `article` | `div`); standalone-страницы переведены на `Section` с `bordered={false}` и `scrollMargin={false}`; главная и `/tools` без изменений.

Файлы:

- `frontend/components/Section.tsx`
- страницы в `frontend/app/[locale]/`

Что сделать:

- Решить, нужны ли два шаблона:
  - wide page section;
  - narrow page section.
- Перевести страницы на `Section` только там, где это уменьшает дублирование и не меняет layout.
- Для страниц с уникальной структурой оставить ручную разметку.

Что не делать:

- Не менять ширину контейнера страницы без визуальной проверки.
- Не менять порядок секций.

Проверка:

```powershell
Set-Location "D:\Work_Cursor\PersonalHomePage\frontend"
npm run lint
npm run build
```

## Финальная проверка

После завершения всех этапов:

```powershell
Set-Location "D:\Work_Cursor\PersonalHomePage\frontend"
npm run lint
npm run build
```

Если затрагивались страницы, которые получают данные из Django:

```powershell
Set-Location "D:\Work_Cursor\PersonalHomePage\backend"
.\.venv\Scripts\python.exe manage.py check
```

## Экономия токенов при реализации

- Не читать весь проект заново.
- Перед этапом читать только файлы, перечисленные в этом этапе.
- Не запускать широкие поиски, если уже известен конкретный файл.
- Не делать общий рефакторинг вместе с точечной правкой.
- Не трогать backend для чисто визуальных frontend-этапов.
- Не удалять legacy JSON и CMS fallback в рамках дизайн-аудита.
- Не менять тексты, переводы и seed-данные без отдельной задачи.
- После каждого этапа кратко фиксировать: что изменено, что проверено, какие риски остались.

## Definition of Done

План считается реализованным, если:

- H1/H2/H3/H4 и label/body/caption уровни описаны и применяются последовательно.
- `/about` больше не выбивается по размеру главного заголовка или это явно задокументировано как исключение.
- Secondary text использует ограниченную шкалу, а не произвольные opacity-значения.
- Формы используют единый input-паттерн.
- CTA и карточки имеют понятные variants.
- Hardcoded значения заменены там, где они дублировали токены.
- `npm run lint` и `npm run build` проходят.
- Существующие API, маршруты, CMS fallback и тексты не сломаны.
