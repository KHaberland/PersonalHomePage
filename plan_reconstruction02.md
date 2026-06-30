# План реконструкции PersonalHomePage v2.2 Decision System

Цель: перестроить смысловую архитектуру сайта так, чтобы он воспринимался не как набор независимых разделов, а как единая инженерная система принятия решений.

Master Concept:

> Engineering Decision System: Problem -> Analysis -> Solution Pattern -> Real-world Validation -> Knowledge -> Tools

Главный результат:

- было: 7 равноправных смысловых систем;
- стало: 3 смысловых слоя;
- маршруты сохраняются;
- SEO-структура не ломается;
- текущая визуальная система не переписывается;
- дубли между `solutions`, `experience`, `knowledge`, `tools`, `blog`, `book` устраняются смысловыми правилами.

North Star Rule:

> One meaning = one layer of the system.

## 0. Правила Экономии Токенов При Реализации

Этот план реализовывать короткими пакетами. Не открывать весь проект и не переписывать страницы целиком, если задача касается только смыслового слоя, переводов или одной UX-структуры.

### 0.1. Минимальный Контекст На Итерацию

Перед каждой итерацией читать только:

- `structure.md` — фактическая карта проекта;
- `plan_reconstruction01.md` — предыдущие ограничения v2.1;
- `plan_reconstruction02.md` — этот план;
- 1-3 файла, которые реально меняются.

Не перечитывать:

- все страницы App Router;
- все переводы;
- весь backend;
- все компоненты.

Исключение: если изменение затрагивает общий контракт данных или общую навигацию.

### 0.2. Малые Пакеты Работы

Работать этапами:

1. P0: зафиксировать доменную модель и IA mapping.
2. P0: обновить Header/Footer/Home microcopy.
3. P0: разделить роли `solutions` и `experience`.
4. P1: разделить `knowledge`, `blog`, `book`.
5. P1: очистить `tools` как Validation Layer.
6. P1: обновить внутренние ссылки и CTA.
7. P2: обновить SEO metadata и sitemap без удаления маршрутов.
8. P2: провести acceptance-проверки.

Каждый пакет должен:

- менять минимальное число файлов;
- не менять routing без отдельного решения;
- синхронизировать `en`, `ru`, `lv`;
- использовать существующие компоненты;
- после правок проверять измененные файлы через `ReadLints`;
- запускать `npm run lint` только после существенного frontend-пакета;
- обновлять `structure.md` только если реально изменилась фактическая структура.

### 0.3. Локализация

Все новые тексты сразу вносить в:

- `frontend/messages/en.json`;
- `frontend/messages/ru.json`;
- `frontend/messages/lv.json`.

Предпочитать существующие namespaces:

- `home`;
- `solutionsPage`;
- `experience`;
- `expertise`;
- `knowledge`;
- `tools`;
- `book`;
- `blog`;
- `footer`;
- `header` или существующий namespace навигации, если он уже используется.

Не создавать новые namespaces только ради одного текста. Если нужен общий термин для трех слоев, добавить компактный namespace вроде `decisionSystem` только после проверки текущих переводов.

### 0.4. UI И CSS

Не создавать новую дизайн-систему.

Использовать существующие:

- `Hero`;
- `Section`;
- `Header`;
- `Footer`;
- `ExperienceCaseAccordion`;
- `ToolCardLink`;
- `ContactForm`;
- глобальные классы `card`, `btn-primary`, `btn-secondary`, `heading-*`.

Не переписывать `globals.css`, если задача решается текстом, группировкой или небольшим layout-изменением.

### 0.5. Правило Для Токенов При Контентной Чистке

Для устранения дублей не сравнивать весь контент вручную за один проход.

Работать по матрице:

- сначала список сущностей и ролей разделов;
- затем 3-5 подозрительных дублей;
- затем точечная правка страниц;
- затем acceptance-проверка.

Если нужно искать дубли, использовать точечные запросы по словам:

