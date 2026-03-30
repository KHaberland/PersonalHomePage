# Структура проекта Personal Home Page

Персональный сайт инженера по сварке (IWE): портфолио, технический блог, инженерные калькуляторы.

---

## Обзор

| Компонент | Технологии |
|-----------|------------|
| **Frontend** | Next.js 16, React 19, Tailwind CSS 4, next-intl |
| **Backend** | Django, Django REST Framework, JWT, CKEditor5 |
| **Языки** | TypeScript, Python 3.11+ |

---

## Корневая структура

```
PersonalHomePage/
├── .env.example          # Пример переменных окружения
├── .gitignore
├── .pre-commit-config.yaml
├── docker-compose.yml    # PostgreSQL, при необходимости
├── Dockerfile
├── README.md
├── CONTENT.md
├── Plan.md
├── backend/              # Django REST API
└── frontend/             # Next.js
```

---

## Frontend (`frontend/`)

### Конфигурация

| Файл | Назначение |
|------|------------|
| `package.json` | Зависимости: Next.js 16, React 19, next-intl |
| `next.config.ts` | Конфиг Next.js, плагин next-intl |
| `tsconfig.json` | TypeScript, алиас `@/*` → `./*` |
| `postcss.config.mjs` | PostCSS, Tailwind |
| `eslint.config.mjs` | ESLint |
| `proxy.ts` | Middleware для локализации (next-intl) |

### Маршруты (`app/`)

```
app/
├── layout.tsx            # Корневой layout, SEO
├── globals.css            # Стили, CSS-переменные, Tailwind
├── robots.ts              # robots.txt
├── sitemap.ts             # sitemap.xml
└── [locale]/              # Локали: en, ru, lv
    ├── layout.tsx         # Layout с Header, Footer
    ├── page.tsx           # Главная
    ├── about/page.tsx     # Обо мне
    ├── blog/
    │   ├── page.tsx       # Список статей
    │   └── [slug]/page.tsx # Статья
    ├── book/page.tsx      # Книга
    ├── contact/page.tsx   # Контакты
    ├── experience/page.tsx # Опыт
    ├── knowledge/page.tsx  # База знаний
    └── tools/
        ├── page.tsx      # Калькуляторы
        └── [slug]/page.tsx # Конкретный калькулятор
```

### Компоненты (`components/`)

```
components/
├── Header.tsx             # Шапка, навигация
├── Footer.tsx             # Подвал
├── Hero.tsx               # Hero-блок на главной (видео, заголовок)
├── Layout.tsx             # Обёртка страницы
├── LanguageSwitcher.tsx   # Переключатель языка
└── calculators/
    ├── index.tsx          # Роутинг калькуляторов
    ├── HeatInputCalculator.tsx
    ├── GasFlowCalculator.tsx
    ├── ShieldingGasCalculator.tsx
    ├── GasCuttingCalculator.tsx
    ├── WeldingCostCalculator.tsx
    └── WeldingParametersCalculator.tsx
```

### Библиотека (`lib/`)

```
lib/
├── api.ts          # API-клиент (fetch к Django)
├── api-types.ts    # Типы для API-ответов
├── metadata.ts     # createPageMetadata, createArticleMetadata
└── seo.ts         # getBaseUrl, getCanonicalUrl, SITE_NAME
```

### Интернационализация

```
i18n/
├── request.ts      # Конфиг next-intl (сервер)
├── routing.ts      # Маршрутизация локалей
└── navigation.ts   # Link, useRouter с учётом locale

messages/
├── en.json
├── ru.json
└── lv.json
```

### Статика (`public/`)

```
public/
├── Video/
│   └── welding-bg.MP4    # Фон главной
├── images/
│   └── photos/
│       ├── author.jpg    # Фото в «Обо мне»
│       └── author01.jpg
└── diplomas/             # PDF дипломов (Bakalaura_diploms01.pdf и др.)
```

---

## Backend (`backend/`)

### Конфигурация

```
backend/
├── manage.py
├── requirements.txt
├── pyproject.toml        # Black
├── .flake8
└── config/
    ├── settings.py       # Django settings
    ├── urls.py           # Корневые URL
    ├── wsgi.py
    └── asgi.py
```

### URL-структура (`config/urls.py`)

| Префикс | Приложение | Описание |
|---------|------------|----------|
| `admin/` | Django Admin | Админка |
| `ckeditor5/` | CKEditor5 | Редактор контента |
| `api/` | users | JWT login, refresh |
| `api/` | blog | Посты, категории, теги |
| `api/` | pages | About, Experience, Book, Contact |
| `api/` | calculators | Список калькуляторов, расчёты |
| `api/` | media | Загрузка файлов |

### Приложения (`apps/`)

#### users
- `models.py`, `views.py`, `serializers.py`, `urls.py`, `admin.py`
- JWT-аутентификация (TokenObtainPair, TokenRefresh)
- `management/commands/create_superuser.py`

#### blog
- Модели: Post, Category, Tag, Author
- API: `/posts/`, `/posts/<slug>/`, `/categories/`, `/tags/`
- `filters.py` — фильтрация по категории, тегу
- Мультиязычность через параметр `lang`

#### pages
- Модели: About, Experience, Book, Contact
- API: `/about/`, `/experience/`, `/book/`, `/contact/`
- Параметр `lang` для локализации

#### calculators
- Модели: Calculator
- API: `/tools/` — список калькуляторов
- Расчеты: `/calculate/heat-input/`, `/calculate/gas-flow/`, `/calculate/shielding-gas/`, `/calculate/gas-cutting/`, `/calculate/welding-cost/`, `/calculate/welding-parameters/`
- `services.py` — бизнес-логика расчётов

#### media
- `urls.py`: `/api/upload` — загрузка файлов

### Миграции

```
apps/users/migrations/
apps/blog/migrations/       # 0001–0004
apps/pages/migrations/      # 0001–0002
apps/calculators/migrations/ # 0001–0002
```

---

## API endpoints

### Blog
- `GET /api/posts/` — список постов (params: lang, category_slug, tag, page)
- `GET /api/posts/<slug>/` — пост
- `GET /api/categories/` — категории
- `GET /api/tags/` — теги

### Pages
- `GET /api/about/` — о себе
- `GET /api/experience/` — опыт
- `GET /api/book/` — книга
- `GET /api/contact/` — контакты

### Calculators
- `GET /api/tools/` — список калькуляторов
- `POST /api/calculate/heat-input/` — тепловложение
- `POST /api/calculate/gas-flow/` — расход газа
- `POST /api/calculate/shielding-gas/` — защитный газ
- `POST /api/calculate/gas-cutting/` — газовая резка
- `POST /api/calculate/welding-cost/` — стоимость сварки
- `POST /api/calculate/welding-parameters/` — параметры сварки

### Users
- `POST /api/login` — JWT токен
- `POST /api/refresh` — обновление токена

---

## Переменные окружения

- `NEXT_PUBLIC_API_URL` — URL Django API (по умолчанию `http://localhost:8000/api`)
- `NEXT_PUBLIC_HERO_VIDEO_URL` — URL видео Hero (по умолчанию `/Video/welding-bg.MP4`)
- `DATABASE_URL` — PostgreSQL (опционально)
- `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS` — Django

---

## Быстрый старт

```powershell
# Backend
cd backend
python -m venv venv
.\venv\Scripts\Activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend
cd frontend
npm install
npm run dev
```

Сайт: http://localhost:3000
API: http://localhost:8000/api
