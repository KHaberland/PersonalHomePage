import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { getCategories, getPosts } from '@/lib/api';
import type { Lang } from '@/lib/api-types';
import { createPageMetadata } from '@/lib/metadata';

/** Разделы базы знаний: slug категории → ключ перевода */
const KNOWLEDGE_SECTIONS: { slug: string; translationKey: string }[] = [
  { slug: 'welding-technology', translationKey: 'migMagWelding' },
  { slug: 'welding-equipment', translationKey: 'tigWelding' },
  { slug: 'shielding-gases', translationKey: 'shieldingGases' },
  { slug: 'gas-cutting', translationKey: 'gasCutting' },
  { slug: 'welding-metallurgy', translationKey: 'weldingMetallurgy' },
  { slug: 'welding-defects', translationKey: 'weldingDefects' },
];

function getImageSrc(url: string | null): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') || '';
  return base ? `${base}${url.startsWith('/') ? '' : '/'}${url}` : url;
}

function getCategoryName(
  category: { name_en: string; name_ru: string; name_lv: string },
  lang: Lang
): string {
  if (lang === 'ru') return category.name_ru;
  if (lang === 'lv') return category.name_lv;
  return category.name_en;
}

type Props = {
  params: Promise<{ locale: string }>;
};

function langFromLocale(locale: string): Lang {
  return locale === 'en' || locale === 'ru' || locale === 'lv'
    ? (locale as Lang)
    : 'en';
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return createPageMetadata({
    locale,
    titleKey: 'knowledgeTitle',
    descriptionKey: 'knowledgeDescription',
    path: '/knowledge',
  });
}

export default async function KnowledgePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = langFromLocale(locale);

  const [t, categories, postsByCategory] = await Promise.all([
    getTranslations('knowledge'),
    getCategories().catch(() => []),
    Promise.all(
      KNOWLEDGE_SECTIONS.map(({ slug }) =>
        getPosts(lang, { category_slug: slug, page: '1' }).catch(() => ({
          results: [],
          count: 0,
        }))
      )
    ),
  ]);

  const categoryMap = new Map(categories.map((c) => [c.slug, c]));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-4 text-3xl font-bold text-[#f97316]">{t('title')}</h1>
      <p className="mb-12 text-[#e6edf3]/80">{t('description')}</p>

      <div className="space-y-16">
        {KNOWLEDGE_SECTIONS.map(({ slug, translationKey }, idx) => {
          const posts = postsByCategory[idx]?.results ?? [];
          const category = categoryMap.get(slug);
          const sectionTitle = t(translationKey);

          return (
            <section key={slug} className="border-t border-[#30363d] pt-8">
              <h2 className="mb-6 text-2xl font-bold text-[#f97316]">
                {sectionTitle}
              </h2>
              {posts.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="group block overflow-hidden rounded-lg border border-[#30363d] bg-[#161b22] transition-colors hover:border-[#f97316]"
                    >
                      {post.cover_image && (
                        <div className="relative aspect-video">
                          <Image
                            src={
                              getImageSrc(post.cover_image) || post.cover_image
                            }
                            alt={post.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, 33vw"
                            unoptimized={post.cover_image.startsWith('http')}
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-[#e6edf3] group-hover:text-[#f97316]">
                          {post.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-sm text-[#e6edf3]/70">
                          {post.excerpt}
                        </p>
                        <p className="mt-2 text-xs text-[#e6edf3]/50">
                          {post.published_at
                            ? new Date(post.published_at).toLocaleDateString(
                                locale
                              )
                            : ''}
                          {category && (
                            <span className="ml-2 text-[#f97316]">
                              · {getCategoryName(category, lang)}
                            </span>
                          )}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="rounded-lg border border-[#30363d] bg-[#161b22] px-4 py-6 text-[#e6edf3]/60">
                  {t('noArticles')}
                </p>
              )}
              <Link
                href={`/blog?category_slug=${slug}`}
                className="mt-4 inline-block text-sm text-[#f97316] hover:underline"
              >
                {t('viewAllInCategory')} →
              </Link>
            </section>
          );
        })}
      </div>
    </div>
  );
}
