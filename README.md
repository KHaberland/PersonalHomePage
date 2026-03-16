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
