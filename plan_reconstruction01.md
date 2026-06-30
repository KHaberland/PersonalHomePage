# План реконструкции PersonalHomePage v2.1 Stabilized

Цель: доработать сайт без смены визуального стиля так, чтобы он воспринимался как инженерный B2B-консалтинг одного senior-специалиста, а не как мини-корпоративный сайт, агентство, контент-портал или образовательная платформа.

Финальное позиционирование:

> International Welding Engineer (IWE) — Industrial Welding Engineering Consultant

Главный UX-принцип:

> Engineering clarity > consulting complexity

North Star Rule:

> The website must feel like a senior engineer offering consulting — not like a consulting agency website.

То есть:

- меньше маркетинга;
- больше инженерной логики;
- меньше терминов;
- больше понятных смыслов;
- один главный путь пользователя: `Home -> Solutions -> Contact`.
- один primary CTA по всему сайту: `Request consultation`.

## 0. Правила Экономии Токенов При Реализации

Реализовывать план короткими итерациями. Не открывать и не переписывать весь проект без необходимости.

### 0.1. Рабочий Контекст

Перед началом каждой задачи использовать только:

- `structure.md` — фактическая карта проекта;
- `plan_reconstruction01.md` — этот целевой план;
- 1-3 файла, которые реально меняются.

Не перечитывать весь проект, если задача касается одной страницы или одного компонента.

### 0.2. Разбиение На Малые Пакеты

Работать этапами:

1. P0: IA + Header/Footer + Sitemap.
2. P0: Home.
3. P0: Solutions + Contact.
4. P1: Knowledge UX + Experience.
5. P1: Tools naming.
6. P2: About + Schema.

Каждый пакет:

- менять минимальное число файлов;
- использовать существующие компоненты;
- синхронизировать 3 локали сразу;
- после правок запускать `ReadLints`;
- `npm run lint` запускать после существенных frontend-правок;
- `structure.md` обновлять только если реально изменилась структура.

### 0.3. Локализация

При добавлении новых текстов сразу обновлять:

- `frontend/messages/en.json`;
- `frontend/messages/ru.json`;
- `frontend/messages/lv.json`.

Предпочитать существующие namespaces:

- `home`;
- `solutionsPage`;
- `contact`;
- `experience`;
- `knowledge`;
- `tools`/`calculators`, если уже используются.

Не создавать новые namespaces без необходимости.

### 0.4. Переиспользование UI

Стиль сайта не менять.

Использовать существующие:

- `Hero`;
- `Section`;
- `CompetencyCard`;
- `ToolCardLink`;
- `ExperienceCaseAccordion`;
- `ContactForm`;
- `Header`;
- `Footer`;
- глобальные классы `card`, `btn-primary`, `btn-secondary`, `heading-*`.

Не создавать новую дизайн-систему и не переписывать `globals.css`, если хватает текущих классов.

## 1. Стратегия Позиционирования

Текущая перегруженная формула:

- `IWE Engineering Consultant Platform`
- `Industrial Welding Consultant`

Проблема:

- звучит слишком корпоративно;
- создаёт ожидание компании/агентства;
- может ухудшить HR-восприятие личного бренда.
- может звучать как фриланс-консультант без инженерного продукта.

Целевая формула:

- `International Welding Engineer (IWE) — Industrial Welding Engineering Consultant`

Смысл:

- консалтинг — функция специалиста;
- сайт остаётся личным инженерным брендом;
- B2B-направление становится главным, но не превращается в “consulting company website”.
- слово `Engineering` усиливает техническое доверие;
- HR считывает senior engineer;
- B2B считывает технического эксперта, а не маркетингового консультанта.

## 2. UX-Иерархия И Слои Восприятия

Сайт должен читаться в 3 слоя.

Layer 1 — Authority:

- Experience;
- Expertise.

Layer 2 — Offer:

- Solutions;
- Contact.

Layer 3 — Support:

- Knowledge;
- Tools.

Важно:

- обучение не должно выглядеть как отдельный продукт того же уровня, что consulting;
- HR/career слой нужен для доверия, но не должен спорить с B2B-воронкой;
- `/solutions` — главный коммерческий раздел;
- `/experience` — слой доверия;
- `/expertise` — техническое обоснование;
- `/knowledge` — поддержка и SEO;
- `/tools` — вторичная инженерная ценность.
- Tools и Knowledge не должны конкурировать с Solutions.

Иерархия направлений:

1. Primary: Industrial consulting для B2B.
2. Secondary: Experience / career credibility.
3. Tertiary: Education / training.

