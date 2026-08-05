# План: иллюстрации книги через админку (`BookPageImage`)

## Цель

Дать возможность в Django Admin загружать **несколько JPG/WebP** (страницы, схемы, примеры для цеха) к модели Book. На `/book` показывать их в блоке «Иллюстративный разворот» вместо CSS-заглушки, если картинки есть.

**Не цель:** WYSIWYG на сайте, правка `previewTitle`/`previewCaption` (уже SiteTextBlock), смена логики обложки, блог, другие страницы.

---

## Принципы выполнения (экономия токенов)

- Минимальный diff: копировать паттерн `PostImage` + `PostImageInline`, не изобретать CMS.
- Не трогать: `SiteTextBlock`, `cms_preview_registry`, обложки в `public/images/book/*`, purchase/download CTA, i18n messages кроме типов API.
- Пока `pages` пуст — **сохранить** текущий `BookSpreadPreview` (CSS) как fallback → сайт не ломается.
- Этапы маленькие; после каждого приложение работает.
- Не писать лишние docs/README; не рефакторить Book/About «заодно».
- Alt: одно поле `alt` (CharField) на MVP; локализованные alt — опционально позже.
- Без lightbox/PDF на MVP.

---

## Текущее состояние

| Слой | Факт |
|------|------|
| UI разворота | `BookSpreadPreview` — декоративные полоски, **без** `<Image>` |
| Подписи | CMS `book` / `preview` → `previewTitle`, `previewCaption` |
| Обложка | Хардкод `localizedBookCovers` в `book/page.tsx` (+ поле `Book.cover_image` в API, на UI почти не используется) |
| Аналог в блоге | `blog.PostImage` + `PostImageInline` в admin |

---

## Модель (MVP)

```text
BookPageImage
├── book       FK(Book, related_name="page_images", CASCADE)
├── image      ImageField(upload_to="book/pages/")
├── order      PositiveIntegerField(default=0)
├── alt        CharField(max_length=255, blank=True)
├── is_active  BooleanField(default=True)
└── created_at DateTimeField(auto_now_add=True)
```

Meta: `ordering = ["order", "id"]`, `db_table` в стиле `pages_*`.

Файлы: `MEDIA/book/pages/` (не `frontend/public`).

---

## Этапы

### Этап 1 — Backend: модель + admin

**Файлы:** `backend/apps/pages/models.py`, `admin.py`, новая migration.

1. Добавить `BookPageImage`.
2. `BookPageImageInline(TabularInline)`: `extra=1`, поля `image`, `order`, `alt`, `is_active`.
3. `BookAdmin.inlines = [BookPageImageInline]`.
4. `help_text` у `image`: рекомендуемое соотношение ~3:2 или 16:10, ширина 1600–2000 px, макс. ~8–12 шт. на книгу (текстом, без жёсткой валидации на MVP).

**Не трогать:** поля Book (`title_*`, `cover_image`, …).

**Проверка:** Admin → Book → inline «добавить» → сохранить → файл в media.

---

### Этап 2 — API

**Файлы:** `serializers.py`, при необходимости `views.py` (только если нужен `lang` в context — как сейчас).

1. `BookPageImageSerializer`: `id`, `image` (URL), `order`, `alt`.
2. В `BookSerializer` добавить `pages` (SerializerMethodField или nested):
   - фильтр `is_active=True`
   - `order_by("order", "id")`
3. `fields` Book: добавить `"pages"`; остальные поля без изменений.

**Проверка:** `GET /api/book/?lang=ru` → `"pages": [...]` (пустой массив, если нет загрузок).

---

### Этап 3 — Frontend types + данные

**Файлы:** `frontend/lib/api-types.ts`, `book/page.tsx` (только прокидка props).

1. Тип `BookPageImage { id; image; order; alt }` (имя поля `image` как в API; если бэкенд отдаёт `image` absolute URL — как у других ImageField).
2. В интерфейсе `Book` добавить `pages?: BookPageImage[]`.
3. На странице: `const pages = book?.pages ?? []` → передать в preview-компонент.

**Не трогать:** `localizedBookCovers`, CmsText для preview title/caption.

---

### Этап 4 — UI: карусель / галерея с fallback

**Файлы:** `frontend/components/BookSpreadPreview.tsx` (расширить props), вызов в `book/page.tsx`.

Props (минимально):

```ts
type Props = {
  title: ReactNode;
  caption: ReactNode;
  images?: { src: string; alt: string }[];
};
```

Поведение:

| `images` | UI |
|----------|-----|
| отсутствует / `length === 0` | **текущий** CSS-разворот (без регрессии) |
| 1+ | один крупный кадр + точки/кнопки prev-next (простой client state) |

Сохранить: `previewTitle` / `previewCaption` как сейчас через `bookCms('preview', …)`.

Стили: вписаться в тёмную карточку (`border-border`, `rounded-lg`); не ломать сетку `lg:grid-cols-2` рядом с authority.

**Проверка:** без картинок в admin — сайт как раньше; с 2–3 JPG — карусель на `/ru/book`.

---

### Этап 5 (опционально, отдельная сессия)

- Локализованный `alt_en/ru/lv`
- Лимит размера файла / числа страниц в `clean()`
- Lightbox по клику
- Подключить `Book.cover_image` из API вместо хардкода `public` (отдельная задача, не смешивать)

---

## Что не делать

- Не класть развороты в `frontend/public/images/book/` как основной путь (только media + API).
- Не хранить URL картинок в `SiteTextBlock`.
- Не удалять CSS-fallback до стабильной работы API.
- Не менять маршруты, SEO metadata, purchase/download.
- Не рефакторить `PostImage` «для единообразия».

---

## Критерии приёмки

- [ ] В Admin у Book можно загрузить несколько страниц, задать порядок, отключить `is_active`
- [ ] API `/api/book/` возвращает `pages` без поломки существующих полей
- [ ] Пустой `pages` → UI идентичен текущему развороту
- [ ] Непустой `pages` → картинки видны на `/book`, подпись CMS на месте
- [ ] `npm run build` / существующие тесты pages не краснеют из‑за serializer

---

## Порядок работ одной сессии (MVP = этапы 1–4)

```text
1 model+admin → 2 serializer → 3 types+page props → 4 BookSpreadPreview
```

Откат: удалить inline-записи / migration reverse; фронт без `pages` снова рисует CSS.

---

## Ссылки на код

| Назначение | Путь |
|------------|------|
| Book model / admin | `backend/apps/pages/models.py`, `admin.py` |
| Book API | `backend/apps/pages/serializers.py`, `views.py` |
| Паттерн картинок | `backend/apps/blog/models.py` → `PostImage` |
| Страница книги | `frontend/app/[locale]/book/page.tsx` |
| Разворот | `frontend/components/BookSpreadPreview.tsx` |
| Типы | `frontend/lib/api-types.ts` |
