/**
 * SEO-утилиты: базовый URL, Open Graph, Twitter Card
 */

export const SITE_NAME = 'Oleg Suvorov | Welding Engineer';

/** Базовый URL сайта (для sitemap, OG, canonical) */
export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
}

export type MetadataParams = {
  title: string;
  description: string;
  path?: string;
  locale?: string;
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
};

/** Формирует полный URL страницы (path — путь без локали: '', '/about', '/blog') */
export function getCanonicalUrl(path: string, locale?: string): string {
  const base = getBaseUrl();
  const cleanPath = path && !path.startsWith('/') ? `/${path}` : path;
  // next-intl по умолчанию использует localePrefix: 'always' — все URL с префиксом /en, /ru, /lv
  const localePrefix = locale ? `/${locale}` : '';
  return `${base}${localePrefix}${cleanPath}`;
}

type PersonJsonLdParams = {
  locale: string;
  description: string;
  image?: string | null;
  sameAs?: string[];
  personName?: string;
};

function absoluteUrl(pathOrUrl: string): string {
  return pathOrUrl.startsWith('http')
    ? pathOrUrl
    : `${getBaseUrl()}${pathOrUrl}`;
}

export function createAboutJsonLd({
  locale,
  description,
  image,
  sameAs = [],
  personName = 'Oleg Suvorov',
}: PersonJsonLdParams) {
  const personId = `${getCanonicalUrl('/about', locale)}#person`;
  const cleanSameAs = sameAs.filter(Boolean);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': personId,
        name: personName,
        alternateName: ['Olegs Suvorovs', 'Олег Суворов'],
        jobTitle: 'International Welding Engineer (IWE)',
        description,
        url: getCanonicalUrl('/about', locale),
        image: image ? absoluteUrl(image) : undefined,
        sameAs: cleanSameAs.length > 0 ? cleanSameAs : undefined,
        knowsAbout: [
          'MIG/MAG welding',
          'TIG welding',
          'Shielding gases',
          'Welding metallurgy',
          'Welding defects',
          'WPS support',
        ],
        alumniOf: {
          '@type': 'CollegeOrUniversity',
          name: 'Riga Technical University',
        },
        hasCredential: [
          {
            '@type': 'EducationalOccupationalCredential',
            credentialCategory: 'International Welding Engineer',
            name: 'International Welding Engineer (IWE)',
          },
        ],
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${getCanonicalUrl('/contact', locale)}#service`,
        name: 'Oleg Suvorov Welding Engineering Consulting',
        description,
        url: getCanonicalUrl('/contact', locale),
        areaServed: ['Latvia', 'Europe', 'Remote'],
        serviceType: [
          'Welding process consulting',
          'Welding defect analysis',
          'Shielding gas selection',
          'Welder training',
          'WPS support',
        ],
        provider: {
          '@id': personId,
        },
        sameAs: cleanSameAs.length > 0 ? cleanSameAs : undefined,
      },
    ],
  };
}

/** Open Graph и Twitter Card метаданные */
export function getOpenGraphMetadata(params: MetadataParams) {
  const {
    title,
    description,
    path = '',
    locale = 'en',
    image,
    imageAlt,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
  } = params;

  const url = getCanonicalUrl(path, locale);
  const siteName = SITE_NAME;

  const og: {
    title: string;
    description: string;
    url: string;
    siteName: string;
    type: string;
    locale: string;
    images?: { url: string; alt: string }[];
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
  } = {
    title,
    description,
    url,
    siteName,
    type,
    locale: locale === 'en' ? 'en_US' : locale === 'ru' ? 'ru_RU' : 'lv_LV',
  };
  if (image) {
    og.images = [
      {
        url: image.startsWith('http') ? image : `${getBaseUrl()}${image}`,
        alt: imageAlt ?? title,
      },
    ];
  }
  if (type === 'article' && publishedTime) og.publishedTime = publishedTime;
  if (type === 'article' && modifiedTime) og.modifiedTime = modifiedTime;
  if (type === 'article' && author) og.authors = [author];

  const twitter: {
    card: 'summary_large_image';
    title: string;
    description: string;
    images?: string[];
  } = {
    card: 'summary_large_image',
    title,
    description,
  };
  if (image)
    twitter.images = [
      image.startsWith('http') ? image : `${getBaseUrl()}${image}`,
    ];

  return { openGraph: og, twitter };
}
