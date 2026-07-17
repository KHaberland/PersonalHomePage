import { getPageContent } from './api';
import type { PageContent } from './api-types';
import { htmlToPlainText } from './html-to-plain-text';

export type { PageContent };

type SupportedLang = 'en' | 'ru' | 'lv';

const supportedLangs = new Set<string>(['en', 'ru', 'lv']);

function normalizeLang(lang: string): SupportedLang {
  return supportedLangs.has(lang) ? (lang as SupportedLang) : 'en';
}

/** CKEditor в Admin оборачивает короткие поля в <p> и &nbsp; — убираем для plain-text UI. */
export function sanitizePageContent(content: PageContent): PageContent {
  const result: PageContent = {};

  for (const [block, fields] of Object.entries(content)) {
    result[block] = {};
    for (const [key, value] of Object.entries(fields)) {
      result[block][key] =
        typeof value === 'string' ? htmlToPlainText(value) : value;
    }
  }

  return result;
}

export async function getCmsPage(
  page: string,
  lang: string
): Promise<PageContent> {
  try {
    const content = await getPageContent(page, normalizeLang(lang));
    return sanitizePageContent(content);
  } catch {
    return {};
  }
}