- `porosity`;
- `defect`;
- `gas`;
- `WPS`;
- `training`;
- `case`;
- `impact`;
- `причина`;
- `результат`.

## 1. Новая Смысловая Архитектура

Сайт больше не проектируется как набор разделов:

- `solutions`;
- `experience`;
- `expertise`;
- `knowledge`;
- `tools`;
- `blog`;
- `book`.

Вместо этого вводятся 3 слоя.

### 1.1. Decision Layer

Содержит:

- `/solutions`;
- `/expertise`.

Назначение:

- инженерное мышление;
- подходы;
- методы анализа;
- паттерны решения типовых проблем;
- карта компетенций.

Тип контента:

- problem class;
- generalized cause;
- engineering approach;
- method;
- decision model;
- capability.

Запрещено:

- реальные кейсы с производства;
- компании;
- даты;
- формулировки `я сделал`, `мы снизили`, `на предприятии`;
- конкретные измеримые результаты;
- storytelling.

### 1.2. Evidence Layer

Содержит:

- `/experience`;
- `/tools`.

Назначение:

- фактическое подтверждение инженерной работы;
- реальные случаи;
- расчеты;
- проверка параметров;
- измеримый или наблюдаемый эффект.

Тип контента:

- timeline;
- контекст работы;
- производственная ситуация;
- действие;
- результат;
- impact;
- deterministic calculator;
- parameter check.

Запрещено:

- общие объяснения `как должно быть`;
- учебные статьи;
- длинные инженерные модели;
- паттерны, которые должны жить в `solutions`;
- storytelling внутри `tools`.

### 1.3. Knowledge Layer

Содержит:

- `/knowledge`;
- `/blog`;
- `/book`.

Назначение:

- обучение;
- объяснение процессов;
- статьи;
- авторский материал;
- статический авторитетный артефакт.

Тип контента:

- structured explanation;
- article;
- process breakdown;
- author material;
- book landing;
- reference content.

Запрещено:

- реальные производственные кейсы как основной контент;
- validation metrics;
- calculator behavior;
- дублирование `solutions` в формате `problem -> cause -> solution`.

## 2. Совместимость С Уже Сделанным

Этот план не отменяет v2.1, а уточняет его смысловую архитектуру.

Сохраняется:

- личный бренд senior-инженера;
- B2B-консалтинг как главный коммерческий контекст;
- простая визуальная система;
- маршруты App Router;
- локали `en`, `ru`, `lv`;
- текущие компоненты;
- основной CTA `Request consultation`;
- SEO-стабильность.

Меняется:

- логика группировки разделов;
- microcopy в Header/Home/Hero;
- роль `solutions`;
- роль `experience`;
- роль `tools`;
- разделение `knowledge`, `blog`, `book`;
- внутренняя перелинковка между слоями.

Не делать:

- удаление route files;
- миграцию `/blog` в `/knowledge`;
- физическое удаление `/book`;
- массовую замену компонентов;
- redesign;
- переписывание backend-моделей без отдельной причины.

## 3. Финальная Доменная Модель

Целевая схема:

```text
Engineering Decision System
├── Decision Layer
│   ├── /solutions  -> solution patterns
│   └── /expertise  -> engineering capabilities
├── Evidence Layer
│   ├── /experience -> real cases and timeline
│   └── /tools      -> deterministic calculators
└── Knowledge Layer
    ├── /knowledge  -> structured explanations
    ├── /blog       -> chronological publications
    └── /book       -> static authority artifact
```

Главная цепочка восприятия:

```text
Problem -> Analysis -> Solution Pattern -> Real-world Validation -> Knowledge -> Tools
```

Простое объяснение для пользователя:

- `Solutions` — как решаются типовые инженерные проблемы.
- `Expertise` — за счет каких компетенций это возможно.
- `Experience` — где это подтверждено практикой.
- `Tools` — как проверить параметры расчетом.
- `Knowledge` — где понять процессы.
- `Blog` — где читать публикации.
- `Book` — где увидеть авторский артефакт.

