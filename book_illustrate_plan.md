# План: иллюстрации книги через админку (`BookPageImage`)

## Цель

В Django Admin загружать **несколько JPG/WebP** к модели Book. На `/book` показывать их в блоке «Иллюстративный разворот» вместо CSS-заглушки, если картинки есть.

**Не цель:** WYSIWYG на сайте, правка `previewTitle`/`previewCaption` (SiteTextBlock), смена логики обложки, блог, другие страницы.

---

## Статус (факт в репозитории)

| Этап | Статус | Что есть |
|------|--------|----------|
| 1 Backend model+admin | **готово** | `BookPageImage`, inline в `BookAdmin`, migrations `0047`→`0048` |
| 2 API `pages` | **готово** | `BookPageImageSerializer` + `BookSerializer.pages` |
| 3 Frontend types+props | **готово** | `api-types.ts`, прокидка в `book/page.tsx` |
| 4 UI карусель + CSS fallback | **готово** | `BookSpreadPreview`: карусель / `DecorativeSpread` |
| 5a alt i18n | **готово** | `alt_en` / `alt_ru` / `alt_lv`, API отдаёт одно `alt` по `lang` |
| 5b лимиты в `clean()` | **готово** | макс. 12 шт., 5 MB на файл |
| 5c lightbox | **готово** | `<dialog>` в карусели |
| 5d `Book.cover_image` вместо хардкода | **не делать здесь** | отдельная задача |
| Контент (загрузка JPG) | **осталось** | данные в Admin, не код |
| Smoke / тест API | **желательно** | см. «Оставшиеся задачи» |

Пока `pages` пуст — UI рисует CSS-разворот → сайт не ломается.

---

## Принципы (экономия токенов)

- Не трогать без нужды: `SiteTextBlock`, `cms_preview_registry`, `public/images/book/*`, purchase/download CTA, маршруты, SEO.
- Не рефакторить Book/About/PostImage «заодно».
- Не писать лишние docs/README.
- Дальше — только мелкие безопасные доработки из списка ниже; не расширять UI.

---

## Модель (как в коде)

```text
BookPageImage
├── book       FK(Book, related_name="page_images", CASCADE)
├── image      ImageField(upload_to="book/pages/")  # MEDIA, не public/
├── order      PositiveIntegerField(default=0)
├── alt_en / alt_ru / alt_lv   CharField(blank=True)
├── is_active  BooleanField(default=True)
└── created_at DateTimeField(auto_now_add=True)

Meta: ordering=["order","id"], db_table="pages_book_page_images"
clean(): ≤12 изображений на книгу, ≤5 MB на файл
```

API-контракт (стабильный, не ломать):

```text
GET /api/book/?lang=ru
→ pages: [{ id, image (absolute URL|null), order, alt }, ...]
  только is_active=True, order_by(order, id)
  alt = локаль или fallback на alt_en
```

Admin inline: `image`, `order`, `alt_en`, `alt_ru`, `alt_lv`, `is_active`.

---

## Текущее состояние UI / данные

| Слой | Факт |
|------|------|
| Разворот | `BookSpreadPreview`: карусель + lightbox **или** CSS-заглушка |
| Подписи | CMS `book` / `preview` → `previewTitle`, `previewCaption` |
| Обложка на `/book` | хардкод `localizedBookCovers` в `book/page.tsx` (`Book.cover_image` в API есть, на UI почти не используется) |
| Media | файлы в `MEDIA/book/pages/`; Next: `unoptimized` для `http(s)` URL |

---

## Оставшиеся задачи (коротко)

Делать по одной; каждая должна оставлять приложение рабочим.

### A. Контент (без кода) — приоритет

1. Admin → Book → загрузить 2–3 JPG разворотов, выставить `order`, заполнить `alt_*`.
2. Проверить `/en/book`, `/ru/book`, `/lv/book`: карусель, подписи CMS, lightbox.
3. Проверить fallback: снять `is_active` у всех → снова CSS-разворот.

### B. Минимальный API-тест (опционально, ~30 строк)

Файл: `backend/apps/pages/tests.py` (или рядом).

- Создать Book + 2 `BookPageImage` (одна `is_active=False`).
- `GET /api/book/?lang=ru` → в `pages` только активная; порядок; `alt` из `alt_ru` (или en-fallback).
- Существующие поля Book (`title`, `year`, …) на месте.

Не трогать фронт и схему ответа.

### C. `prefetch_related` (опционально, 1 строка)

В `BookView.get_object`: `Book.objects.prefetch_related("page_images").first()`.

Не меняет JSON; снижает лишние запросы.

### D. Прод / media (проверка, не рефакторинг)

- Убедиться, что absolute URL из API открывается с фронта (локально `localhost` уже в `remotePatterns`; при `unoptimized` для http — обычно ок).
- Если media на другом хосте (Cloudinary и т.п.) — только добавить hostname в `next.config.ts` `remotePatterns`, без смены логики карусели.

### E. Отдельно позже (не смешивать)

- Подключить `Book.cover_image` из API вместо `localizedBookCovers` / static в `public/images/book/` (нужен fallback на текущие JPG, чтобы не сломать локали).
- Клавиатура ←/→ в карусели, PDF — вне scope.

---

## Что не делать

- Не класть развороты в `frontend/public/images/book/` как основной путь.
- Не хранить URL картинок в `SiteTextBlock`.
- Не удалять CSS-fallback.
- Не менять маршруты, SEO metadata, purchase/download.
- Не рефакторить `PostImage`.
- Не трогать обложку в рамках этой фичи.

---

## Критерии приёмки

- [x] Admin у Book: несколько страниц, порядок, `is_active`
- [x] API `/api/book/` отдаёт `pages`, старые поля целы
- [x] Пустой `pages` → CSS-разворот как раньше
- [x] Непустой `pages` → карусель + lightbox; подпись CMS на месте
- [x] alt по `lang` (en/ru/lv) с fallback на en
- [x] лимиты 12 шт. / 5 MB в `clean()`
- [ ] В Admin реально загружены картинки; визуально ок на `/en|/ru|/lv/book`
- [ ] (желательно) тест на `pages` в `tests.py`
- [ ] `npm run build` / тесты pages зелёные после любых правок B–D

---

## Откат

Удалить inline-записи в Admin → фронт снова CSS. Migration reverse только если откатывают всю фичу (осторожно на проде с данными).

---

## Ссылки на код

| Назначение | Путь |
|------------|------|
| Model | `backend/apps/pages/models.py` → `BookPageImage` |
| Admin | `backend/apps/pages/admin.py` → `BookPageImageInline` |
| Migrations | `0047_book_page_image`, `0048_book_page_image_alt_i18n` |
| API | `serializers.py`, `views.py` → `BookView` |
| Типы | `frontend/lib/api-types.ts` |
| Страница | `frontend/app/[locale]/book/page.tsx` |
| Разворот | `frontend/components/BookSpreadPreview.tsx` |
| Паттерн | `backend/apps/blog/models.py` → `PostImage` |
