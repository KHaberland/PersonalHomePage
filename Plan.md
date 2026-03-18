# План разработки персонального сайта инженера по сварке

## Обзор проекта

**Цель:** Создать профессиональный персональный сайт инженера по сварке Oleg Suvorov, объединяющий портфолио, технический блог, инженерные калькуляторы и публикацию книги.

**Основные функции:**
- Профессиональное портфолио
- Технический блог
- Демонстрация инженерной экспертизы
- Публикация книги
- Инженерные калькуляторы
- Формирование личного профессионального бренда

---

## Фаза 0: Подготовка и планирование

### 0.1 Инициализация проекта
- [x] Создать репозиторий Git
- [x] Настроить структуру монорепозитория (frontend + backend)
- [x] Создать `.gitignore` для Python и Node.js
- [x] Настроить переменные окружения (`.env.example`)

### 0.2 Инфраструктура разработки
- [x] Установить и настроить Docker (опционально) для локальной разработки
- [x] Настроить линтеры: ESLint, Prettier (frontend), Black, flake8 (backend)
- [x] Настроить pre-commit hooks

---

## Фаза 1: Backend (Django REST API)

### 1.1 Инициализация Django-проекта
- [x] Создать виртуальное окружение Python
- [x] Установить зависимости: Django, Django REST Framework, django-cors-headers, psycopg2-binary, Pillow, django-storages, django-filter
- [x] Создать проект `config/` с настройками
- [x] Настроить PostgreSQL (локально и для production)
- [x] Настроить CORS для frontend

### 1.2 Приложение Users
- [x] Создать приложение `apps/users`
- [x] Модель User с полями: id, username, email, password, role, created_at
- [x] JWT-аутентификация для API (djangorestframework-simplejwt)
- [x] Эндпоинты: POST /api/login, POST /api/refresh

### 1.3 Приложение Blog
- [x] Создать приложение `apps/blog`
- [x] Модель Author: id, name, bio, photo
- [x] Модель Category: id, name_en, name_ru, name_lv, slug
- [x] Модель Tag: id, name, slug
- [x] Модель Post: id, title_*, content_*, excerpt_*, author_id, category_id, slug, cover_image, status, published_at, created_at, updated_at
- [x] Модель PostTag (M2M)
- [x] Модель Image: id, post_id, image_url, caption, created_at
- [x] Сериализаторы для всех моделей
- [x] API: GET /api/posts, GET /api/posts/{slug}, GET /api/categories, GET /api/tags
- [x] Фильтрация по категории, тегу, языку
- [x] Пагинация

### 1.4 Приложение Pages
- [x] Создать приложение `apps/pages`
- [x] Модели для статического контента: About, Experience, Book, Contact
- [x] API: GET /api/about, GET /api/experience, GET /api/book
- [x] Поддержка мультиязычности в ответах

### 1.5 Приложение Calculators
- [x] Создать приложение `apps/calculators`
- [x] Модель Calculator: id, name, description, slug, created_at
- [x] API: GET /api/tools
- [x] Сервисы расчёта:
  - POST /api/calculate/heat-input
  - POST /api/calculate/gas-flow
  - POST /api/calculate/shielding-gas
  - POST /api/calculate/gas-cutting
  - POST /api/calculate/welding-cost
  - POST /api/calculate/welding-parameters

### 1.6 Media Storage
- [x] Настроить django-storages для Cloudinary или AWS S3
- [x] API: POST /api/upload (для админки)
- [x] Генерация thumbnails для изображений

### 1.7 Django Admin
- [x] Зарегистрировать все модели в admin
- [x] Установить и настроить CKEditor или TinyMCE для редактирования контента
- [x] Кастомизация админки: фильтры, поиск, inline-редактирование
- [x] Управление переводами (поля *_en, *_ru, *_lv)

### 1.8 Миграции и начальные данные
- [x] Создать миграции
- [x] Fixtures для категорий блога (Welding technology, Shielding gases, Welding equipment, Gas cutting, Welding defects)
- [x] Создать суперпользователя

---

## Фаза 2: Frontend (Next.js)

### 2.1 Инициализация Next.js
- [x] Создать проект: `npx create-next-app@latest frontend --typescript --tailwind --app`
- [x] Настроить структуру папок: app/, components/, lib/, styles/
- [x] Настроить Tailwind CSS
- [x] Создать базовые стили (индустриальный дизайн, тёмный фон)