## 4. IA И Navigation Groups

Маршруты не удаляются.

Логическая группировка обязательна:

```text
Engineering Reasoning
├── solutions
└── expertise

Engineering Proof
├── experience
└── tools

Knowledge System
├── knowledge
├── blog
└── book
```

### 4.1. Header

Файл:

- `frontend/components/Header.tsx`.

Цель:

- показать сайт как систему, но не перегрузить меню.

Безопасный вариант для P0:

- оставить текущие основные ссылки;
- добавить короткий subtitle/microcopy рядом с брендом или под mobile menu:
  - `Engineering Decision System`;
  - `Reasoning -> Proof -> Knowledge`.

Если Header уже перегружен, не делать dropdown на P0. Группы можно отразить:

- в Footer;
- на Home;
- в отдельной секции `How this site is organized`;
- через aria/metadata или data-структуру навигации.

### 4.2. Footer

Файл:

- `frontend/components/Footer.tsx`.

Цель:

- дать полную смысловую карту без давления на primary navigation.

Footer может стать главным местом для 3 групп:

- `Engineering Reasoning`: `/solutions`, `/expertise`;
- `Engineering Proof`: `/experience`, `/tools`;
- `Knowledge System`: `/knowledge`, `/blog`, `/book`.

Важно:

- если `/blog` и `/book` сейчас намеренно скрыты из primary IA, не поднимать их в Header без отдельной проверки;
- Footer может содержать их как secondary links;
- sitemap менять осторожно, см. раздел 14.

### 4.3. Home

Файл:

- `frontend/app/[locale]/page.tsx`.

Home должен объяснить 3 слоя за 5 секунд.

Обязательная microcopy:

> Engineering Decision System: Reasoning -> Proof -> Knowledge

Возможный порядок:

1. Hero: кто специалист и что делает.
2. Decision System strip: 3 слоя.
3. Primary path: `Solutions`.
4. Proof path: `Experience`.
5. Support path: `Knowledge` / `Tools`.
6. Contact CTA.

Не превращать Home в каталог всех разделов. Нужна короткая ориентация, а не расширенная карта сайта.

## 5. Жесткое Разделение Solutions И Experience

Это главный риск текущей архитектуры.

### 5.1. `/solutions` = Patterns

Файл:

- `frontend/app/[locale]/solutions/page.tsx`.

Назначение:

- описывать, как решаются типовые инженерные проблемы.

Допустимый формат:

- problem class;
- generalized cause;
- engineering analysis;
- solution pattern;
- method;
- expected direction of improvement.

Примеры допустимых тем:

- `Причины пористости в MAG сварке`;
- `Как стабилизировать дугу при изменении защитного газа`;
- `Как подойти к снижению разброса качества между сменами`;
- `Как выбрать защитный газ под задачу`.

Запрещено:

- `я сделал`;
- `мы внедрили`;
- `на предприятии`;
- company names;
- dates;
- case timeline;
- measured result;
- `снизили дефекты на X%`.

UX-структура:

- текстовые паттерны;
- без компаний;
- без дат;
- без timeline;
- без case cards;
- без impact metrics.

### 5.2. `/experience` = Real Cases

Файл:

- `frontend/app/[locale]/experience/page.tsx`.

Назначение:

- показывать фактический опыт.

Допустимый формат:

- context;
- problem;
- action;
- result;
- company or role;
- period/date;
- production situation;
- measurable or observable impact.

Запрещено:

- большие общие объяснения;
- `как надо делать`;
- учебные модели;
- generalized solution pattern as primary content.

UX-структура:

- timeline;
- real cases;
- companies;
- dates;
- production events;
- impact.

Карточки `solutions` и `experience` не должны иметь одинаковую структуру.

### 5.3. No Duplication Rule

