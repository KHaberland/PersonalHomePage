# Backend (Django REST API)

Django REST API для персонального сайта инженера по сварке.

## Структура

```
backend/
├── config/          # Настройки Django
├── apps/
│   ├── users/       # JWT-аутентификация
│   ├── blog/        # Блог, посты, категории, теги
│   └── pages/       # About, Experience, Book, Contact
├── media/
└── requirements.txt
```

## Локальная разработка

```powershell
# Создать виртуальное окружение
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Установить зависимости
pip install -r requirements.txt

# Миграции (без Docker: SQLite; с Docker: PostgreSQL)
python manage.py migrate

# Создать суперпользователя
python manage.py createsuperuser

# Запуск сервера
python manage.py runserver
```

## API

- **POST /api/login** — JWT (username, password)
- **POST /api/refresh** — обновление токена
- **GET /api/posts** — список постов (?lang=en|ru|lv, ?category_slug=, ?tag_slug=)
- **GET /api/posts/{slug}** — пост по slug
- **GET /api/categories** — категории
- **GET /api/tags** — теги
- **GET /api/about** — страница About
- **GET /api/experience** — опыт
- **GET /api/book** — информация о книге
- **GET /api/contact** — контакты

## Без Docker

По умолчанию используется SQLite. Убедитесь, что `DATABASE_URL` не задан (или пустой).

## С Docker (PostgreSQL)

```powershell
docker compose up -d db
# Установите DATABASE_URL=postgresql://postgres:postgres@localhost:5432/personal_homepage_db
```

## Линтеры

```powershell
black .
flake8 .
```

## Django Admin ↔ Site

Ссылки «На сайте» в **Site text blocks** строятся из `FRONTEND_BASE_URL` и `CMS_PREVIEW_LOCALE` в `.env` (см. корневой `.env.example`).

```powershell
Copy-Item ..\.env.example .env
# или скопируйте FRONTEND_BASE_URL и CMS_PREVIEW_LOCALE в backend/.env
```

Пример превью: `home` / `entry_paths` → `http://localhost:3000/ru/#user-paths`.

Badges Site → Admin настраиваются во **frontend** (`NEXT_PUBLIC_CMS_EDIT=1` в `frontend/.env.local`). Краткая инструкция — в [README.md](../README.md#django-admin--site-навигация-редактора) и [admin_plan.md](../admin_plan.md).
