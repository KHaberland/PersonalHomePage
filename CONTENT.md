# Руководство по контенту (4.2)

Инструкции по подготовке медиа-контента для персонального сайта.

---

## 1. Тексты на 3 языках

**Статус:** ✅ Выполнено

- Тексты для страниц About, Experience, Book, Contact добавлены через миграции бэкенда
- UI-переводы в `frontend/messages/` (en, ru, lv)
- Первые 3 статьи блога созданы (Shielding gases, Heat input, Equipment)

**Редактирование:** Через Django Admin (`/admin/`) — модели Pages (About, Experience, Book, Contact) и Blog (Post, Author).

---

## 2. Фотографии

### Где размещать

| Путь | Назначение |
|------|------------|
| `frontend/public/images/photos/` | Фото для About, Experience, Hero |
| `frontend/public/diplomas/` | PDF дипломов и сертификатов |

### Ожидаемые файлы

**About (страница «Обо мне»):**
- `DSC_0222_optimized.jpg` — основное фото (уже используется как default)
- `IMG20230830105750.jpg`, `IMG20240828143738.jpg`, `IMG20250404114114.jpg`, `IMG20250518152029.jpg` — галерея

**Experience (страница «Опыт»):**
- `DSC_2992.jpg`, `DSC_3010.jpg`, `IMG20250618100959.jpg` — фото с работы

**Рекомендации:**
- Формат: JPEG или WebP
- Размер: до 1920px по длинной стороне
- Оптимизация: сжатие 80–85% для веба

---

## 3. Видео для Hero

Видео сварки отображается в шапке главной страницы.

### Настройка

Добавьте в `.env` (frontend):

```env
NEXT_PUBLIC_HERO_VIDEO_URL=https://ваш-cdn.com/hero-welding.mp4
NEXT_PUBLIC_HERO_VIDEO_WEBM=https://ваш-cdn.com/hero-welding.webm
NEXT_PUBLIC_HERO_VIDEO_POSTER=https://ваш-cdn.com/hero-poster.jpg
```

### Рекомендации

- **Формат:** MP4 (H.264) + WebM (VP9) для лучшей совместимости
- **Длительность:** 10–30 секунд, loop
- **Разрешение:** 1920×1080 или 1280×720
- **Размер:** до 5–10 MB (сжатие)
- **Постер:** кадр из видео, JPEG, ~1200×630 px

### Инструменты для конвертации

- **FFmpeg** (WebM): `ffmpeg -i input.mp4 -c:v libvpx-vp9 -b:v 1M output.webm`
- **HandBrake** — сжатие MP4

---

## 4. Контактные данные

Обновите в Django Admin → Pages → Contact:

- **Email** — замените `contact@example.com` на реальный
- **LinkedIn** — URL профиля
- **YouTube** — URL канала

---

## 5. Обложка книги

Загрузите обложку через Django Admin → Pages → Book → Cover image
или поместите файл в media storage (Cloudinary/S3), если настроено.
