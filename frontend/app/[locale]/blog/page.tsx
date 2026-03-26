import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { getCategories, getPosts, getTags } from '@/lib/api';
import type { Category, Lang, PostListItem } from '@/lib/api-types';
import { createPageMetadata } from '@/lib/metadata';

function getCategoryName(category: Category, lang: Lang): string {
  if (lang === 'ru') return category.name_ru;
  if (lang === 'lv') return category.name_lv;
  return category.name_en;
}

function getImageSrc(url: string | null): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') || '';
  return base ? `${base}${url.startsWith('/') ? '' : '/'}${url}` : url;
}

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function langFromLocale(locale: string): Lang {
  return locale === 'en' || locale === 'ru' || locale === 'lv'
    ? (locale as Lang)
    : 'en';
}

/** Список /blog с сохранением фильтров категории и тега */
function buildBlogListHref(filters: {
  category_slug?: string;
  tag_slug?: string;
  page?: number;
}): string {
  const q = new URLSearchParams();
  if (filters.category_slug) q.set('category_slug', filters.category_slug);
  if (filters.tag_slug) q.set('tag_slug', filters.tag_slug);
  if (filters.page && filters.page > 1) q.set('page', String(filters.page));
  const s = q.toString();
  return s ? `/blog?${s}` : '/blog';
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return createPageMetadata({
    locale,
    titleKey: 'blogTitle',
    descriptionKey: 'blogDescription',
    path: '/blog',
  });
}

export default async function BlogPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  setRequestLocale(locale);
  const lang = langFromLocale(locale);

  const page = Array.isArray(resolvedSearchParams.page)
    ? resolvedSearchParams.page[0]
    : (resolvedSearchParams.page ?? '1');
  const categorySlug = Array.isArray(resolvedSearchParams.category_slug)
    ? resolvedSearchParams.category_slug[0]
    : resolvedSearchParams.category_slug;
  const tagSlug = Array.isArray(resolvedSearchParams.tag_slug)
    ? resolvedSearchParams.tag_slug[0]
    : resolvedSearchParams.tag_slug;

  const [t, tCommon, categories, tags, postsResponse] = await Promise.all([
    getTranslations('blog'),
    getTranslations('common'),
    getCategories().catch(() => []),
    getTags().catch(() => []),
    getPosts(lang, {
      category_slug: categorySlug ?? undefined,
      tag_slug: tagSlug ?? undefined,
      page,
    }).catch(() => ({
      results: [] as PostListItem[],
      count: 0,
      next: null,
      previous: null,
    })),
  ]);

  const posts = postsResponse.results;
  const totalCount = postsResponse.count;
  const hasNext = !!postsResponse.next;
  const hasPrevious = !!postsResponse.previous;
  const pageNum = parseInt(page, 10) || 1;
  const pageSize = 10;
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="container-wide section">
      <h1 className="heading-1 mb-4 text-accent-orange">{t('title')}</h1>
      <p className="mb-3 text-foreground/80">{t('description')}</p>
      <p className="mb-8 text-sm text-foreground/70">
        {t('knowledgeCrossLink')}{' '}
        <Link
          href="/knowledge"
          className="link-accent font-medium hover:underline"
        >
          {tCommon('knowledgeNav')}
        </Link>
      </p>

      {/* Фильтр по категориям */}
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-foreground/50">
        {t('filterByCategory')}
      </p>
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href={buildBlogListHref({ tag_slug: tagSlug ?? undefined })}
          className={`rounded-full px-4 py-2 text-sm transition-colors ${
            !categorySlug
              ? 'bg-accent-orange text-white'
              : 'card text-foreground/80 hover:border-accent-orange'
          }`}
        >
          {t('allCategories')}
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={buildBlogListHref({
              category_slug: cat.slug,
              tag_slug: tagSlug ?? undefined,
            })}
            className={`rounded-full px-4 py-2 text-sm transition-colors ${
              categorySlug === cat.slug
                ? 'bg-accent-orange text-white'
                : 'card text-foreground/80 hover:border-accent-orange'
            }`}
          >
            {getCategoryName(cat, lang)}
          </Link>
        ))}
      </div>

      {/* Фильтр по тегам */}
      {tags.length > 0 ? (
        <>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-foreground/50">
            {t('filterByTag')}
          </p>
          <div className="mb-8 flex flex-wrap gap-2">
            <Link
              href={buildBlogListHref({
                category_slug: categorySlug ?? undefined,
              })}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                !tagSlug
                  ? 'bg-accent-orange text-white'
                  : 'card text-foreground/80 hover:border-accent-orange'
              }`}
            >
              {t('allTags')}
            </Link>
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={buildBlogListHref({
                  category_slug: categorySlug ?? undefined,
                  tag_slug: tag.slug,
                })}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  tagSlug === tag.slug
                    ? 'bg-accent-orange text-white'
                    : 'card text-foreground/80 hover:border-accent-orange'
                }`}
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </>
      ) : null}

      {/* Список статей */}
      {posts.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard
                key={post.id}
                post={post}
                locale={locale}
                lang={lang}
                readMoreLabel={t('readMore')}
                getCategoryName={getCategoryName}
                getImageSrc={getImageSrc}
              />
            ))}
          </div>

          {/* Пагинация */}
          {totalPages > 1 && (
            <nav
              className="mt-12 flex items-center justify-center gap-2"
              aria-label={t('pagination')}
            >
              {hasPrevious && (
                <Link
                  href={buildBlogListHref({
                    category_slug: categorySlug ?? undefined,
                    tag_slug: tagSlug ?? undefined,
                    page: pageNum - 1,
                  })}
                  className="rounded border border-[#30363d] bg-[#161b22] px-4 py-2 text-sm text-[#e6edf3] hover:border-[#f97316]"
                >
                  ← {t('previous')}
                </Link>
              )}
              <span className="px-4 py-2 text-sm text-foreground/70">
                {t('pageOf', { current: pageNum, total: totalPages })}
              </span>
              {hasNext && (
                <Link
                  href={buildBlogListHref({
                    category_slug: categorySlug ?? undefined,
                    tag_slug: tagSlug ?? undefined,
                    page: pageNum + 1,
                  })}
                  className="card px-4 py-2 text-sm text-foreground hover:border-accent-orange"
                >
                  {t('next')} →
                </Link>
              )}
            </nav>
          )}
        </>
      ) : (
        <div className="card px-6 py-12 text-center text-foreground/60">
          {t('noArticles')}
        </div>
      )}
    </div>
  );
}