Один и тот же дефект не описывается одинаково в `solutions` и `experience`.

Допустимая связка:

- `solutions`: общий паттерн решения пористости.
- `experience`: конкретный случай, где в реальном контексте была проблема пористости и был результат.

Недопустимо:

- одинаковая формула `проблема -> причина -> решение -> результат` в обоих разделах;
- один и тот же кейс, переписанный как `solution`;
- один и тот же текст объяснения дефекта в `solutions` и `knowledge`.

## 6. Expertise

Файл:

- `frontend/app/[locale]/expertise/page.tsx`.

Слой:

- Decision Layer.

Роль:

- карта компетенций;
- почему специалист способен анализировать задачи;
- не кейсы;
- не proof;
- не education hub.

Допустимо:

- процессы;
- материалы;
- защитные газы;
- металлургия;
- безопасность;
- WPS/documentation capability.

Запрещено:

- реальные истории;
- результаты;
- timeline;
- `на проекте`;
- `мы сделали`.

Связи:

- из `expertise` можно вести в `solutions` как применение компетенции;
- из `expertise` можно вести в `experience` как подтверждение, но не переносить кейс внутрь.

## 7. Experience

Файл:

- `frontend/app/[locale]/experience/page.tsx`;
- `frontend/components/ExperienceCaseAccordion.tsx`.

Слой:

- Evidence Layer.

Роль:

- доказать реальный опыт;
- снять HR/client confusion;
- показать карьерную и производственную достоверность.

Содержание:

- timeline;
- компании;
- роли;
- даты;
- реальные производственные ситуации;
- action/result;
- Engineering Impact.

Изменения:

- убрать или сократить общие инженерные объяснения;
- оставить объяснение только настолько, насколько оно нужно для понимания кейса;
- не использовать структуру карточек из `solutions`;
- усилить поля `context`, `action`, `result`.

## 8. Knowledge, Blog, Book

Цель: исключить конкуренцию трех контентных сущностей.

### 8.1. `/knowledge`

Файл:

- `frontend/app/[locale]/knowledge/page.tsx`.

Роль:

- структурированное объяснение процессов.

Допустимо:

- process explanation;
- how welding defects form;
- technical background;
- structured guides;
- educational breakdown.

Запрещено:

- реальные кейсы как основной формат;
- production metrics;
- `мы сделали`;
- chronology;
- book sales page behavior.

### 8.2. `/blog`

Файлы:

- `frontend/app/[locale]/blog/page.tsx`;
- `frontend/app/[locale]/blog/[slug]/page.tsx`.

Роль:

- хронологические статьи и публикации.

Допустимо:

- dated posts;
- author commentary;
- updates;
- publication archive.

Запрещено:

- превращать blog в второй `knowledge`;
- превращать blog в второй `solutions`;
- использовать blog как primary IA, если это ломает текущую простоту.

Правило совместимости:

- route сохраняется;
- если `/blog` сейчас скрыт из Header, можно оставить скрытым в Header;
- в Footer или Knowledge System section можно показать как secondary content.

### 8.3. `/book`

Файл:

- `frontend/app/[locale]/book/page.tsx`.

Роль:

- статический авторитетный артефакт.

Допустимо:

- описание книги;
- авторская позиция;
- ссылка/CTA на книгу;
- связь с credibility.

Запрещено:

- делать book вторым blog;
- делать book вторым knowledge hub;
- делать book sales funnel, конкурирующий с consulting CTA.

Правило совместимости:

- route сохраняется;
- присутствие в Header не обязательно на P0;
- Footer/Knowledge System может содержать ссылку.

## 9. Tools

Файлы:

- `frontend/app/[locale]/tools/page.tsx`;
- `frontend/app/[locale]/tools/[slug]/page.tsx`;
- `frontend/components/calculators/*`;
- `frontend/lib/fallback-content.ts`, если там есть описания инструментов.

Слой:

- Evidence Layer.

