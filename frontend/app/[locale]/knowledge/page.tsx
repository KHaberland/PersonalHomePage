import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Section } from '@/components/Section';
import { getCategories, getPosts } from '@/lib/api';
import type { Lang } from '@/lib/api-types';
import { getCmsPage } from '@/lib/cms-content';
import { createPageMetadata } from '@/lib/metadata';

/** Разделы базы знаний: заголовки берутся из Category по slug. */
const KNOWLEDGE_SECTIONS: { slug: string }[] = [
  { slug: 'welding-technology' },
  { slug: 'welding-equipment' },
  { slug: 'shielding-gases' },
  { slug: 'gas-cutting' },
  { slug: 'welding-metallurgy' },
  { slug: 'welding-defects' },
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

  const [categories, postsByCategory, content] = await Promise.all([
    getCategories().catch(() => []),
    Promise.all(
      KNOWLEDGE_SECTIONS.map(({ slug }) =>
        getPosts(lang, { category_slug: slug, page: '1' }).catch(() => ({
          results: [],
          count: 0,
        }))
      )
    ),
    getCmsPage('knowledge', locale),
  ]);

  const knowledgeText = (key: string) => content.ui?.[key] || '';
  const categoryMap = new Map(categories.map((c) => [c.slug, c]));

  return (
    <Section bordered={false} scrollMargin={false}>
      <p className="eyebrow-blue mb-3">{knowledgeText('eyebrow')}</p>
      <h1 className="heading-1 mb-4 text-accent-orange">
        {knowledgeText('title')}
      </h1>
      <p className="lead mb-3 max-w-3xl">{knowledgeText('description')}</p>
      <p className="caption mb-12 max-w-3xl">{knowledgeText('schemaNote')}</p>

      <div className="space-y-16">
        {KNOWLEDGE_SECTIONS.map(({ slug }, idx) => {
          const posts = postsByCategory[idx]?.results ?? [];
          const category = categoryMap.get(slug);
          const sectionTitle = category ? getCategoryName(category, lang) : '';

          return (
            <section
              key={slug}
              id={slug}
              className="scroll-mt-24 border-t border-border pt-8"
            >
              <h2 className="heading-2 mb-6 text-accent-orange">
                {sectionTitle}
              </h2>
              {posts.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="card group block overflow-hidden"
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
                        <h3 className="heading-3 text-foreground group-hover:text-accent-orange">
                          {post.title}
                        </h3>
                        <div
                          className="mt-1 line-clamp-2 text-sm text-foreground/80 [&_p]:inline [&_p]:m-0"
                          dangerouslySetInnerHTML={{
                            __html: post.excerpt || '',
                          }}
                        />
                        <p className="mt-2 text-xs text-foreground/50">
                          {post.published_at
                            ? new Date(post.published_at).toLocaleDateString(
                                locale
                              )
                            : ''}
                          {category && (
                            <span className="ml-2 text-accent-orange">
                              · {getCategoryName(category, lang)}
                            </span>
                          )}
                        </p>
                        <span className="mt-3 inline-block text-sm font-medium text-accent-orange group-hover:underline">
                          {knowledgeText('readMore')}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="card px-4 py-6 text-foreground/60">
                  {knowledgeText('noArticles')}
                </p>
              )}
            </section>
          );
        })}
      </div>

      <section className="mt-16 border-t border-border pt-8">
        <h2 className="heading-2 mb-4 text-accent-orange">
          {knowledgeText('systemLinksTitle')}
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Link href="/solutions" className="card block p-6">
            <h3 className="heading-3 text-foreground">
              {knowledgeText('solutionCtaTitle')}
            </h3>
            <p className="mt-2 text-sm text-foreground/80">
              {knowledgeText('solutionCtaText')}
            </p>
            <span className="link-accent mt-4 inline-block text-sm">
              {knowledgeText('solutionCta')} →
            </span>
          </Link>
          <Link href="/blog" className="card block p-6">
            <h3 className="heading-3 text-foreground">
              {knowledgeText('blogLinkTitle')}
            </h3>
            <p className="mt-2 text-sm text-foreground/80">
              {knowledgeText('blogLinkText')}
            </p>
          </Link>
          <Link href="/book" className="card block p-6">
            <h3 className="heading-3 text-foreground">
              {knowledgeText('bookLinkTitle')}
            </h3>
            <p className="mt-2 text-sm text-foreground/80">
              {knowledgeText('bookLinkText')}
            </p>
          </Link>
        </div>
      </section>
    </Section>
  );
}