function BlogCard({
  post,
  locale,
  lang,
  readMoreLabel,
  getCategoryName,
  getImageSrc,
}: {
  post: PostListItem;
  locale: string;
  lang: Lang;
  readMoreLabel: string;
  getCategoryName: (c: Category, l: Lang) => string;
  getImageSrc: (url: string | null) => string;
}) {
  const imgSrc = getImageSrc(post.cover_image);
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="card group block overflow-hidden"
    >
      {post.cover_image && (
        <div className="relative aspect-video">
          <Image
            src={imgSrc || post.cover_image || ''}
            alt={post.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 33vw"
            unoptimized={post.cover_image.startsWith('http')}
          />
        </div>
      )}
      <div className="p-4">
        <h2 className="heading-3 text-foreground group-hover:text-accent-orange">
          {post.title}
        </h2>
        <div
          className="mt-1 line-clamp-2 text-sm text-foreground/70 [&_p]:inline [&_p]:m-0"
          dangerouslySetInnerHTML={{ __html: post.excerpt || '' }}
        />
        <p className="mt-2 text-xs text-foreground/50">
          {post.published_at
            ? new Date(post.published_at).toLocaleDateString(locale)
            : ''}
          {post.category && (
            <span className="ml-2 text-accent-orange">
              · {getCategoryName(post.category, lang)}
            </span>
          )}
        </p>
        <span className="mt-3 inline-block text-sm font-medium text-accent-orange group-hover:underline">
          {readMoreLabel}
        </span>
      </div>
    </Link>
  );
}
