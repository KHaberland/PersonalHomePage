/**
 * Хелперы для generateMetadata с учётом локали
 */

import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getSeoMetadata } from './api';
import {
  getBaseUrl,
  getCanonicalUrl,
  getOpenGraphMetadata,
  SITE_NAME,
} from './seo';

type Locale = string;
type SupportedLang = 'en' | 'ru' | 'lv';

type PageMetadataParams = {
  locale: Locale;
  path: string;
  image?: string;
  imageAlt?: string;
} & (
  | { titleKey: string; descriptionKey: string }
  | { title: string; description: string }
);

const supportedLangs = new Set<string>(['en', 'ru', 'lv']);

const seoPageByTitleKey: Record<string, string> = {
  homeTitle: 'home',
  aboutTitle: 'about',
  experienceTitle: 'experience',
  expertiseTitle: 'expertise',
  solutionsTitle: 'solutions',
  bookTitle: 'book',
  toolsTitle: 'tools',
  knowledgeTitle: 'knowledge',
  blogTitle: 'blog',
  contactTitle: 'contact',
  privacyTitle: 'privacy',
  cookiePolicyTitle: 'cookiePolicy',
  termsTitle: 'terms',
};

function normalizeLang(locale: string): SupportedLang {
  return supportedLangs.has(locale) ? (locale as SupportedLang) : 'en';
}

async function getCmsSeoMetadata(page: string, locale: string) {
  try {
    return await getSeoMetadata(page, normalizeLang(locale));
  } catch {
    // JSON fallback keeps metadata available when the CMS API is offline.
    return null;
  }
}

/** Базовые метаданные для страницы (title, description, OG, Twitter) */
export async function createPageMetadata(
  params: PageMetadataParams
): Promise<Metadata> {
  const { locale, path, image, imageAlt } = params;
  let title: string;
  let description: string;

  if ('titleKey' in params) {
    const t = await getTranslations({ locale, namespace: 'seo' });
    const seoPage = seoPageByTitleKey[params.titleKey];
    const cmsSeo = seoPage ? await getCmsSeoMetadata(seoPage, locale) : null;
    title = cmsSeo?.title.trim() || t(params.titleKey);
    description = cmsSeo?.description.trim() || t(params.descriptionKey);
  } else {
    title = params.title;
    description = params.description;
  }

  const { openGraph, twitter } = getOpenGraphMetadata({
    title,
    description,
    path,
    locale,
    image,
    imageAlt,
  });

  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl(path, locale),
    },
    openGraph,
    twitter,
  };
}

/** Метаданные для статьи блога (Article, JSON-LD) */
export async function createArticleMetadata(params: {
  locale: Locale;
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}): Promise<Metadata> {
  const {
    locale,
    title,
    description,
    path,
    image,
    imageAlt,
    publishedTime,
    modifiedTime,
    author,
  } = params;

  const { openGraph, twitter } = getOpenGraphMetadata({
    title,
    description,
    path,
    locale,
    image,
    imageAlt,
    type: 'article',
    publishedTime,
    modifiedTime,
    author,
  });

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    alternates: {
      canonical: getCanonicalUrl(path, locale),
    },
    openGraph,
    twitter,
  };
}

/** Дефолтные метаданные (корневой layout) */
export async function getDefaultMetadata(locale: Locale): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'seo' });
  const title = t('defaultTitle');
  const description = t('defaultDescription');
  const path = locale === 'en' ? '' : `/${locale}`;

  const { openGraph, twitter } = getOpenGraphMetadata({
    title,
    description,
    path,
    locale,
  });

  return {
    title: {
      default: title,
      template: `%s | ${SITE_NAME}`,
    },
    description,
    metadataBase: new URL(getBaseUrl()),
    openGraph,
    twitter,
  };
}
