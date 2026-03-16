import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { getCategories, getPosts } from '@/lib/api';
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

  const [t, categories, postsResponse] = await Promise.all([
    getTranslations('blog'),
    getCategories().catch(() => []),
    getPosts(lang, { category_slug: categorySlug ?? undefined, page }),
  ]);

  const posts = postsResponse.results;
  const totalCount = postsResponse.count;
  const hasNext = !!postsResponse.next;
  const hasPrevious = !!postsResponse.previous;
  const pageNum = parseInt(page, 10) || 1;
  const pageSize = 10;
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-4 text-3xl font-bold text-[#f97316]">{t('title')}</h1>
      <p className="mb-8 text-[#e6edf3]/80">{t('description')}</p>

      {/* Фильтр по категориям */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/blog"
          className={`rounded-full px-4 py-2 text-sm transition-colors ${
            !categorySlug
              ? 'bg-[#f97316] text-white'
              : 'border border-[#30363d] bg-[#161b22] text-[#e6edf3]/80 hover:border-[#f97316]'
          }`}
        >
          {t('allCategories')}
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/blog?category_slug=${cat.slug}`}
            className={`rounded-full px-4 py-2 text-sm transition-colors ${
              categorySlug === cat.slug
                ? 'bg-[#f97316] text-white'
                : 'border border-[#30363d] bg-[#161b22] text-[#e6edf3]/80 hover:border-[#f97316]'
            }`}
          >
            {getCategoryName(cat, lang)}
          </Link>
        ))}
      </div>

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
                  href={
                    categorySlug
                      ? `/blog?category_slug=${categorySlug}&page=${pageNum - 1}`
                      : `/blog?page=${pageNum - 1}`
                  }
                  className="rounded border border-[#30363d] bg-[#161b22] px-4 py-2 text-sm text-[#e6edf3] hover:border-[#f97316]"
                >
                  ← {t('previous')}
                </Link>
              )}
              <span className="px-4 py-2 text-sm text-[#e6edf3]/70">
                {t('pageOf', { current: pageNum, total: totalPages })}
              </span>
              {hasNext && (
                <Link
                  href={
                    categorySlug
                      ? `/blog?category_slug=${categorySlug}&page=${pageNum + 1}`
                      : `/blog?page=${pageNum + 1}`
                  }
                  className="rounded border border-[#30363d] bg-[#161b22] px-4 py-2 text-sm text-[#e6edf3] hover:border-[#f97316]"
                >
                  {t('next')} →
                </Link>
              )}
            </nav>
          )}
        </>
      ) : (
        <div className="rounded-lg border border-[#30363d] bg-[#161b22] px-6 py-12 text-center text-[#e6edf3]/60">
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
  getCategoryName,
  getImageSrc,
}: {
  post: PostListItem;
  locale: string;
  lang: Lang;
  getCategoryName: (c: Category, l: Lang) => string;
  getImageSrc: (url: string | null) => string;
}) {
  const imgSrc = getImageSrc(post.cover_image);
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block overflow-hidden rounded-lg border border-[#30363d] bg-[#161b22] transition-colors hover:border-[#f97316]"
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
        <h2 className="font-semibold text-[#e6edf3] group-hover:text-[#f97316]">
          {post.title}
        </h2>
        <p className="mt-1 line-clamp-2 text-sm text-[#e6edf3]/70">
          {post.excerpt}
        </p>
        <p className="mt-2 text-xs text-[#e6edf3]/50">
          {post.published_at
            ? new Date(post.published_at).toLocaleDateString(locale)
            : ''}
          {post.category && (
            <span className="ml-2 text-[#f97316]">
              · {getCategoryName(post.category, lang)}
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}