### 2.2 Мультиязычность (i18n)
- [x] Установить next-intl или next-i18next
- [x] Структура URL: /en, /ru, /lv
- [x] Создать папки locales/en, locales/ru, locales/lv
- [x] Файлы переводов для всех страниц и компонентов
- [x] Переключатель языка в Header

### 2.3 API-клиент
- [x] Создать `lib/api.ts` с функциями fetch для всех эндпоинтов
- [x] Обработка ошибок и loading-состояний
- [x] Типы TypeScript для API-ответов

### 2.4 Базовые компоненты
- [ ] **Header**: логотип, навигация, переключатель языка
- [ ] **Footer**: контакты, ссылки на соцсети
- [ ] **Hero**: секция с видео сварки в шапке
- [ ] **Layout**: обёртка с Header и Footer

### 2.5 Страница Home (/)
- [ ] Hero с видео сварки
- [ ] Краткая информация о специалисте
- [ ] Блок ключевых компетенций
- [ ] Краткий опыт (timeline)
- [ ] Карточка книги
- [ ] Карточки инженерных калькуляторов
- [ ] Последние статьи блога (3–5)
- [ ] Контакты

### 2.6 Страница About (/about)
- [ ] Биография
- [ ] Образование
- [ ] Профессиональные квалификации
- [ ] Фотография

### 2.7 Страница Experience (/experience)
- [ ] Timeline профессионального опыта:
  - Elme Messer Gaas — Welding Engineer (2015 — present)
  - BUTS training center — Welding instructor (2013 — 2015)
  - Production experience — Welder (до 2013)

### 2.8 Страница Book (/book)
- [ ] Информация о книге "MAG/MIG welding"
- [ ] Описание: от выбора аппарата до защитного газа и методов сварки
- [ ] Год: 2024
- [ ] Обложка, описание, CTA

### 2.9 Страница Engineering Tools (/tools)
- [ ] Список калькуляторов с карточками:
  - Shielding Gas Calculator
  - Heat Input Calculator
  - Gas Flow Calculator
  - Gas Cutting Calculator
  - Welding Cost Calculator
  - Welding Parameter Calculator
- [ ] Страница каждого калькулятора с формой и расчётами

### 2.10 Компоненты калькуляторов
- [x] **Heat Input Calculator**: voltage, current, travel speed → heat_input = (U × I × 60) / (1000 × speed)
- [x] **Gas Flow Calculator**: flow_rate, welding_time, cylinder_volume
- [x] **Shielding Gas Calculator**
- [x] **Gas Cutting Calculator**
- [x] **Welding Cost Calculator**: wire_price, gas_price, deposition_rate
- [x] **Welding Parameter Calculator**

### 2.11 Страница Welding Knowledge (/knowledge)
- [x] Структура базы знаний:
  - MIG/MAG welding
  - TIG welding
  - Shielding gases
  - Gas cutting
  - Welding metallurgy
  - Welding defects
- [x] Каждый раздел — список статей из блога по категории

### 2.12 Страница Blog (/blog)
- [x] Список статей с пагинацией
- [x] Фильтрация по категориям
- [x] Карточки статей: cover_image, title, excerpt, date, category
- [x] Страница статьи /blog/[slug]: title, author, date, category, cover, content, images, tags, related posts

### 2.13 Страница Contact (/contact)
- [ ] Email
- [ ] LinkedIn
- [ ] YouTube
- [ ] Форма обратной связи (опционально)

---

## Фаза 3: SEO и производительность

### 3.1 SEO
- [x] Meta title и meta description для каждой страницы
- [x] Open Graph и Twitter Card
- [x] Alt-текст для всех изображений
- [x] Генерация sitemap.xml
- [x] Файл robots.txt
- [x] Структурированные данные (JSON-LD) для статей

### 3.2 Производительность
- [x] Lazy loading изображений (next/image)
- [x] Оптимизация видео (формат, сжатие)
- [x] Code splitting
- [x] Оптимизация шрифтов

---

## Фаза 4: Дизайн и UX

### 4.1 Визуальный стиль
- [x] Индустриальный стиль, минимализм
- [x] Тёмный фон
- [x] Яркие сварочные акценты (оранжевый, синий)
- [x] Крупные заголовки и фотографии
- [x] Адаптивная вёрстка (mobile-first)

