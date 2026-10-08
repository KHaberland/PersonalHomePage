# Правила CMS-миграции

Этот документ фиксирует правила подготовительного этапа миграции контента в Django Admin.

## Основное правило

Новый редактируемый текст добавляется только в Django. JSON-файлы в `frontend/messages/*.json` остаются временным fallback-слоем и не расширяются новым контентом, если этот текст должен редактироваться через CMS.

## Ограничения миграции

- JSON не удаляется до финального этапа миграции конкретной страницы.
- Django API должен быть primary source только после проверки fallback-поведения.
- Дизайн, маршруты и IA не меняются без необходимости.
- В одной задаче мигрируется только одна страница или одна крупная секция сложной страницы.
- Существующие API `/api/about/`, `/api/book/`, `/api/contact/`, `/api/tools/` не ломаются.

## Чеклист страницы

Для каждой страницы перед удалением legacy JSON должны быть отмечены все пункты:

- [ ] JSON fallback есть.
- [ ] API primary подключён.
- [ ] Данные заведены в Django Admin.
- [ ] Визуально проверено `/en`.
- [ ] Визуально проверено `/ru`.
- [ ] Визуально проверено `/lv`.
- [ ] JSON-ключи страницы помечены как legacy или удалены отдельным финальным этапом.

## Legacy JSON

Для страниц `Home`, `Book`, `Contact`, `Solutions`, `Expertise` и `Tools` ключи в `frontend/messages/*.json` считаются legacy fallback-слоем: frontend сначала запрашивает Django CMS через `getCmsPage`, а JSON используется только если API недоступен, вернул пустую страницу или отдельный ключ отсутствует в CMS-ответе.

Не добавлять новые редактируемые тексты этих страниц в JSON. До этапа 10 JSON остаётся в репозитории как страховочный fallback и удаляется только после ручной проверки `/en`, `/ru`, `/lv`.

## Статус страниц

| Страница | JSON fallback есть | API primary подключён | Данные заведены в admin | Проверено en/ru/lv | Статус |
| --- | --- | --- | --- | --- | --- |
| Home | да | да | да | не проверено | CMS primary, JSON legacy fallback |
| Book | да | да | да | не проверено | CMS primary, JSON legacy fallback |
| Contact | да | да | да | не проверено | CMS primary, JSON legacy fallback |
| Solutions | да | да | да | да (`/en`, `/ru`, `/lv`) | CMS primary; `section_*` — модели `SolutionSection` / `SolutionColumnGroup` |

### Solutions — источник правды для `section_*`

С **этапа 10 (cutover)** контент карточек решений (`section_defectReduction`, `section_processOptimization`, …) **не редактируется** через `SiteTextBlock`.

| Что | Где править в Django Admin |
| --- | --- |
| Заголовок секции (`title`) | **Solutions – секции** (`SolutionSection`) |
| Абзацы колонки (`problems_1`, `causes_2`, …) | **Solutions – колонки** (`SolutionColumnGroup` + inline `SolutionBullet`) |
| Hero, validation, nav, labels, final CTA | **Site text blocks** (`page=solutions`, блоки без префикса `section_`) |

API `GET /api/content/page/solutions/?lang=*` по-прежнему отдаёт те же ключи `section_*`; адаптер собирает их из новых моделей ([`build_solution_section_blocks`](backend/apps/pages/views.py)).

Legacy-строки `SiteTextBlock` с `page=solutions` и `block` like `section_%` **скрыты** в changelist admin (данные в БД сохранены для отката). Удаление этих строк — отдельный шаг через 1–2 недели без инцидентов.

| Expertise | да | да | да | не проверено | CMS primary, JSON legacy fallback |
| SEO | не проверено | не проверено | не проверено | не проверено | отдельный этап |
| Blog translations | не проверено | не проверено | не проверено | не проверено | отдельный этап |
| Tools translations | да | да | да | не проверено | CMS primary, JSON legacy fallback |

Обновляйте таблицу сразу после завершения соответствующей страницы или секции.
