import type { MetadataRoute } from 'next';
import { CALCULATOR_SLUGS } from '@/components/calculators';
import { getBaseUrl } from '@/lib/seo';
import { routing } from '@/i18n/routing';

const STATIC_PATHS = [
  '',
  '/about',
  '/experience',
  '/expertise',
  '/solutions',
  '/tools',
  '/knowledge',
  '/blog',
  '/book',
  '/contact',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    const localePrefix = `/${locale}`;

    // Статические страницы
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${baseUrl}${localePrefix}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : 0.8,
      });
    }

    // Страницы калькуляторов
    for (const slug of CALCULATOR_SLUGS) {
      entries.push({
        url: `${baseUrl}${localePrefix}/tools/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  return entries;
}