## 3. Финальная IA

Строго фиксированная пользовательская IA:

- `/`;
- `/solutions`;
- `/experience`;
- `/expertise`;
- `/tools`;
- `/knowledge`;
- `/about`;
- `/contact`.

Правило для `/blog`:

- `/blog` не часть IA;
- `/blog` не часть UX;
- `/blog` не часть sitemap;
- `/blog` только backend/data/legacy route;
- `/blog` не участвует в Header/Footer как основной маршрут;
- `/blog` не конкурирует с `/knowledge`;
- физическую миграцию `/blog -> /knowledge` сейчас не делать.

Структура:

```text
/
├── solutions
├── experience
├── expertise
├── knowledge
├── tools
├── about
└── contact
```

## 4. Header И Footer

Файлы:

- `frontend/components/Header.tsx`;
- `frontend/components/Footer.tsx`.

## 4.1. UI-Нейминг

Принцип:

> Navigation labels must describe user intent, not internal system structure.

Не использовать в меню перегруженные формулировки:

- `Engineering Decision Support Tools`;
- `Request Engineering Review`;
- `Engineering Consulting Services`;
- `Experience & Case Studies`.

Оставить простые подписи:

- `Home`;
- `Solutions`;
- `Cases`;
- `Expertise`;
- `Knowledge`;
- `Tools`;
- `About`;
- `Contact`.

В русской версии:

- `Решения`;
- `Кейсы`;
- `Экспертиза`;
- `Знания`;
- `Инструменты`;
- `Обо мне`;
- `Контакты`.

Сложный смысл должен быть внутри страниц, а не в пунктах меню.

Фиксированный mapping:

- `Cases` = `/experience`;
- `Кейсы` = `/experience`.

## 4.2. Header

Сделать:

- убрать `/blog` из `primaryNavLinks`;
- `/knowledge` оставить как главный контентный раздел;
- `/experience` в UI показывать как `Cases`;
- `/contact` в меню оставить просто `Contact`, не `Request Engineering Review`.

Не делать dropdown на P0.

## 4.3. Footer

Сделать:

- повторить простую IA;
- `/blog` можно оставить только как вторичную/служебную ссылку, если нужна совместимость;
- главный content-link: `/knowledge`;
- CTA: `Request consultation` или локальный аналог.

## 5. Home — Фиксированная Структура

Файл:

- `frontend/app/[locale]/page.tsx`.

Home не должен одновременно быть:

- корпоративной презентацией;
- CV;
- блогом;
- каталогом услуг;
- учебным лендингом.

Home = короткий consulting landing с инженерной ясностью.

Home hierarchy must be weighted. Секции не равны по весу.

Фиксированный порядок:

1. Hero — authority.
2. Problem -> Value — pain.
3. Solutions — primary conversion.
4. Experience — trust.
5. Expertise — proof.
6. Contact CTA — conversion.
7. Tools — support, optional / near the end.

Не добавлять дополнительные равнозначные секции без отдельного решения.

Важно:

- Solutions должен доминировать сильнее Tools и Knowledge.
- Tools должен быть последним или почти последним.
- Knowledge не обязательно выводить отдельным preview на Home, если страница становится перегруженной.

## 6. Home Hero

Файл:

- `frontend/components/Hero.tsx`.

Цель:

- за 10 секунд объяснить кто ты, что делаешь и зачем писать.

Тексты:

- line 1: `International Welding Engineer (IWE)`;
- line 2: `Industrial Welding Consultant`;
- subtitle: `Welding process optimization / defect reduction / WPS implementation`.

В русской версии:

- `Международный инженер по сварке (IWE)`;
- `Инженерный консультант для производства`;
- `Оптимизация сварочных процессов / снижение дефектов / внедрение WPS`.

CTA:

- primary: `Request consultation` -> `/contact`;
- secondary: `Cases` -> `/experience`;
- secondary: `Solutions` -> `/solutions`.

Не использовать несколько близких CTA вроде:

- `Request Engineering Review`;
- `Request Technical Review`;
- `Request Plant Analysis`;
- `Get Welding Process Review`.

Одна основная формула:

- `Request consultation`.

## 7. Problem -> Value

Файл:

- `frontend/app/[locale]/page.tsx`.

Блок обязателен, но короткий.

Заголовок:

- `Typical manufacturing problems I solve`;
- ru: `Типичные производственные проблемы, которые я решаю`.

Сократить текст на 20-30% относительно v1.

Проблемы:

