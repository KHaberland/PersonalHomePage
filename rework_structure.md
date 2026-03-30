# Структура программы (после доработки сайта)

Документ описывает архитектуру репозитория **PersonalHomePage**: фронтенд (Next.js), бэкенд (Django REST), связи между слоями и точки расширения.

---

## 1. Общая схема

```
┌─────────────────────────────────────────────────────────────┐
│  Браузер                                                     │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│  Next.js 16 (frontend/)                                      │
│  • Локали: en, ru, lv (next-intl)                            │
│  • Статика: public/ (видео Hero, фото, дипломы)              │
│  • Клиент API → NEXT_PUBLIC_API_URL (Django /api/...)        │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP JSON / медиа URL
┌──────────────────────────▼──────────────────────────────────┐
│  Django + DRF (backend/)                                     │
│  • Админка: /admin/                                         │
│  • REST: /api/…                                             │
│  • CKEditor 5: /ckeditor5/                                   │
│  • Медиа (DEBUG): отдача файлов из MEDIA_ROOT               │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Корень репозитория

| Путь | Назначение |
|------|------------|
| `frontend/` | Приложение Next.js — публичный сайт |
| `backend/` | Проект Django — API, админка, расчёты калькуляторов |
| `rework_plan.md` | План доработок UI/контента |
| `site_structure.md` | Спецификация структуры сайта (если есть) |
| `rework_structure.md` | Этот файл — карта кода |

---

## 3. Фронтенд (`frontend/`)

### 3.1. Маршруты приложения (`app/`)

| Путь | Файл | Содержание |
|------|------|------------|
| Корень локали | `[locale]/page.tsx` | Главная: Hero, обо мне, компетенции, услуги, кейсы, опыт, книга, tools, блог, CTA |
| О проекте | `[locale]/about/page.tsx` | Биография, фото, дипломы, галерея |
| Опыт | `[locale]/experience/page.tsx` | Таймлайн, проекты, отзывы, фото |
| Книга | `[locale]/book/page.tsx` | Обложка, описание, CTA покупки/email |
| Контакты | `[locale]/contact/page.tsx` | Форма (mailto), ссылки, карта |
| Блог | `[locale]/blog/page.tsx`, `[slug]/page.tsx` | Список и статья |
| База знаний | `[locale]/knowledge/page.tsx` | Статьи по категориям → ссылки в блог |
| Инструменты | `[locale]/tools/page.tsx`, `[slug]/page.tsx` | Список калькуляторов и страница расчёта |
| Глобальные стили | `globals.css` | Тема, Hero overlay, секция `.section-tools` |
| SEO | `sitemap.ts`, `robots.ts` | Карта сайта, robots |

Локаль задаётся сегментом URL: `/en`, `/ru`, `/lv`.

### 3.2. Компоненты (`components/`)

| Компонент / папка | Роль |
|-------------------|------|
| `Layout.tsx` | Общая оболочка страниц |
| `Header.tsx` | Навигация, подменю «Экспертиза», переключатель языка |
| `Footer.tsx` | Ссылки, контакты, соцсети |
| `Hero.tsx` | Видео-фон, заголовки, CTA |
| `CompetencyCard.tsx` | Карточки компетенций / услуг / кейсов (опционально `imageSrc`) |
| `ContactForm.tsx` | Отправка через `mailto:` |
| `LanguageSwitcher.tsx` | Смена локали |
| `icons/` | SVG-иконки для компетенций и услуг (`competency.tsx`, `services.tsx`, `index.ts`) |
| `calculators/` | UI калькуляторов (heat input, gas flow, shielding gas, и т.д.) |

### 3.3. Локализация и навигация

| Путь | Назначение |
|------|------------|
| `messages/en.json`, `ru.json`, `lv.json` | Все пользовательские строки по неймспейсам (`home`, `about`, `common`, …) |
| `i18n/routing.ts` | Поддерживаемые локали |
| `i18n/navigation.ts` | Локализованный `Link` |

### 3.4. Данные и типы

| Путь | Назначение |
|------|------------|
| `lib/api.ts` | Функции `fetch` к Django: посты, about, book, contact, experience, tools, расчёты |
| `lib/api-types.ts` | TypeScript-типы ответов API |
| `lib/metadata.ts` | `generateMetadata` для страниц |

### 3.5. Статика (`public/`)

- `Video/` — фон Hero (например `welding-bg.MP4`)
- `images/photos/` — фото автора, обложки-заглушки, материалы для кейсов
- `diplomas/` — PDF для страницы About

### 3.6. Конфигурация

- `next.config.ts` — параметры Next.js
- `proxy.ts` — прокси (если используется)

Переменные окружения (типичные): `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_HERO_VIDEO_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_MAP_EMBED_URL`, `NEXT_PUBLIC_BOOK_PURCHASE_URL`, `NEXT_PUBLIC_BOOK_DOWNLOAD_URL`.

---

## 4. Бэкенд (`backend/`)

### 4.1. Точка входа

| Файл | Роль |
|------|------|
| `manage.py` | CLI Django |
| `config/settings.py` | Настройки, `INSTALLED_APPS`, CORS, БД |
| `config/urls.py` | Маршруты: `admin/`, `api/`, `ckeditor5/`, медиа (в DEBUG) |

### 4.2. Приложения Django (`apps/`)

#### `apps.users`

- Модель пользователя (роли, в т.ч. admin).
- JWT: `POST /api/login`, `POST /api/refresh` — для загрузки медиа и админ-сценариев.
- Команда `create_superuser` — быстрый суперпользователь для разработки.

#### `apps.blog`

- Модели: автор, категория, тег, пост (контент через CKEditor 5).
- API: `GET /api/posts/`, `GET /api/posts/<slug>/`, категории, теги.
- Админка: редактирование статей и связанных сущностей.

#### `apps.pages`

- Модели: **About**, **Experience** (таймлайн), **Book**, **Contact** (одна запись контактов).
- API: `/api/about/`, `/api/experience/`, `/api/book/`, `/api/contact/`.
- Контент главной и страниц «О себе / книга» может подтягиваться отсюда; часть текстов дублируется fallback’ами в `messages/*.json` на фронте.

#### `apps.calculators`

- Модель **Calculator** (список инструментов для фронта).
- API списка: `GET /api/tools/`.
- Эндпоинты расчётов: `POST /api/calculate/heat-input/`, `gas-flow/`, `shielding-gas/`, `gas-cutting/`, `welding-cost/`, `welding-parameters/` — серверная логика в `services.py` / `views.py`.

#### `apps.media`

- `POST /api/upload` — загрузка изображений (JWT), превью в `utils.py`.

### 4.3. Админка

- URL: **`/admin/`** (Django Admin).
- Зарегистрированы модели из `pages`, `blog`, `calculators`, `users`.

---

## 5. Потоки данных (кратко)

1. **Главная и страницы контента** — серверные компоненты Next вызывают `lib/api.ts` → Django REST → HTML с данными.
2. **Блог** — посты и категории с API; тексты SEO и часть UI — из `messages`.
3. **Калькуляторы** — список инструментов с API; расчёты: POST на `/api/calculate/...` из компонентов в `components/calculators/`.
4. **Форма контактов** — без бэкенда писем: открытие почтового клиента (`mailto`).
5. **Медиа** — URL картинок постов/обложек с бэкенда (`MEDIA_URL`) или абсолютные URL; локальные файлы — из `frontend/public/`.

---

## 6. Зависимости между слоями

```
messages/*.json  ──────────────────────────► UI-строки (всегда)
       │
       └── дополняет / заменяет fallback ───► API pages (about, book, …)

lib/api.ts ◄── NEXT_PUBLIC_API_URL ──► Django REST
```

---

## 7. Где что менять при доработках

| Задача | Где править |
|--------|-------------|
| Тексты главной без API | `frontend/messages/*.json` → секция `home` |
| Шапка / подвал | `Header.tsx`, `Footer.tsx`, `common` в messages |
| Стили Hero и секции калькуляторов | `globals.css`, `Hero.tsx`, `[locale]/page.tsx` |
| Новая статья | Django Admin → Blog → Post; при необходимости категории в `knowledge/page.tsx` |
| Новый калькулятор | Backend: модель + view + url + сервис; Frontend: страница `[slug]` + компонент в `calculators/` |
| Кейсы только из переводов | Как сейчас: `page.tsx` + `home.*` в messages; с админки — потребовались бы новые модели и API (см. `rework_plan.md`, фаза 13) |

---

*Документ отражает состояние кодовой базы на момент составления; при добавлении приложений или маршрутов имеет смысл обновить разделы 3–4.*
