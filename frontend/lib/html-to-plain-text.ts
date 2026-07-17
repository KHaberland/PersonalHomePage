/**
 * Короткие поля CMS иногда сохраняются с обёрткой <p>...</p> и &nbsp; из CKEditor.
 * Убирает теги, HTML-сущности и лишние пробелы для безопасного вывода как обычного текста.
 */
export function htmlToPlainText(html: string): string {
  return html
    .replace(/<p\b[^>]*>/gi, '')
    .replace(/<\/p>/gi, ' ')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;|&#160;|&#xA0;/gi, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
