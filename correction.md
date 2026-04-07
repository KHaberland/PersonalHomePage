# План и фиксация: главная страница (финальная версия по блокам)

Документ фиксирует соответствие **контента ТЗ** структуре сайта и файлам переводов. Реализация: секции в `frontend/app/[locale]/page.tsx`, тексты — `frontend/messages/{ru,en,lv}.json` (namespace `home`, `common`, `experience` для fallback-опыта).

---

## Карта блоков → код

| Блок ТЗ | Якорь (`id`) | Источник текста |
|--------|----------------|-----------------|
| 1. Hero | — (шапка) | `home.heroTitleLine1` … `heroTitleLine3`, `heroTitleLineHighlight` → `Hero.tsx` |
| 2. Почему я | `why-choose` | `whyChooseSectionHeading`, `whyChooseCard1–4*` |
| 3. Обо мне | `about` | `home.aboutText` (HTML; при наличии записи в API — `bio_main`) |
| 4. Компетенции | `competencies` | технические: `competencyIcon*`, `competencyCard1–6`; бизнес-подблок: `competencyBusiness*`, `competenciesBusiness*` (+ опционально API `getHomeTechnicalSkills` / `getHomeBusinessOutcomes`) |
| 5. Формат работы | `services` | `servicesTitle`, три карточки: `serviceConsulting*`, `serviceTraining*`, `serviceProjectSupport*` |
| 6. Практические ситуации | `cases` | `casesTitle`, `case1–3Title`, `case1–3Description` (многострочный текст, `→` в конце) |
| 7. Опыт | `experience` | из API или fallback `experience.{elme,buts,production}.{role,company,period,homeOutline}` |
| 8. Книга | `book` | `bookTitle`, `bookDescription` (HTML при fallback без API) |
| 9. Калькуляторы | `tools` | `toolsTitle`, `toolsSectionLead`, `toolsDescription` |
| 10. Блог | `blog` | `blogTitle`, `blogSubtitle` |
| 11. Контакт | `contact` | `ctaBannerTitle`, `ctaBannerText`, кнопки |

Навигация по точкам справа (`HomeSectionProgress.tsx`): подписи из `common` (`homeSectionWhy`, `expertiseServices` → «Формат работы» / EN / LV, `expertiseCases` → «Практические ситуации» / EN / LV).

---

## Изменения в разметке (минимально необходимые)

1. **Формат работы**: три карточки вместо четырёх; сетка `lg:grid-cols-3`; подзаголовок секции скрывается, если `servicesSubtitle` пустой.
2. **Практические ситуации**: порядок карточек — MAG → обучение → газ; подзаголовок скрывается при пустом `casesSubtitle`.
3. **Карточки** (`CompetencyCard`): для описания включён `whitespace-pre-line`, чтобы многострочные строки и «стрелка» отображались как задумано.
4. **Опыт (fallback)**: под периодом выводится `experience.*.homeOutline` (нет в данных API — только для трёх fallback-ключей).

Иконка третьей услуги: `IconServiceImplementation` (поддержка проектов), без отдельной новой иконки.

---

## Ключи JSON (новые / важные)

- `home.serviceProjectSupport`, `home.serviceProjectSupportDesc` — поддержка проектов.
- `experience.elme.homeOutline`, `experience.buts.homeOutline`, `experience.production.homeOutline` — краткая строка под блоком опыта на главной (fallback).

Старые ключи `serviceImplementation`, `serviceEquipment` и т.д. **оставлены** в файлах для совместимости и возможного использования вне сетки из трёх карточек.

---

## Что проверить вручную после деплоя

- Если в бэкенде заполнены **био главной** и **описания опыта**, они перекроют fallback из `messages`; при необходимости обновить контент в CMS теми же формулировками.
- Блок книги на главной: при ответе API с полем описания книги отобразится оно, а не `home.bookDescription`.

---

## Состояние на момент правки

Тексты **ru / en / lv** для перечисленных ключей приведены к финальной версии ТЗ; структура главной и i18n синхронизированы с этим документом.