- weld defects / porosity;
- unstable weld quality;
- excessive shielding gas consumption;
- missing WPS / documentation;
- inconsistent work between shifts.

Формат:

- 4-5 коротких карточек;
- 1-2 строки на карточку;
- без длинных объяснений;
- CTA на `/solutions`.

Не добавлять KPI, проценты или бизнес-метрики в этот блок.

## 8. Solutions Preview На Home

Файл:

- `frontend/app/[locale]/page.tsx`.

Оставить только 4 карточки:

- defect reduction;
- process optimization;
- shielding gas selection;
- training.

Не добавлять:

- KPI-блоки;
- проценты;
- сложные industry labels;
- WPS как пятую карточку на Home.

Смысл:

- коротко показать, что есть прикладные решения;
- вести на `/solutions`.

CTA:

- `Solutions` или `View solutions` -> `/solutions`.

## 9. Experience Preview На Home

Файл:

- `frontend/app/[locale]/page.tsx`.

Цель:

- trust layer;
- не превращать главную в страницу кейсов.

Оставить:

- 2-3 коротких доказательства опыта;
- ссылку на `/experience`.

Не делать на Home:

- Problem / Action / Result для каждого кейса;
- KPI chips;
- business-style metrics;
- сложные badges.

Полная структура кейсов должна жить на `/experience`.

## 10. Expertise Preview На Home

Файл:

- `frontend/app/[locale]/page.tsx`.

Цель:

- подтверждение компетенции;
- не мини-учебник.

Оставить:

- MIG/MAG;
- TIG;
- shielding gases.

Тексты:

- короткие;
- технические;
- без длинных объяснений.

CTA:

- `/expertise`.

## 11. Tools Preview На Home

Файл:

- `frontend/app/[locale]/page.tsx`.

UI name:

- `Tools`;
- ru: `Инструменты`.

Не выводить на Home:

- `Engineering Decision Support System`;
- длинное позиционирование.

Смысл внутри:

- инженерные калькуляторы как secondary value.

CTA:

- `/tools`.

## 12. Final CTA На Home

Файл:

- `frontend/app/[locale]/page.tsx`.

Один смысл:

- `Request consultation`;
- ru: `Запросить консультацию`.

Не использовать:

- 3 разных CTA;
- сложные request categories на главной;
- `Plant Analysis`, `Technical Review`, `Engineering Review` одновременно.

Допустимо:

- короткая строка: `Describe the welding issue, process or documentation need.`
- кнопка `/contact`.

## 13. Solutions Page

Файл:

- `frontend/app/[locale]/solutions/page.tsx`.

Роль:

- simple structured consulting offering page.

Не перегружать страницу:

- отдельными KPI-блоками;
- множеством industry sections;
- несколькими CTA вариантами;
- marketing vocabulary.

Финальная структура каждой секции:

1. Problem.
2. Engineering Approach.
3. Outcome.

Почему:

- `Analysis` звучит пассивно;
- `Engineering Approach` показывает инженера-решателя;
- 3 шага проще для UX, чем 4 академические колонки.

Текущую структуру `Проблемы / Анализ / Результат` нужно привести к:

- `Problem`;
- `Engineering Approach`;
- `Outcome`.

Не добавлять 4-ю колонку `Solution`, если это перегружает карточки.

Решений максимум:

- 4-5.

Оставить:

- defect reduction;
- process optimization;
- shielding gas selection;
- training;
- WPS support.

CTA:

- один главный CTA: `Request consultation` -> `/contact`.

Не использовать одновременно:

- `Request Plant Analysis`;
- `Get Welding Process Review`;
- `Request Engineering Review`.

## 14. Knowledge Vs Blog

Архитектура:

- `/knowledge` = главный контентный раздел;
- `/blog` = legacy + SEO + технический слой.

Финальное правило:

> Knowledge is a UX product. Blog is a content format.

Следствие:

- `/knowledge` — навигация;
- `/blog` — data source / legacy route;
- нельзя добавлять `/blog` в навигацию “для SEO”;
- нельзя делать dual entry UX `Blog` + `Knowledge`.

Сейчас не делать:

- физическую миграцию `/blog` в `/knowledge`;
- переезд article detail routes;
- backend merge;
- redirect strategy.

Сделать:

- убрать `/blog` из Header;
- не продвигать `/blog` как равнозначный раздел;
- `/knowledge` позиционировать как engineering reference library;
- сохранить backend без изменений.

Файлы:

- `frontend/components/Header.tsx`;
- `frontend/components/Footer.tsx`;
- `frontend/app/[locale]/knowledge/page.tsx`;
- возможно `frontend/messages/*.json`.