Роль:

- расчет;
- проверка параметров;
- `what happens if`;
- deterministic validation.

Разрешено:

- input;
- output;
- formula context only when needed for use;
- constraints;
- warnings;
- units;
- result interpretation in 1-2 short lines.

Запрещено:

- storytelling;
- статьи;
- обучение;
- длинное объяснение процессов;
- продажа консультации внутри каждого инструмента;
- дублирование `knowledge`.

Validation rule:

> Tools must behave like deterministic calculators, not educational articles.

## 10. Внутренняя Перелинковка

Цель: показать систему принятия решений, не смешивая роли страниц.

Правильная цепочка:

```text
/solutions -> /experience -> /knowledge -> /tools -> /contact
```

Но каждая ссылка должна объяснять переход:

- из `solutions` в `experience`: `See real-world validation`;
- из `experience` в `solutions`: `View related solution patterns`;
- из `knowledge` в `solutions`: `Apply this as a solution pattern`;
- из `tools` в `contact`: `Request consultation if parameters are outside expected range`;
- из `expertise` в `solutions`: `See how this capability is applied`.

Нельзя:

- ссылаться из каждого блока на все разделы;
- делать одинаковые CTA везде;
- превращать каждую страницу в sitemap.

## 11. Контентная Матрица Для Устранения Дублей

Перед переписыванием текстов составить компактную матрицу.

Формат:

```text
Entity / Topic | Decision Layer | Evidence Layer | Knowledge Layer | Tools
Porosity       | pattern        | real case only  | explanation     | no / calc only
Gas selection  | method         | case impact     | background      | calculator
WPS            | approach       | implementation  | explanation     | no / helper only
Training       | method         | real delivery   | article         | no
```

Правило:

- если тема встречается в нескольких слоях, формат обязан быть разным;
- если формат одинаковый, это дубль;
- если один текст можно перенести без потери смысла из `solutions` в `experience`, значит он написан неправильно.

## 12. Пошаговый План Реализации

### Этап 1. Semantic Inventory

Цель:

- понять, где сейчас пересекаются смыслы.

Файлы:

- `frontend/app/[locale]/solutions/page.tsx`;
- `frontend/app/[locale]/experience/page.tsx`;
- `frontend/app/[locale]/knowledge/page.tsx`;
- `frontend/app/[locale]/tools/page.tsx`;
- `frontend/messages/en.json`;
- `frontend/messages/ru.json`;
- `frontend/messages/lv.json`.

Действия:

- выписать текущие темы `defects`, `gas`, `WPS`, `training`, `quality`, `porosity`;
- отметить, где тема является pattern, где case, где explanation, где calculator;
- найти 3-5 главных дублей;
- не переписывать контент на этом этапе.

Результат:

- короткий список конфликтов;
- решение, какой слой владеет каждым смыслом.

### Этап 2. IA Mapping

Цель:

- зафиксировать 3 слоя в навигационной модели.

Файлы:

- `frontend/components/Header.tsx`;
- `frontend/components/Footer.tsx`;
- `frontend/messages/*`;

Действия:

- добавить/обновить microcopy `Engineering Decision System`;
- добавить `Reasoning -> Proof -> Knowledge`;
- в Footer сгруппировать ссылки по 3 слоям;
- Header оставить простым, если dropdown усложняет UX;
- не удалять ссылки без проверки текущего поведения.

Результат:

- пользователь видит 3 смысловых слоя;
- маршруты не меняются.

### Этап 3. Home Decision System Strip

Цель:

- объяснить систему за 5 секунд.

Файлы:

- `frontend/app/[locale]/page.tsx`;
- `frontend/components/Hero.tsx`, если microcopy живет там;
- `frontend/messages/*`.

Действия:

- добавить короткий блок из 3 слоев;
- не добавлять длинные описания;
- связать слои с маршрутами:
  - Reasoning -> `/solutions`, `/expertise`;
  - Proof -> `/experience`, `/tools`;
  - Knowledge -> `/knowledge`, `/blog`, `/book`.