### 4.2 Контент
- [x] Подготовить текст для всех страниц на 3 языках
- [x] Подобрать/создать фотографии (инструкции в CONTENT.md)
- [x] Записать или подобрать видео сварки для Hero (инструкции в CONTENT.md)
- [x] Написать первые статьи блога

---

## Фаза 5: Развёртывание и инфраструктура

### 5.1 Frontend (Vercel)
- [ ] Подключить репозиторий к Vercel
- [ ] Настроить переменные окружения (API_URL)
- [ ] Настроить домен
- [ ] Preview deployments для веток

### 5.2 Backend (DigitalOcean / AWS)
- [ ] Создать Droplet/EC2
- [ ] Установить Python, Nginx, Gunicorn
- [ ] Настроить systemd для Django
- [ ] Настроить Nginx как reverse proxy

### 5.3 База данных
- [ ] PostgreSQL на хостинге (DigitalOcean Managed DB или AWS RDS)
- [ ] Резервное копирование
- [ ] Миграции при деплое

### 5.4 Media Storage
- [ ] Настроить Cloudinary или AWS S3
- [ ] CORS для загрузки
- [ ] CDN для раздачи медиа

### 5.5 Cloudflare
- [ ] Подключить домен к Cloudflare
- [ ] SSL/TLS (HTTPS)
- [ ] Кэширование статики
- [ ] DDoS-защита

### 5.6 CI/CD
- [ ] GitHub Actions для тестов
- [ ] Автодеплой frontend на Vercel
- [ ] Скрипт деплоя backend

---

## Фаза 6: Безопасность и аналитика

### 6.1 Безопасность
- [ ] HTTPS везде
- [ ] Защита админки (сильный пароль, ограничение IP при необходимости)
- [ ] Rate limiting для API
- [ ] Регулярные обновления зависимостей (Dependabot)

### 6.2 Аналитика
- [ ] Подключить Google Analytics 4
- [ ] Настроить Google Search Console
- [ ] Отслеживание конверсий (клики на контакты, калькуляторы)

---

## Структура проекта (итоговая)

```
Personal-Home-Page/
├── frontend/                 # Next.js
│   ├── app/
│   │   ├── [lang]/
│   │   │   ├── page.tsx      # Home
│   │   │   ├── about/
│   │   │   ├── experience/
│   │   │   ├── book/
│   │   │   ├── tools/
│   │   │   ├── knowledge/
│   │   │   ├── blog/
│   │   │   └── contact/
│   │   └── layout.tsx
│   ├── components/
│   ├── lib/
│   ├── locales/
│   └── styles/
├── backend/                  # Django
│   ├── config/
│   ├── apps/
│   │   ├── users/
│   │   ├── blog/
│   │   ├── pages/
│   │   └── calculators/
│   ├── media/
│   └── requirements.txt
└── Plan.md
```

---

## Оценка сроков (ориентировочно)

| Фаза | Срок |
|------|------|
| Фаза 0: Подготовка | 1–2 дня |
| Фаза 1: Backend | 2–3 недели |
| Фаза 2: Frontend | 3–4 недели |
| Фаза 3: SEO | 3–5 дней |
| Фаза 4: Дизайн | 1–2 недели |
| Фаза 5: Деплой | 1 неделя |
| Фаза 6: Безопасность и аналитика | 2–3 дня |

**Общая оценка:** 8–12 недель при работе в одиночку.

---

## Приоритеты для MVP

Для первой версии сайта рекомендуется:

1. **Обязательно:** Home, About, Experience, Book, Contact, Blog (базовый), 2–3 калькулятора
2. **Можно отложить:** Полный набор калькуляторов, Welding Knowledge как отдельный раздел
3. **Позже:** Расширенная аналитика, A/B-тесты

---

## Чек-лист перед запуском

- [ ] Все страницы работают на 3 языках
- [ ] Блог отображает статьи с бэкенда
- [ ] Калькуляторы производят корректные расчёты
- [ ] Админка позволяет добавлять/редактировать контент
- [ ] SEO-метатеги настроены
- [ ] Сайт быстрый (Lighthouse > 80)
- [ ] HTTPS включён
- [ ] Аналитика подключена