## 15. Tools

Файлы:

- `frontend/app/[locale]/tools/page.tsx`;
- `frontend/app/[locale]/tools/[slug]/page.tsx`;
- `frontend/components/calculators/*`.

UI name:

- `Tools`;
- ru: `Инструменты`.

Смысл внутри:

- engineering calculators;
- decision support как внутреннее объяснение, не как главный UI-label.

Не использовать как заголовок:

- `Engineering Decision Support System`.

Можно использовать в описании:

- `Calculators that support engineering decisions in welding production`.

Для каждого калькулятора:

- input;
- calculation/simulation;
- result;
- short engineering explanation.

Без большой переработки API.

## 16. Contact

Файлы:

- `frontend/app/[locale]/contact/page.tsx`;
- `frontend/components/ContactForm.tsx`.

CTA:

- `Request consultation`;
- ru: `Запросить консультацию`.

Request type:

Оставить максимум 3 типа.

- Consultation;
- Training;
- Optimization / WPS support.

Не добавлять длинный список:

- Engineering consultation;
- Production audit;
- Training;
- WPS support;
- Gas optimization;
- Plant analysis;
- Technical review.

P0:

- request type можно добавить в mailto body;
- backend не менять.
- primary CTA всегда `Request consultation`.

P2:

- backend request_type только если появится серверная форма.

## 17. Experience

Файл:

- `frontend/app/[locale]/experience/page.tsx`.

Experience page must read like engineering track record, not case marketing.

Финальная структура кейса:

- Context / production environment;
- Problem;
- Engineering Action;
- Result.

Не добавлять:

- KPI generation;
- business metrics без подтверждения;
- сложные badges;
- проценты, если нет фактических данных.

Причина:

- инженерное доверие важнее маркетингового эффекта.

Experience должен усиливать:

- практический опыт;
- IWE credibility;
- производственный контекст;
- HR-восприятие.

## 18. About

Файл:

- `frontend/app/[locale]/about/page.tsx`.

Роль:

- About / CV;
- secondary trust layer.

Добавить позже:

- Engineering profile summary;
- IWE certification;
- specialization;
- industries worked with;
- training experience;
- LinkedIn CTA.

Не делать About главным commercial landing.

CV PDF:

- optional;
- только если готов файл и понятен путь публикации.

## 19. SEO

## 19.1. Sitemap P0

Файл:

- `frontend/app/sitemap.ts`.

Добавить:

- `/solutions`;
- `/expertise`.

Это P0, потому что страницы существуют, но не указаны в sitemap.

Правило:

> Sitemap must reflect UX, not backend reality.

В sitemap должны быть только user-facing страницы.

Не добавлять:

- `/blog`;
- backend/legacy routes.

## 19.2. Metadata

Усилить, но без corporate overload.

Формулы:

- Home: `International Welding Engineer (IWE), industrial welding consultant`.
- Solutions: `welding process optimization, defect reduction, WPS support`.
- Experience: `welding experience and case studies`.
- Expertise: `MIG/MAG, TIG, shielding gases, metallurgy`.
- Knowledge: `welding knowledge base`.
- Contact: `request consultation`.

## 19.3. Schema

P2:

- `Person`;
- возможно `ProfessionalService`.

Не делать в P0, если нет готовой схемы.

## 20. Backend

Backend менять минимально.

P0:

- backend не трогать.

P1:

- backend не трогать для `/knowledge` merge;
- сохранить `/api/posts/`, `/api/categories/`, `/api/tags/`.

P2:

- `request_type` только если появится серверная контактная форма;
- иначе тип запроса добавляется в `mailto` body.

## 21. UX-Запреты v2.1

Запрещено:

- multiple CTA meanings on the same page;
- corporate terminology stacking;
- KPI inflation;
- dual navigation systems `Blog` vs `Knowledge`;
- equal-weight sections on Home;
- consulting company tone;
- отдельный product-level слой для education/training;
- выводить Tools как равный коммерческий раздел рядом с Solutions;
- добавлять `/blog` в Header/Footer ради SEO;
- выдумывать проценты, savings и KPI без фактических данных.

Если возникает конфликт:

- engineering clarity важнее marketing copy;
- trust важнее aggressive conversion;
- simple IA важнее полноты каталога.

## 22. Приоритеты Внедрения

## P0 — Стабилизация Позиционирования И Воронки

Цель:

- сайт понятен за 10 секунд;
- нет corporate vocabulary overload;
- основной путь `Home -> Solutions -> Contact`.