Результат:

- HR/client понимает, где решения, где подтверждение, где знания.

### Этап 4. Solutions As Patterns

Цель:

- сделать `/solutions` чистым Decision Layer.

Файлы:

- `frontend/app/[locale]/solutions/page.tsx`;
- `frontend/messages/*` namespace `solutionsPage`.

Действия:

- убрать формулировки реальных кейсов;
- убрать компании/даты/конкретные результаты;
- заменить `we reduced` на generalized engineering method;
- оставить формат `problem class -> generalized cause -> analysis -> solution pattern`;
- добавить ссылки на `experience` только как validation, не как продолжение того же текста.

Результат:

- `/solutions` отвечает: `как решаются типовые проблемы`.

### Этап 5. Experience As Validation

Цель:

- сделать `/experience` чистым Evidence Layer.

Файлы:

- `frontend/app/[locale]/experience/page.tsx`;
- `frontend/components/ExperienceCaseAccordion.tsx`;
- `frontend/messages/*` namespace `experience`.

Действия:

- усилить `context`, `action`, `result`;
- оставить инженерное объяснение только внутри конкретного кейса;
- убрать общие методологические блоки, если они повторяют `solutions`;
- добавить dates/company/role там, где это уже есть в данных;
- не копировать структуру карточек из `solutions`.

Результат:

- `/experience` отвечает: `чем подтвержден опыт`.

### Этап 6. Knowledge / Blog / Book Split

Цель:

- исключить конкуренцию контентных разделов.

Файлы:

- `frontend/app/[locale]/knowledge/page.tsx`;
- `frontend/app/[locale]/blog/page.tsx`;
- `frontend/app/[locale]/blog/[slug]/page.tsx`;
- `frontend/app/[locale]/book/page.tsx`;
- `frontend/messages/*`.

Действия:

- `/knowledge`: оставить structured explanations;
- `/blog`: обозначить как chronological publications;
- `/book`: обозначить как static authority artifact;
- убрать одинаковые описания из intro/metadata;
- не переносить маршруты;
- не делать backend migration.

Результат:

- пользователь не воспринимает `knowledge`, `blog`, `book` как три одинаковых библиотеки.

### Этап 7. Tools Cleanup

Цель:

- сделать tools чистым validation/calculation layer.

Файлы:

- `frontend/app/[locale]/tools/page.tsx`;
- `frontend/app/[locale]/tools/[slug]/page.tsx`;
- `frontend/components/calculators/*`;
- `frontend/messages/*`;
- `frontend/lib/fallback-content.ts`, если содержит описания.

Действия:

- сократить объясняющие тексты;
- убрать storytelling;
- оставить назначение, inputs, outputs, units, warnings;
- длинные объяснения перенести ссылкой в `knowledge`, если они реально нужны;
- CTA на контакт оставить только там, где результат требует инженерной проверки.

Результат:

- tools ведут себя как калькуляторы, а не статьи.

### Этап 8. SEO И Metadata

Цель:

- обновить смысловые описания без потери стабильности.

Файлы:

- `frontend/app/[locale]/*/page.tsx`, где есть `generateMetadata`;
- `frontend/lib/metadata.ts`;
- `frontend/lib/seo.ts`;
- `frontend/app/sitemap.ts`.

Действия:

- titles/descriptions привести к ролям слоев;
- не удалять URLs из sitemap без отдельного решения;
- если `/blog` и `/book` сейчас исключены из sitemap по v2.1, отдельно решить, возвращать ли их как Knowledge System routes;
- canonical не менять без необходимости.

Результат:

- SEO остается стабильным;
- описания страниц не конфликтуют.

### Этап 9. Acceptance Pass

Цель:

- проверить, что новая смысловая модель реально работает.

Проверки:

