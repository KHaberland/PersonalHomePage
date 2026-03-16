import type { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/seo';
import { routing } from '@/i18n/routing';
import { getPosts } from '@/lib/api';

const STATIC_PATHS = [
  '',
  '/about',
  '/experience',
  '/book',
  '/tools',
  '/knowledge',
  '/blog',
];

const CALCULATOR_SLUGS = [
  'heat-input',
  'gas-flow',
  'shielding-gas',
  'gas-cutting',
  'welding-cost',
  'welding-parameters',
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

  // Статьи блога (все локали)
  try {
    const postsEn = await getPosts('en', { page: '1' });
    const postsRu = await getPosts('ru', { page: '1' });
    const postsLv = await getPosts('lv', { page: '1' });

    const allSlugs = new Set<string>();
    for (const p of [postsEn, postsRu, postsLv]) {
      for (const post of p.results ?? []) {
        allSlugs.add(post.slug);
      }
    }

    // Пагинация — получаем все статьи
    let page = 1;
    let hasMore = true;
    while (hasMore) {
      const resp = await getPosts('en', { page: String(page) });
      for (const post of resp.results ?? []) {
        allSlugs.add(post.slug);
      }
      hasMore = !!resp.next;
      page++;
      if (page > 50) break; // защита от бесконечного цикла
    }

    for (const locale of routing.locales) {
      const localePrefix = `/${locale}`;
      for (const slug of allSlugs) {
        entries.push({
          url: `${baseUrl}${localePrefix}/blog/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.6,
        });
      }
    }
  } catch {
    // API недоступен при билде — только статические страницы
  }

  return entries;
}