Задачи:

1. Header/Footer:
   - простые labels;
   - убрать `/blog` из основного меню;
   - `/knowledge` оставить главным контентным разделом.
2. Hero:
   - `International Welding Engineer (IWE)`;
   - `Industrial Welding Engineering Consultant`;
   - CTA `Request consultation`.
3. Home:
   - добавить короткий Problem -> Value;
   - оставить 4 Solutions cards;
   - Experience как trust preview;
   - Expertise как proof preview;
   - Tools как secondary value;
   - Final CTA только `Request consultation`.
4. Solutions:
   - не добавлять отдельный KPI layer;
   - сохранить 4-5 решений;
   - структура Problem / Engineering Approach / Outcome;
   - один CTA.
5. Contact:
   - CTA `Request consultation`;
   - request types максимум 3.
6. Sitemap:
   - добавить `/solutions`;
   - добавить `/expertise`.
   - не добавлять `/blog`.

Файлы P0:

- `frontend/components/Header.tsx`;
- `frontend/components/Footer.tsx`;
- `frontend/components/Hero.tsx`;
- `frontend/app/[locale]/page.tsx`;
- `frontend/app/[locale]/solutions/page.tsx`;
- `frontend/app/[locale]/contact/page.tsx`;
- `frontend/components/ContactForm.tsx`;
- `frontend/app/sitemap.ts`;
- `frontend/messages/en.json`;
- `frontend/messages/ru.json`;
- `frontend/messages/lv.json`;
- `structure.md`.

## P1 — Контентная Ясность

Задачи:

1. `/knowledge`:
   - визуально главный content hub;
   - `/blog` не продвигать в UX;
   - backend не менять.
2. `/experience`:
   - Context / Problem / Engineering Action / Result;
   - без KPI-перегруза.
3. `/tools`:
   - UI name `Tools`;
   - engineering explanation внутри страниц калькуляторов.

Файлы P1:

- `frontend/app/[locale]/knowledge/page.tsx`;
- `frontend/app/[locale]/experience/page.tsx`;
- `frontend/components/ExperienceCaseAccordion.tsx`;
- `frontend/app/[locale]/tools/page.tsx`;
- `frontend/app/[locale]/tools/[slug]/page.tsx`;
- `frontend/messages/*.json`;
- `structure.md`.

## P2 — Доверие И SEO

Задачи:

1. `/about`:
   - Engineering profile summary;
   - LinkedIn CTA;
   - optional CV PDF.
2. Schema:
   - Person;
   - ProfessionalService только если не перегружает и корректно описывает индивидуального консультанта.
3. Contact backend:
   - request_type только при серверной форме.

Файлы P2:

- `frontend/app/[locale]/about/page.tsx`;
- `frontend/lib/metadata`;
- `frontend/lib/seo`;
- `frontend/messages/*.json`;
- backend только при необходимости.

## 23. Проверка После Внедрения

Frontend:

```powershell
Set-Location "D:\Work_Cursor\PersonalHomePage\frontend"
npm run lint
npm run build
```

Backend, если менялся:

```powershell
Set-Location "D:\Work_Cursor\PersonalHomePage\backend"
.\.venv\Scripts\python.exe manage.py check
```

Ручная проверка:

- `/en`, `/ru`, `/lv`;
- Header desktop/mobile;
- Footer;
- Home понятен за 10 секунд;
- `/solutions` не перегружен KPI/CTA;
- `/knowledge` главный content hub;
- `/blog` не в основном меню;
- `/blog` не в sitemap;
- `/contact` имеет один главный CTA;
- sitemap содержит `/solutions` и `/expertise`.

## 24. Критерии Готовности v2.1

Сайт готов, если:

- понятно кто ты: International Welding Engineer (IWE);
- понятно что ты делаешь: Industrial Welding Engineering Consultant;
- понятно зачем писать: Request consultation;
- нет corporate vocabulary overload;
- Home не перегружена смыслами;
- Solutions простая и структурированная;
- Experience усиливает доверие без выдуманных KPI;
- Knowledge не конкурирует с Blog;
- Tools остаются Tools;
- Contact не перегружен request types, максимум 3;
- главный путь пользователя: `Home -> Solutions -> Contact`.
- структура ощущается как: инженер -> опыт -> решения -> контакт.
- структура не ощущается как: компания, агентство, контент-портал или образовательная платформа.

Финальный результат:

> Industrial Engineering Consultant portfolio with consulting funnel

А не:

> mini-consulting company website
