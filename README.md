# Personal Home Page — Oleg Suvorov IWE

Персональный сайт инженера по сварке: портфолио, технический блог, инженерные калькуляторы и публикация книги.

## Структура проекта (монорепозиторий)

```
PersonalHomePage/
├── frontend/     # Next.js (Фаза 2)
├── backend/      # Django REST API (Фаза 1)
├── Plan.md       # План разработки
└── docker-compose.yml
```

## Быстрый старт

### Переменные окружения

```powershell
Copy-Item .env.example .env
# Отредактируйте .env и заполните значения
```

**Важно:** файл `.env` содержит секреты и **не попадает в git** (см. `.gitignore`).
В репозиторий коммитится только шаблон `.env.example`. Pre-commit hook
`block-env-commit` дополнительно блокирует случайный коммит env-файлов.

Проверка перед коммитом:

```powershell
git status
git diff --cached --name-only
# .env в списке быть не должен
```

### Docker (PostgreSQL)

```powershell
docker-compose up -d
```

### Pre-commit hooks

```powershell
pip install pre-commit
pre-commit install
```

## Разработка

- **Backend:** Python 3.11+, Django, Black, flake8
- **Frontend:** Node.js 20+, Next.js, ESLint, Prettier

Подробный план — см. [Plan.md](Plan.md).

## Django Admin ↔ Site (навигация редактора)

Двусторонние ссылки между админкой и сайтом ускоряют поиск блока для правки текста. Подробный план: [admin_plan.md](admin_plan.md).

### Admin → Site (колонка «На сайте»)

В списке **Pages → Site text blocks** и на форме записи — ссылка открывает страницу на сайте с якорем на секцию.

Backend читает из `.env` (или `backend/.env`):

- `FRONTEND_BASE_URL` — база URL сайта (по умолчанию `http://localhost:3000`)
- `CMS_PREVIEW_LOCALE` — locale в превью (`ru` по умолчанию)

### Site → Admin (badges на главной)

При локальной разработке можно включить подсказки на CMS-текстах главной страницы.

```powershell
# frontend/.env.local (создайте из корневого .env.example)
NEXT_PUBLIC_CMS_EDIT=1
NEXT_PUBLIC_ADMIN_URL=http://localhost:8000
```

Перезапустите `npm run dev`. На `http://localhost:3000/ru/` при наведении на текст — badge → Django Admin.
На production и без флага badges **не показываются**.

### Запуск для редактирования

```powershell
# Терминал 1 — backend + admin
Set-Location backend
.\.venv\Scripts\Activate.ps1
python manage.py runserver

# Терминал 2 — frontend
Set-Location frontend
npm run dev
```

Админка: http://localhost:8000/admin/
