import DOMPurify from 'isomorphic-dompurify';

/** Ограниченный набор для биографии / образования / квалификаций (CMS + переводы). */
const ABOUT_HTML_CONFIG = {
  ALLOWED_TAGS: [
    'p',
    'br',
    'strong',
    'b',
    'em',
    'i',
    'u',
    'ul',
    'ol',
    'li',
    'a',
    'span',
    'h2',
    'h3',
    'h4',
    'blockquote',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
  ],
  ALLOWED_ATTR: [
    'class',
    'href',
    'target',
    'rel',
    'title',
    'colspan',
    'rowspan',
  ],
  ALLOWED_URI_REGEXP:
    /^(?:(?:https?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
};

/**
 * Санитизация HTML из API перед dangerouslySetInnerHTML (XSS).
 * Не полагается на доверие к бэкенду.
 */
export function sanitizeAboutHtml(dirty: string | null | undefined): string {
  if (dirty == null || typeof dirty !== 'string') return '';
  return DOMPurify.sanitize(dirty, ABOUT_HTML_CONFIG);
}
