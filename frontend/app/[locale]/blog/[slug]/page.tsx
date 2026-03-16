import Image from 'next/image';
import { Link as IntlLink } from '@/i18n/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getPost, getPosts } from '@/lib/api';
import type { Category, Lang, PostListItem } from '@/lib/api-types';
import { createArticleMetadata } from '@/lib/metadata';
import { getBaseUrl, getCanonicalUrl } from '@/lib/seo';

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
  params: Promise<{ locale: string; slug: string }>;
};

function langFromLocale(locale: string): Lang {
  return locale === 'en' || locale === 'ru' || locale === 'lv'
    ? (locale as Lang)
    : 'en';
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const lang = langFromLocale(locale);
  const post = await getPost(slug, lang).catch(() => null);
  if (!post) return {};
  const coverSrc = post.cover_image
    ? getImageSrc(post.cover_image) || undefined
    : undefined;
  return createArticleMetadata({
    locale,
    title: post.title,
    description: post.excerpt || post.title,
    path: `/blog/${slug}`,
    image: coverSrc,
    imageAlt: post.title,
    publishedTime: post.published_at ?? post.created_at,
    modifiedTime: post.updated_at,
    author: post.author?.name,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const lang = langFromLocale(locale);

  const [t, post] = await Promise.all([
    getTranslations('blog'),
    getPost(slug, lang).catch(() => null),
  ]);

  if (!post) {
    notFound();
  }

  // JSON-LD для статьи
  const coverFullUrl = post.cover_image
    ? getImageSrc(post.cover_image) || undefined
    : undefined;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: coverFullUrl,
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.updated_at ?? post.published_at ?? post.created_at,
    author: post.author
      ? {
          '@type': 'Person',
          name: post.author.name,
        }
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'Oleg Suvorov',
      logo: {
        '@type': 'ImageObject',
        url: `${getBaseUrl()}/images/photos/DSC_0222_optimized.jpg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': getCanonicalUrl(`/blog/${post.slug}`, locale),
    },
  };

  // Похожие статьи (по категории, исключая текущую)
  const categorySlug = post.category?.slug;
  const relatedPosts: PostListItem[] = categorySlug
    ? (
        await getPosts(lang, {
          category_slug: categorySlug,
          page: '1',
        }).catch(() => ({ results: [] }))
      ).results
        .filter((p) => p.slug !== post.slug)
        .slice(0, 3)
    : [];

  const coverSrc = getImageSrc(post.cover_image);

  return (
    <article className="mx-auto max-w-4xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Заголовок */}
      <header className="mb-8">
        <IntlLink
          href="/blog"
          className="mb-4 inline-block text-sm text-[#f97316] hover:underline"
        >
          ← {t('backToBlog')}
        </IntlLink>
        {post.category && (
          <IntlLink
            href={`/blog?category_slug=${post.category.slug}`}
            className="inline-block rounded-full bg-[#f97316]/20 px-3 py-1 text-sm text-[#f97316]"
          >
            {getCategoryName(post.category, lang)}
          </IntlLink>
        )}
        <h1 className="mt-4 text-3xl font-bold text-[#e6edf3] md:text-4xl">
          {post.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[#e6edf3]/70">
          {post.author && <span>{post.author.name}</span>}
          {(post.published_at || post.created_at) && (
            <time dateTime={post.published_at || post.created_at}>
              {new Date(
                post.published_at || post.created_at
              ).toLocaleDateString(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          )}
        </div>
      </header>

      {/* Обложка */}
      {post.cover_image && (
        <div className="relative mb-8 aspect-video overflow-hidden rounded-lg">
          <Image
            src={coverSrc || post.cover_image}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
            priority
            unoptimized={post.cover_image.startsWith('http')}
          />
        </div>
      )}

      {/* Контент */}
      <div
        className="blog-content [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#e6edf3] [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[#e6edf3] [&_p]:mt-4 [&_p]:text-[#e6edf3]/90 [&_p]:leading-relaxed [&_a]:text-[#f97316] [&_a]:underline [&_a]:hover:no-underline [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mt-1 [&_img]:mt-4 [&_img]:rounded-lg [&_img]:max-w-full"
        dangerouslySetInnerHTML={{ __html: post.content || '' }}
      />

      {/* Изображения из поста */}
      {post.images && post.images.length > 0 && (
        <div className="mt-8 space-y-4">
          {post.images.map((img) => {
            const imgUrl = img.image_url;
            if (!imgUrl) return null;
            const fullUrl = getImageSrc(imgUrl) || imgUrl;
            return (
              <figure key={img.id} className="overflow-hidden rounded-lg">
                <div className="relative aspect-video">
                  <Image
                    src={fullUrl}
                    alt={img.caption || post.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 896px) 100vw, 896px"
                    unoptimized={imgUrl.startsWith('http')}
                  />
                </div>
                {img.caption && (
                  <figcaption className="mt-2 text-center text-sm text-[#e6edf3]/60">
                    {img.caption}
                  </figcaption>
                )}
              </figure>
            );
          })}
        </div>
      )}

      {/* Теги */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag.id}
              className="rounded border border-[#30363d] bg-[#161b22] px-3 py-1 text-sm text-[#e6edf3]/80"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Похожие статьи */}
      {relatedPosts.length > 0 && (
        <section className="mt-16 border-t border-[#30363d] pt-8">
          <h2 className="mb-6 text-xl font-bold text-[#f97316]">
            {t('relatedPosts')}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((related) => (
              <IntlLink
                key={related.id}
                href={`/blog/${related.slug}`}
                className="group block overflow-hidden rounded-lg border border-[#30363d] bg-[#161b22] transition-colors hover:border-[#f97316]"
              >
                {related.cover_image && (
                  <div className="relative aspect-video">
                    <Image
                      src={
                        getImageSrc(related.cover_image) || related.cover_image
                      }
                      alt={related.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 33vw"
                      unoptimized={related.cover_image.startsWith('http')}
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-[#e6edf3] group-hover:text-[#f97316]">
                    {related.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-[#e6edf3]/70">
                    {related.excerpt}
                  </p>
                </div>
              </IntlLink>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
