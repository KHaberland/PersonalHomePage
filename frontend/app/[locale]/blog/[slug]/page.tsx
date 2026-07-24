import Image from 'next/image';
import { Link as IntlLink } from '@/i18n/navigation';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { BlogArticleFaqBlock } from '@/components/blog/BlogArticleFaqBlock';
import { BlogArticleQuestionBlock } from '@/components/blog/BlogArticleQuestionBlock';
import { BlogNewsletterBlock } from '@/components/blog/BlogNewsletterBlock';
import { Section } from '@/components/Section';
import { getArticleFaq, getPost, getPosts } from '@/lib/api';
import type {
  Category,
  Lang,
  PageContent,
  PostListItem,
} from '@/lib/api-types';
import { getCmsPage } from '@/lib/cms-content';
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

function cmsBlockText(
  content: PageContent,
  block: string,
  key: string
): string {
  return content[block]?.[key] || '';
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

  const [post, content, commonContent, faqItems] = await Promise.all([
    getPost(slug, lang).catch(() => null),
    getCmsPage('blog', locale),
    getCmsPage('common', locale),
    getArticleFaq(slug, lang).catch(() => []),
  ]);

  if (!post) {
    notFound();
  }

  const blogText = (key: string) => content.ui?.[key] || '';
  const publisherName = commonContent.brand?.name || 'Oleg Suvorov';

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
      name: publisherName,
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
    <Section
      as="article"
      container="narrow"
      bordered={false}
      scrollMargin={false}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Заголовок */}
      <header className="mb-8">
        <IntlLink
          href="/blog"
          className="link-accent mb-4 inline-block text-sm hover:underline"
        >
          ← {blogText('backToBlog')}
        </IntlLink>
        {post.category && (
          <IntlLink
            href={`/blog?category_slug=${post.category.slug}`}
            className="inline-block rounded-full bg-accent-orange/20 px-3 py-1 text-sm text-accent-orange"
          >
            {getCategoryName(post.category, lang)}
          </IntlLink>
        )}
        <h1 className="heading-1 mt-4 text-foreground">{post.title}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted">
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
        className="blog-content"
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
                  <figcaption className="mt-2 text-center text-sm text-muted">
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
              className="card inline-block px-3 py-1 text-sm text-foreground/80"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {cmsBlockText(content, 'article_faq', 'title') && faqItems.length > 0 && (
        <BlogArticleFaqBlock
          title={cmsBlockText(content, 'article_faq', 'title')}
          items={faqItems}
        />
      )}

      {cmsBlockText(content, 'newsletter', 'title') && (
        <BlogNewsletterBlock
          locale={locale}
          articleSlug={post.slug}
          articleTitle={post.title}
          labels={{
            title: cmsBlockText(content, 'newsletter', 'title'),
            lead: cmsBlockText(content, 'newsletter', 'lead'),
            emailLabel: cmsBlockText(content, 'newsletter', 'emailLabel'),
            nameLabel: cmsBlockText(content, 'newsletter', 'nameLabel'),
            submit: cmsBlockText(content, 'newsletter', 'submit'),
            success: cmsBlockText(content, 'newsletter', 'success'),
            privacyNote: cmsBlockText(content, 'newsletter', 'privacyNote'),
            privacyLinkLabel: commonContent.nav?.privacyNav || '',
          }}
        />
      )}

      {cmsBlockText(content, 'article_question', 'title') && (
        <BlogArticleQuestionBlock
          locale={locale}
          articleSlug={post.slug}
          articleTitle={post.title}
          labels={{
            title: cmsBlockText(content, 'article_question', 'title'),
            nameLabel: cmsBlockText(content, 'article_question', 'nameLabel'),
            emailLabel: cmsBlockText(content, 'article_question', 'emailLabel'),
            questionLabel: cmsBlockText(
              content,
              'article_question',
              'questionLabel'
            ),
            subscribeLabel: cmsBlockText(
              content,
              'article_question',
              'subscribeLabel'
            ),
            submit: cmsBlockText(content, 'article_question', 'submit'),
            success: cmsBlockText(content, 'article_question', 'success'),
            privacyNote: cmsBlockText(
              content,
              'article_question',
              'privacyNote'
            ),
            privacyLinkLabel: commonContent.nav?.privacyNav || '',
          }}
        />
      )}

      {/* Похожие статьи */}
      {relatedPosts.length > 0 && (
        <section className="mt-16 border-t border-border pt-8">
          <h2 className="heading-2 mb-6 text-accent-orange">
            {blogText('relatedPosts')}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((related) => (
              <IntlLink
                key={related.id}
                href={`/blog/${related.slug}`}
                className="card group block overflow-hidden"
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
                  <h3 className="heading-3 text-foreground group-hover:text-accent-orange">
                    {related.title}
                  </h3>
                  <div
                    className="mt-1 line-clamp-2 text-sm text-foreground/80 [&_p]:inline [&_p]:m-0"
                    dangerouslySetInnerHTML={{
                      __html: related.excerpt || '',
                    }}
                  />
                </div>
              </IntlLink>
            ))}
          </div>
        </section>
      )}
    </Section>
  );
}
