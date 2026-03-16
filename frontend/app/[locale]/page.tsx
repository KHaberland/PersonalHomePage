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
      <section className="border-t border-[#30363d] bg-[#161b22] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-2xl font-bold text-[#f97316]">
            {t('aboutTitle')}
          </h2>
          <p className="max-w-3xl text-lg text-[#e6edf3]/90">
            {about?.bio ?? t('aboutText')}
          </p>
        </div>
      </section>

      {/* Блок ключевых компетенций */}
      <section className="border-t border-[#30363d] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-2xl font-bold text-[#f97316]">
            {t('competenciesTitle')}
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {competencies.map((key) => (
              <li
                key={key}
                className="flex items-center gap-3 rounded-lg border border-[#30363d] bg-[#161b22] px-4 py-3"
              >
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#f97316]" />
                <span className="text-[#e6edf3]">{t(key)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Краткий опыт (timeline) */}
      {experience.length > 0 && (
        <section className="border-t border-[#30363d] bg-[#161b22] px-4 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-8 text-2xl font-bold text-[#f97316]">
              {t('experienceTitle')}
            </h2>
            <div className="space-y-4">
              {experience.slice(0, 3).map((exp) => (
                <div
                  key={exp.id}
                  className="flex flex-col gap-1 border-l-2 border-[#f97316] pl-4"
                >
                  <h3 className="font-semibold text-[#e6edf3]">{exp.title}</h3>
                  <p className="text-[#f97316]">{exp.company}</p>
                  <p className="text-sm text-[#e6edf3]/70">
                    {exp.start_year} — {exp.end_year ?? 'present'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Карточка книги */}
      <section className="border-t border-[#30363d] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-6 rounded-lg border border-[#30363d] bg-[#161b22] p-6 md:flex-row md:items-center">
            {book?.cover_image && (
              <div className="relative h-48 w-36 shrink-0 overflow-hidden rounded">
                <Image
                  src={book.cover_image}
                  alt={book.title}
                  fill
                  className="object-cover"
                  sizes="144px"
                  unoptimized={book.cover_image.startsWith('http')}
                />
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-[#f97316]">
                {t('bookTitle')}
              </h2>
              <p className="mt-2 text-[#e6edf3]/90">
                {book?.description ?? t('bookDescription')}
              </p>
              <p className="mt-1 text-sm text-[#e6edf3]/70">
                {book?.year ?? '2024'}
              </p>
              <Link
                href="/book"
                className="mt-4 inline-block rounded bg-[#f97316] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#ea580c]"
              >
                {t('bookCta')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Карточки инженерных калькуляторов */}
      <section className="border-t border-[#30363d] bg-[#161b22] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-2 text-2xl font-bold text-[#f97316]">
            {t('toolsTitle')}
          </h2>
          <p className="mb-8 text-[#e6edf3]/80">{t('toolsDescription')}</p>
          {tools.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tools.slice(0, 6).map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.slug}`}
                  className="block rounded-lg border border-[#30363d] bg-[#0d1117] p-4 transition-colors hover:border-[#f97316]"
                >
                  <h3 className="font-semibold text-[#e6edf3]">{tool.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-[#e6edf3]/70">
                    {tool.description}
                  </p>
                </Link>
              ))}
            </div>
          ) : null}
          <Link
            href="/tools"
            className="mt-6 inline-block text-[#f97316] hover:underline"
          >
            {t('toolsCta')} →
          </Link>
        </div>
      </section>

      {/* Последние статьи блога */}
      <section className="border-t border-[#30363d] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-2xl font-bold text-[#f97316]">
            {t('blogTitle')}
          </h2>
          {latestPosts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group block overflow-hidden rounded-lg border border-[#30363d] bg-[#161b22] transition-colors hover:border-[#f97316]"
                >
                  {post.cover_image && (
                    <div className="relative aspect-video">
                      <Image
                        src={post.cover_image}
                        alt=""
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
            className="mt-6 inline-block text-[#f97316] hover:underline"
          >
            {t('blogCta')} →
          </Link>
        </div>
      </section>

      {/* Контакты */}
      <section className="border-t border-[#30363d] bg-[#161b22] px-4 py-16">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="mb-6 text-2xl font-bold text-[#f97316]">
            {t('contactTitle')}
          </h2>
          {contact && (
            <div className="flex flex-wrap justify-center gap-6">
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="text-[#e6edf3] hover:text-[#f97316]"
                >
                  {contact.email}
                </a>
              )}
              {contact.linkedin_url && (
                <a
                  href={contact.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#e6edf3] hover:text-[#f97316]"
                >
                  LinkedIn
                </a>
              )}
              {contact.youtube_url && (
                <a
                  href={contact.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#e6edf3] hover:text-[#f97316]"
                >
                  YouTube
                </a>
              )}
            </div>
          )}
          <Link
            href="/contact"
            className="mt-6 inline-block rounded bg-[#f97316] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#ea580c]"
          >
            {t('contactTitle')}
          </Link>
        </div>
      </section>
    </>
  );
}