- HR test;
- no duplication test;
- mental load test;
- tools validation test;
- route stability test;
- localization consistency test.

Результат:

- сайт читается как одна инженерная система.

## 13. Acceptance Criteria

### 13.1. HR Test

За 5 секунд пользователь понимает:

- что делает специалист;
- где описаны решения;
- чем подтвержден опыт;
- где знания;
- где инструменты.

Минимальный признак успеха:

- пользователь не спрашивает, чем `solutions` отличается от `experience`.

### 13.2. No Duplication Test

Нельзя найти:

- одинаковый кейс в `solutions` и `experience`;
- одинаковое объяснение дефекта в `solutions` и `knowledge`;
- одинаковый educational text в `knowledge` и `tools`;
- одинаковую роль у `knowledge`, `blog`, `book`.

### 13.3. Mental Load Test

Пользователь видит 3 слоя:

- Reasoning;
- Proof;
- Knowledge.

А не 7 равноправных разделов.

### 13.4. Tools Validation Test

Каждый tool:

- принимает параметры;
- возвращает расчет или проверку;
- не рассказывает историю;
- не заменяет статью;
- не продает консультацию как основной контент.

### 13.5. Route Stability Test

Должны продолжать открываться:

- `/`;
- `/solutions`;
- `/experience`;
- `/expertise`;
- `/tools`;
- `/tools/[slug]`;
- `/knowledge`;
- `/blog`;
- `/blog/[slug]`;
- `/book`;
- `/about`;
- `/contact`.

Локализованные версии должны сохранять текущий `next-intl` pattern.

## 14. Риски И Безопасные Решения

### 14.1. Риск: Header Перегружен

Не делать сложный mega-menu на P0.

Безопасное решение:

- Header остается простым;
- 3 группы показываются в Footer и на Home;
- subtitle показывает `Engineering Decision System`.

### 14.2. Риск: v2.1 Скрывал Blog/Book, А v2.2 Требует Knowledge System

Безопасное решение:

- маршруты сохраняются;
- Header не обязан сразу показывать `/blog` и `/book`;
- Footer или Home Knowledge System может содержать secondary links;
- sitemap-решение вынести в отдельную P2-проверку.

### 14.3. Риск: Solutions Станет Слишком Теоретическим

Безопасное решение:

- оставлять прикладные problem classes;
- писать через производственные проблемы, но без реальных кейсов;
- добавлять ссылку `See validation in cases`.

### 14.4. Риск: Experience Потеряет Инженерность

Безопасное решение:

- сохранять `problem -> action -> result`;
- не добавлять длинную теорию;
- показывать инженерность через реальные действия и impact.

### 14.5. Риск: Knowledge И Solutions Снова Смешаются

Безопасное решение:

- `knowledge` объясняет процесс;
- `solutions` описывает решение типовой проблемы;
- если текст содержит `что такое` или `почему возникает`, это чаще `knowledge`;
- если текст содержит `как подойти к решению`, это чаще `solutions`;
- если текст содержит `в этом случае было сделано`, это `experience`.

## 15. Команды Проверки

Запускать из frontend после существенных изменений:

```powershell
Set-Location "D:\Work_Cursor\PersonalHomePage\frontend"
npm run lint
npm run build
```

Если менялись только тексты и JSX одной страницы, сначала достаточно проверить lints по измененным файлам через IDE diagnostics.

Если менялись маршруты, sitemap или metadata, дополнительно проверить:

```powershell
Set-Location "D:\Work_Cursor\PersonalHomePage\frontend"
npm run build
```

## 16. Финальная Целевая Формула

Было:

> 7 independent content systems.

Стало:

> Engineering Decision System with 3 layers.

Финальная модель:

```text
Decision Layer
  solutions + expertise

Evidence Layer
  experience + tools

Knowledge Layer
  knowledge + blog + book
```

Главный принцип реализации:

> Do not delete routes. Reassign meaning, reduce duplication, and make every section answer one clear question.
