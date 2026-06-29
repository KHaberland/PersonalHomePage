# План реализации редизайна главной страницы

Цель: превратить `/` из полного каталога в короткую экспертную витрину, которая ведёт на `/solutions`, `/experience`, `/expertise`, `/tools`, `/blog`, `/contact`.

## 0. Контекст проекта

Основные файлы:

- `frontend/app/[locale]/page.tsx` — структура главной страницы.
- `frontend/components/Hero.tsx` — Hero и CTA первого экрана.
- `frontend/components/HomeSectionProgress.tsx` — плавающая навигация по якорям главной.
- `frontend/components/Header.tsx` — верхнее меню и dropdown решений.
- `frontend/components/Footer.tsx` — ссылки футера на секции главной.
- `frontend/messages/en.json`, `frontend/messages/ru.json`, `frontend/messages/lv.json` — тексты.
- `structure.md` — после внедрения обновить описание структуры.

Текущие блоки главной: Hero, `#why-choose`, `#about`, `#expertise`, `#solutions`, `#cases`, `#experience`, `#book`, `#tools`, `#blog`, `#contact`.

Целевые якоря главной: `#expertise`, `#solutions`, `#cases`, `#tools`, `#blog`, `#contact`.

## 1. Целевая структура главной

Итоговый порядок блоков:

1. Hero — кто ты.
2. Solutions `#solutions` — что ты делаешь.
3. Expertise preview `#expertise` — чем ты силён.
4. Cases `#cases` — доказательства.
5. Experience summary внутри `#cases` или отдельным компактным блоком без якоря.
6. Tools `#tools` — preview калькуляторов.
7. Blog `#blog` — preview статей.
8. Contact `#contact` — действие.

Удалить с главной как равнозначные секции:

- `#about`.
- `#experience`.
- `#book`.
- `#why-choose`, если он дублирует позиционирование Hero/Solutions. Если нужен trust-preview, встроить 2-3 пункта в Hero или Contact без отдельного якоря.

## 2. Hero

Файл: `frontend/components/Hero.tsx`.

Сделать:

- Оставить логику видео/градиента без изменений.
- Заменить тексты через ключи `home.heroTitleLine1`, `home.heroTitleLine2`, при необходимости `home.heroTitleLineHighlight`.
- Целевой смысл:
  - `Инженер по сварке (IWE)`
  - `Оптимизация сварочных процессов / снижение дефектов / внедрение WPS`
- CTA:
  - `Связаться` -> `/contact`, primary.
  - `Решения` -> `/solutions`, secondary.
  - `Инструменты` -> `/tools`, secondary или link.
- Убрать ссылку `/#competencies`; если нужен scroll-link, заменить на `/#solutions` или `/#expertise`.

Тексты обновить во всех локалях: `en.json`, `ru.json`, `lv.json`.

## 3. Solutions

Файл: `frontend/app/[locale]/page.tsx`.

Сделать:

- Переместить секцию `#solutions` сразу после Hero.
- В `solutionFlowItems` оставить 4 карточки:
  - `solutions-defect-reduction` — снижение дефектов.
  - `solutions-process-optimization` — оптимизация процессов.
  - `solutions-gas-selection` — подбор защитных газов.
  - `solutions-training` — обучение персонала.
- Удалить из главной `solutions-wps-support`, чтобы не перегружать preview.
- CTA секции заменить:
  - текст `Подробнее о решениях`;
  - href `/solutions`.
- Если страницы `/solutions` ещё нет, план внедрения блокировать до создания страницы или временно вести CTA на `/contact` только после согласования.

Тексты:

- Добавить/обновить ключ `home.solutionsMoreCta`.
- При необходимости переименовать карточки с общих `serviceConsulting`/`serviceImplementation` на точные формулировки из ТЗ.

## 4. Expertise Preview

Файл: `frontend/app/[locale]/page.tsx`.

Сделать:

- Секцию `#expertise` поставить после `#solutions`.
- В `competencyTechnicalItems` оставить только 3 карточки:
  - MIG/MAG оптимизация процессов.
  - TIG сварка (Al / SS).
  - Газовые технологии и оптимизация расхода.
- Убрать с главной карточки:
  - металлургия;
  - газы для резки;
  - безопасность с газами.
- Добавить CTA:
  - текст `Вся экспертиза`;
  - href `/expertise`.
- Сетка: `grid-cols-1`, `sm:grid-cols-2`, `lg:grid-cols-3`.

Важно: полный набор компетенций должен жить на `/expertise`, а главная не должна SEO-конкурировать с этой страницей.

## 5. Cases

Файл: `frontend/app/[locale]/page.tsx`.

Сделать:

- Оставить 3 текущих кейса без изменения состава.
- CTA:
  - текст `Все кейсы`;
  - href `/experience`.
- Mobile UX: если быстро реализуемо, заменить grid на горизонтальный scroll/snap только на mobile:
  - mobile: `flex overflow-x-auto snap-x`;
  - `sm+`: текущий grid.
- Если свайп требует риска по стилям, оставить grid и отметить отдельной задачей.

## 6. Experience Summary

Файл: `frontend/app/[locale]/page.tsx`.

Сделать:

- Убрать отдельный якорь `id="experience"` с главной.
- Заменить текущий таймлайн на компактный summary-блок из 3 пунктов:
  - `IWE инженер по сварке`;
  - `Elme Messer Gaas`;
  - `Преподаватель сварки`.
- CTA:
  - текст `Полный опыт`;
  - href `/experience`.
- Не выводить длинные описания из API на главной. API-таймлайн остаётся для `/experience`.
- Разместить блок после кейсов или как компактную карточку внутри секции `#cases`.

## 7. Tools

Файл: `frontend/app/[locale]/page.tsx`.

Сделать:

- Оставить preview `#tools`.
- Лимит карточек: 4-6, текущий `slice(0, 6)` допустим.
- CTA:
  - текст `Все калькуляторы`;
  - href `/tools`.
- Mobile UX:
  - карточки в 1 колонку на очень узких экранах;
  - 2 колонки на mobile/sm, если помещается без ломки;
  - 3 колонки на desktop.

## 8. Blog

Файл: `frontend/app/[locale]/page.tsx`.

Сделать:

- Оставить `HOME_BLOG_POSTS_LIMIT = 3`.
- Оставить fallback из 3 карточек.
- CTA:
  - текст `Все статьи`;
  - href `/blog`.
- Mobile UX: 1 колонка на mobile, 2 на tablet, 3 на desktop. Текущий grid уже близок.

## 9. Навигация и якоря

Файл: `frontend/components/HomeSectionProgress.tsx`.

Сделать:

- `SECTION_IDS`: `expertise`, `solutions`, `cases`, `tools`, `blog`, `contact`.
- `SECTION_LABEL_KEYS`: `expertise`, `solutions`, `cases`, `homeSectionTools`, `homeSectionBlog`, `homeSectionContact`.
- Убрать `about`.

Файл: `frontend/components/Footer.tsx`.

Сделать:

- `homeSectionLinks`: оставить только `/#expertise`, `/#solutions`, `/#cases`, `/#tools`, `/#blog`, `/#contact`.
- Не ссылаться на `/#about` и `/#experience`.

Файл: `frontend/components/Header.tsx`.

Сделать:

- Основные страницы оставить:
  - `/about`, `/experience`, `/expertise`, `/solutions`, `/tools`, `/blog`, `/knowledge`, `/contact`.
- Если `/solutions` и `/expertise` существуют, заменить пункты меню с якорей `/#solutions`, `/#expertise` на страницы `/solutions`, `/expertise`.
- Dropdown решений должен вести на `/solutions` или якоря внутри `/solutions`, а не на блоки главной. Если на `/solutions` нет таких id, временно оставить dropdown на `/solutions` без подпунктов.

## 10. SEO

Файлы: `frontend/messages/*.json`, возможно `frontend/lib/metadata` при наличии отдельных ключей.

Сделать:

- Обновить `seo.homeDescription`: главная как витрина и вход в экспертные разделы, без перечисления всех тем.
- Усилить мета-описания:
  - `/solutions` — коммерческое: дефекты, процессы, газы, обучение, WPS.
  - `/expertise` — SEO-трафик: MIG/MAG, TIG, защитные газы, металлургия, качество.
  - `/experience` — доверие: опыт, кейсы, преподавание, Elme Messer Gaas.
- Проверить, что на главной нет длинных SEO-текстов, конкурирующих с внутренними страницами.

## 11. Локализация

Файлы: `frontend/messages/en.json`, `frontend/messages/ru.json`, `frontend/messages/lv.json`.

Минимальные новые/обновляемые ключи:

- `home.heroCtaSolutions`
- `home.solutionsMoreCta`
- `home.expertiseMoreCta`
- `home.casesCta`
- `home.experienceSummaryTitle`
- `home.experienceSummaryIwe`
- `home.experienceSummaryElme`
- `home.experienceSummaryTeacher`
- `home.experienceMoreCta`
- `home.toolsCta`
- `home.blogAllArticles`

Правило: ключи должны существовать во всех 3 локалях, иначе сборка `next-intl` может упасть.

## 12. Проверка после внедрения

Команды PowerShell:

```powershell
Set-Location "D:\Work_Cursor\PersonalHomePage\frontend"
npm run lint
npm run build
```

Ручная проверка:

- Главная визуально короче: нет полноценных `About`, `Experience`, `Book`.
- Порядок чтения: Hero -> Solutions -> Expertise -> Cases -> Tools -> Blog -> Contact.
- Все CTA ведут на целевые страницы.
- Якоря работают: `/#expertise`, `/#solutions`, `/#cases`, `/#tools`, `/#blog`, `/#contact`.
- Нет ссылок на несуществующие `/#about`, `/#experience`, `/#competencies`.
- Mobile: карточки не ломают ширину, блог в 1 колонку, cases удобны для просмотра.

## 13. Критерии готовности

- Главная не дублирует полные страницы `/about`, `/experience`, `/expertise`.
- На главной максимум 3 expertise-карточки и 4 solutions-карточки.
- В каждом блоке есть CTA или явное действие.
- Главная направляет пользователя в воронку доверия: `/solutions`, `/experience`, `/tools`, `/blog`, `/contact`.
- `structure.md` обновлён после фактических изменений.
