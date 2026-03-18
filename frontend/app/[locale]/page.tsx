import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Hero } from '@/components/Hero';
import {
  getAbout,
  getBook,
  getContact,
  getExperience,
  getPosts,
  getTools,
} from '@/lib/api';
import type { Lang } from '@/lib/api-types';
import { createPageMetadata } from '@/lib/metadata';

const competencies = [
  'competency1',
  'competency2',
  'competency3',
  'competency4',
  'competency5',
] as const;

type Props = {
  params: Promise<{ locale: string }>;
};

function langFromLocale(locale: string): Lang {
  return locale === 'en' || locale === 'ru' || locale === 'lv'
    ? (locale as Lang)
    : 'en';
}

function getImageSrc(url: string | null): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') || '';
  return base ? `${base}${url.startsWith('/') ? '' : '/'}${url}` : url;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return createPageMetadata({
    locale,
    titleKey: 'homeTitle',
    descriptionKey: 'homeDescription',
    path: '',
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = langFromLocale(locale);

  const t = await getTranslations('home');

  const [about, book, contact, experience, tools, postsResponse] =
    await Promise.all([
      getAbout(lang).catch(() => null),
      getBook(lang).catch(() => null),
      getContact().catch(() => null),
      getExperience(lang).catch(() => []),
      getTools().catch(() => []),
      getPosts(lang, { page: '1' }).catch(() => ({ results: [], count: 0 })),
    ]);

  const latestPosts = postsResponse.results?.slice(0, 5) ?? [];

  return (
    <>
      <Hero />

      {/* Краткая информация о специалисте */}
      <section className="section border-t border-border bg-surface">
        <div className="container-wide">
          <h2 className="heading-2 mb-6 text-accent-orange">
            {t('aboutTitle')}
          </h2>
          <div
            className="max-w-3xl text-foreground/90 [&_p]:mt-2 [&_p:first-child]:mt-0"
            dangerouslySetInnerHTML={{
              __html: about?.bio ?? t('aboutText'),
            }}
          />
        </div>
      </section>

      {/* Блок ключевых компетенций */}
      <section className="section border-t border-border">
        <div className="container-wide">
          <h2 className="heading-2 mb-8 text-accent-orange">
            {t('competenciesTitle')}
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {competencies.map((key) => (
              <li key={key} className="card flex items-center gap-3 px-4 py-3">
                <span className="h-2 w-2 shrink-0 rounded-full bg-accent-orange" />
                <span className="text-foreground">{t(key)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Краткий опыт (timeline) */}
      {experience.length > 0 && (
        <section className="section border-t border-border bg-surface">
          <div className="container-wide">
            <h2 className="heading-2 mb-8 text-accent-orange">
              {t('experienceTitle')}
            </h2>
            <div className="space-y-4">
              {experience.slice(0, 3).map((exp) => (
                <div
                  key={exp.id}
                  className="flex flex-col gap-1 border-l-2 border-accent-orange pl-4"
                >
                  <h3 className="heading-3 text-foreground">{exp.title}</h3>
                  <p className="text-accent-orange">{exp.company}</p>
                  <p className="text-sm text-foreground/70">
                    {exp.start_year} — {exp.end_year ?? 'present'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Карточка книги */}
      <section className="section border-t border-border">
        <div className="container-wide">
          <div className="card flex flex-col gap-6 p-6 md:flex-row md:items-center">
            {book?.cover_image && (
              <div className="relative h-48 w-36 shrink-0 overflow-hidden rounded">
                <Image
                  src={book.cover_image}
                  alt={book.title}
                  fill
                  className="object-cover"
                  sizes="144px"
                  loading="lazy"
                  fetchPriority="low"
                  unoptimized={book.cover_image.startsWith('http')}
                />
              </div>
            )}
            <div className="flex-1">
              <h2 className="heading-3 text-accent-orange">{t('bookTitle')}</h2>
              <div
                className="mt-2 text-foreground/90 [&_p]:mt-1 [&_p:first-child]:mt-0"
                dangerouslySetInnerHTML={{
                  __html: book?.description ?? t('bookDescription'),
                }}
              />
              <p className="mt-1 text-sm text-foreground/70">
                {book?.year ?? '2024'}
              </p>
              <Link href="/book" className="btn-primary mt-4 inline-block">
                {t('bookCta')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Карточки инженерных калькуляторов */}
      <section className="section border-t border-border bg-surface">
        <div className="container-wide">
          <h2 className="heading-2 mb-2 text-accent-orange">
            {t('toolsTitle')}
          </h2>
          <p className="mb-8 text-foreground/80">{t('toolsDescription')}</p>
          {tools.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tools.slice(0, 6).map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.slug}`}
                  className="card block p-4"
                >
                  <h3 className="heading-3 text-foreground">{tool.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-foreground/70">
                    {tool.description}
                  </p>
                </Link>
              ))}
            </div>
          ) : null}
          <Link
            href="/tools"
            className="link-accent mt-6 inline-block hover:underline"
          >
            {t('toolsCta')} →
          </Link>
        </div>
      </section>

      {/* Последние статьи блога */}
      <section className="section border-t border-border">
        <div className="container-wide">
          <h2 className="heading-2 mb-8 text-accent-orange">
            {t('blogTitle')}
          </h2>
          {latestPosts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="card group block overflow-hidden"
                >
                  {post.cover_image && (
                    <div className="relative aspect-video">
                      <Image
                        src={getImageSrc(post.cover_image) || post.cover_image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, 33vw"
                        loading="lazy"
                        fetchPriority="low"
                        unoptimized={post.cover_image.startsWith('http')}
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="heading-3 text-foreground group-hover:text-accent-orange">
                      {post.title}
                    </h3>
                    <div
                      className="mt-1 line-clamp-2 text-sm text-foreground/70 [&_p]:inline [&_p]:m-0"
                      dangerouslySetInnerHTML={{
                        __html: post.excerpt || '',
                      }}
                    />
                    <p className="mt-2 text-xs text-foreground/50">
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString(locale)
                        : ''}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : null}
          <Link
            href="/blog"
            className="link-accent mt-6 inline-block hover:underline"
          >
            {t('blogCta')} →
          </Link>
        </div>
      </section>

      {/* Контакты */}
      <section className="section border-t border-border bg-surface">
        <div className="container-wide text-center">
          <h2 className="heading-2 mb-6 text-accent-orange">
            {t('contactTitle')}
          </h2>
          {contact && (
            <div className="flex flex-wrap justify-center gap-6">
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="link-accent">
                  {contact.email}
                </a>
              )}
              {contact.linkedin_url && (
                <a
                  href={contact.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-accent"
                >
                  LinkedIn
                </a>
              )}
              {contact.youtube_url && (
                <a
                  href={contact.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-accent"
                >
                  YouTube
                </a>
              )}
            </div>
          )}
          <Link href="/contact" className="btn-primary mt-6 inline-block">
            {t('contactTitle')}
          </Link>
        </div>
      </section>
    </>
  );
}
