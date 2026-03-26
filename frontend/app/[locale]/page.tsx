import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { CompetencyCard } from '@/components/CompetencyCard';
import { Hero } from '@/components/Hero';
import { HomeSectionProgress } from '@/components/HomeSectionProgress';
import { Section } from '@/components/Section';
import { ToolCardLink } from '@/components/ToolCardLink';
import {
  IconCompetencyCutting,
  IconCompetencyEquipment,
  IconCompetencyGas,
  IconCompetencyMetallurgy,
  IconCompetencyMigMag,
  IconCompetencyTig,
  IconServiceConsulting,
  IconServiceEquipment,
  IconServiceImplementation,
  IconServiceTraining,
} from '@/components/icons';
import {
  getAbout,
  getBook,
  getContact,
  getExperience,
  getPosts,
  getTools,
} from '@/lib/api';
import {
  BLOG_FALLBACK_MESSAGE_KEYS,
  buildFallbackTools,
} from '@/lib/fallback-content';
import type { Lang } from '@/lib/api-types';
import { createPageMetadata } from '@/lib/metadata';

/** Технические навыки: процессы, оборудование, материалы */
const competencyTechnicalItems = [
  {
    Icon: IconCompetencyMigMag,
    titleKey: 'competencyIconMigMag',
    descKey: 'competencyCard1',
  },
  {
    Icon: IconCompetencyTig,
    titleKey: 'competencyIconTigAl',
    descKey: 'competencyCard2',
  },
  {
    Icon: IconCompetencyGas,
    titleKey: 'competencyIconGas',
    descKey: 'competencyCard3',
  },
  {
    Icon: IconCompetencyEquipment,
    titleKey: 'competencyIconEquipment',
    descKey: 'competencyCard4',
  },
  {
    Icon: IconCompetencyMetallurgy,
    titleKey: 'competencyIconMetallurgy',
    descKey: 'competencyCard5',
  },
  {
    Icon: IconCompetencyCutting,
    titleKey: 'competencyIconCuttingGases',
    descKey: 'competencyCard6',
  },
] as const;

/** Результаты для бизнеса: KPI, затраты, команда (иконки из блока услуг) */
const competencyBusinessItems = [
  {
    Icon: IconServiceImplementation,
    titleKey: 'competencyBusiness1Title',
    descKey: 'competencyBusiness1Desc',
  },
  {
    Icon: IconServiceTraining,
    titleKey: 'competencyBusiness2Title',
    descKey: 'competencyBusiness2Desc',
  },
  {
    Icon: IconServiceConsulting,
    titleKey: 'competencyBusiness3Title',
    descKey: 'competencyBusiness3Desc',
  },
] as const;

const serviceItems = [
  {
    Icon: IconServiceConsulting,
    titleKey: 'serviceConsulting',
    descKey: 'serviceConsultingDesc',
  },
  {
    Icon: IconServiceImplementation,
    titleKey: 'serviceImplementation',
    descKey: 'serviceImplementationDesc',
  },
  {
    Icon: IconServiceEquipment,
    titleKey: 'serviceEquipment',
    descKey: 'serviceEquipmentDesc',
  },
  {
    Icon: IconServiceTraining,
    titleKey: 'serviceTraining',
    descKey: 'serviceTrainingDesc',
  },
] as const;

const caseItems = [
  {
    Icon: IconServiceTraining,
    titleKey: 'case1Title',
    descKey: 'case1Description',
    imageSrc: '/images/photos/small/Author_small.jpg',
  },
  {
    Icon: IconCompetencyTig,
    titleKey: 'case2Title',
    descKey: 'case2Description',
    imageSrc: '/images/photos/author01.jpg',
  },
  {
    Icon: IconCompetencyGas,
    titleKey: 'case3Title',
    descKey: 'case3Description',
    imageSrc: '/images/photos/small/Author_small.jpg',
  },
] as const;

/** Последние статьи на главной: строго топ-3 (site_rework §5) */
const HOME_BLOG_POSTS_LIMIT = 3;

const EXPERIENCE_FALLBACK_KEYS = ['elme', 'buts', 'production'] as const;

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

  const [t, tAbout, tExp] = await Promise.all([
    getTranslations('home'),
    getTranslations('about'),
    getTranslations('experience'),
  ]);

  const [about, book, contact, experience, tools, postsResponse] =
    await Promise.all([
      getAbout(lang).catch(() => null),
      getBook(lang).catch(() => null),
      getContact().catch(() => null),
      getExperience(lang).catch(() => []),
      getTools().catch(() => []),
      getPosts(lang, { page: '1' }).catch(() => ({ results: [], count: 0 })),
    ]);

  const latestPosts =
    postsResponse.results?.slice(0, HOME_BLOG_POSTS_LIMIT) ?? [];

  const toolsForHome =
    tools.length > 0
      ? tools
      : buildFallbackTools((key) => t(key)).map((item) => ({
          ...item,
          created_at: '',
        }));

  const aboutShortHtml = about?.bio?.trim() ? about.bio : t.raw('aboutText');

  const defaultAboutPhoto = '/images/photos/small/Author_small.jpg';
  const defaultBookCover = '/images/photos/author01.jpg';
  const aboutPhotoSrc = about?.photo
    ? getImageSrc(about.photo) || about.photo
    : defaultAboutPhoto;
  const aboutPhotoUnoptimized = aboutPhotoSrc.startsWith('http');
  const bookCoverSrc = book?.cover_image
    ? getImageSrc(book.cover_image) || book.cover_image
    : defaultBookCover;
  const bookCoverUnoptimized = bookCoverSrc.startsWith('http');

  return (
    <>
      <Hero />
      <HomeSectionProgress />

      {/* Почему выбирают — доверие с первого экрана */}
      <Section id="why-choose" aria-labelledby="home-why-heading">
        <h2 id="home-why-heading" className="heading-2 mb-6 text-accent-orange">
          {t('whyChooseTitle')}
        </h2>
        <ul className="mx-auto max-w-3xl list-disc space-y-3 pl-5 text-sm font-medium text-foreground/90 marker:text-accent-orange md:pl-6">
          <li>{t('whyChoose1')}</li>
          <li>{t('whyChoose2')}</li>
          <li>{t('whyChoose3')}</li>
          <li>{t('whyChoose4')}</li>
        </ul>
      </Section>

      {/* Обо мне (краткий блок на главной) */}
      <Section id="about" variant="surface">
        <h2 className="heading-2 mb-8 text-accent-orange">{t('aboutTitle')}</h2>
        <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-12">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-lg border border-border md:mx-0">
            <Image
              src={aboutPhotoSrc}
              alt={tAbout('photoAlt')}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 28rem"
              priority={false}
              unoptimized={aboutPhotoUnoptimized}
            />
          </div>
          <div className="flex flex-col">
            <div
              className="text-foreground/90 [&_p]:mt-3 [&_p:first-child]:mt-0 [&_p]:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: aboutShortHtml }}
            />
            <Link
              href="/about"
              className="btn-primary mt-8 inline-block self-start"
            >
              {t('aboutMoreCta')}
            </Link>
          </div>
        </div>
      </Section>

      {/* Блок ключевых компетенций: технические навыки + результаты для бизнеса */}
      <Section id="competencies" aria-labelledby="home-competencies-heading">
        <h2
          id="home-competencies-heading"
          className="heading-2 mb-8 text-accent-orange"
        >
          {t('competenciesTitle')}
        </h2>

        <div className="space-y-2 border-b border-border pb-10">
          <h3
            id="competencies-technical"
            className="heading-3 text-accent-orange"
          >
            {t('competenciesTechnicalSubtitle')}
          </h3>
          <p className="mb-6 max-w-3xl text-sm text-foreground/70">
            {t('competenciesTechnicalLead')}
          </p>
          <ul
            className="grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3"
            aria-labelledby="competencies-technical"
          >
            {competencyTechnicalItems.map(({ Icon, titleKey, descKey }) => (
              <li key={titleKey} className="h-full min-h-0">
                <CompetencyCard
                  variant="technical"
                  title={t(titleKey)}
                  description={t(descKey)}
                  icon={
                    <Icon className="h-6 w-6" aria-hidden title={undefined} />
                  }
                />
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 rounded-xl border border-accent-blue/25 bg-surface p-6 shadow-[inset_0_1px_0_0_rgba(59,130,246,0.08)] sm:p-8 md:p-10">
          <h3 id="competencies-business" className="heading-3 text-accent-blue">
            {t('competenciesBusinessSubtitle')}
          </h3>
          <p className="mb-6 max-w-3xl text-sm text-foreground/75">
            {t('competenciesBusinessLead')}
          </p>
          <ul
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            aria-labelledby="competencies-business"
          >
            {competencyBusinessItems.map(({ Icon, titleKey, descKey }) => (
              <li key={titleKey}>
                <CompetencyCard
                  variant="business"
                  title={t(titleKey)}
                  description={t(descKey)}
                  icon={
                    <Icon className="h-6 w-6" aria-hidden title={undefined} />
                  }
                />
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Услуги */}
      <Section id="services" variant="surface">
        <h2 className="heading-2 mb-2 text-accent-orange">
          {t('servicesTitle')}
        </h2>
        <p className="mb-8 max-w-3xl text-foreground/80">
          {t('servicesSubtitle')}
        </p>
        <ul className="grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {serviceItems.map(({ Icon, titleKey, descKey }) => (
            <li key={titleKey} className="h-full min-h-0">
              <CompetencyCard
                title={t(titleKey)}
                description={t(descKey)}
                icon={
                  <Icon className="h-6 w-6" aria-hidden title={undefined} />
                }
              />
            </li>
          ))}
        </ul>
        <Link href="/contact" className="btn-primary mt-8 inline-block">
          {t('servicesCta')}
        </Link>
      </Section>

      {/* Практический опыт / кейсы */}
      <Section id="cases" aria-labelledby="home-cases-heading">
        <h2
          id="home-cases-heading"
          className="heading-2 mb-2 text-accent-orange"
        >
          {t('casesTitle')}
        </h2>
        <p className="mb-8 max-w-3xl text-foreground/80">
          {t('casesSubtitle')}
        </p>
        <ul className="grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {caseItems.map(({ Icon, titleKey, descKey, imageSrc }) => (
            <li key={titleKey} className="h-full min-h-0">
              <CompetencyCard
                title={t(titleKey)}
                description={t(descKey)}
                imageSrc={imageSrc}
                imageAlt={t(titleKey)}
                icon={
                  <Icon className="h-6 w-6" aria-hidden title={undefined} />
                }
              />
            </li>
          ))}
        </ul>
        <Link href="/experience" className="btn-primary mt-8 inline-block">
          {t('casesCta')}
        </Link>
      </Section>

      {/* Краткий опыт: API или fallback из messages */}
      <Section
        id="experience"
        variant="surface"
        aria-labelledby="home-experience-heading"
      >
        <h2
          id="home-experience-heading"
          className="heading-2 mb-8 text-accent-orange"
        >
          {t('experienceTitle')}
        </h2>
        <div className="space-y-4">
          {experience.length > 0
            ? experience.slice(0, 3).map((exp) => (
                <div
                  key={exp.id}
                  className="flex flex-col gap-1 border-l-2 border-accent-orange pl-4"
                >
                  <h3 className="heading-3 text-foreground">{exp.title}</h3>
                  <p className="text-accent-orange">{exp.company}</p>
                  <p className="text-sm text-foreground/70">
                    {exp.start_year} — {exp.end_year ?? tExp('present')}
                  </p>
                  {exp.description?.trim() ? (
                    <p className="mt-1 text-sm text-foreground/75">
                      {exp.description}
                    </p>
                  ) : null}
                </div>
              ))
            : EXPERIENCE_FALLBACK_KEYS.map((key) => (
                <div
                  key={key}
                  className="flex flex-col gap-1 border-l-2 border-accent-orange pl-4"
                >
                  <h3 className="heading-3 text-foreground">
                    {tExp(`${key}.role`)}
                  </h3>
                  <p className="text-accent-orange">{tExp(`${key}.company`)}</p>
                  <p className="text-sm text-foreground/70">
                    {tExp(`${key}.period`)}
                  </p>
                </div>
              ))}
        </div>
      </Section>

      {/* Карточка книги */}
      <Section id="book" aria-labelledby="home-book-heading">
        <div className="card flex flex-col gap-6 p-6 md:flex-row md:items-center">
          <div className="relative mx-auto h-48 w-36 shrink-0 overflow-hidden rounded md:mx-0">
            <Image
              src={bookCoverSrc}
              alt={book?.title ?? t('bookTitle')}
              fill
              className="object-cover"
              sizes="144px"
              loading="lazy"
              fetchPriority="low"
              unoptimized={bookCoverUnoptimized}
            />
          </div>
          <div className="flex-1">
            <h2 id="home-book-heading" className="heading-3 text-accent-orange">
              {t('bookTitle')}
            </h2>
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
              {t('bookMoreCta')}
            </Link>
          </div>
        </div>
      </Section>

      {/* Карточки инженерных калькуляторов */}
      <Section id="tools" variant="tools">
        <h2 className="heading-2 mb-2 text-accent-orange">{t('toolsTitle')}</h2>
        <p className="mb-2 max-w-3xl text-base font-medium text-accent-blue">
          {t('toolsSectionLead')}
        </p>
        <p className="mb-8 max-w-3xl text-foreground/80">
          {t('toolsDescription')}
        </p>
        {toolsForHome.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {toolsForHome.slice(0, 6).map((tool) => (
              <ToolCardLink key={tool.id} tool={tool} density="compact" />
            ))}
          </div>
        ) : null}
        <Link href="/tools" className="btn-primary mt-8 inline-block">
          {t('toolsCta')}
        </Link>
      </Section>

      {/* Последние статьи блога */}
      <Section id="blog">
        <h2 className="heading-2 mb-2 text-accent-orange">{t('blogTitle')}</h2>
        <p className="mb-8 max-w-3xl text-foreground/80">{t('blogSubtitle')}</p>
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
                  <span className="mt-3 inline-block text-sm font-medium text-accent-orange group-hover:underline">
                    {t('blogReadMore')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BLOG_FALLBACK_MESSAGE_KEYS.map(({ titleKey, excerptKey }) => (
              <Link
                key={titleKey}
                href="/blog"
                className="card group block p-4"
              >
                <h3 className="heading-3 text-foreground group-hover:text-accent-orange">
                  {t(titleKey)}
                </h3>
                <div
                  className="mt-1 line-clamp-3 text-sm text-foreground/70 [&_p]:mt-1 [&_p:first-child]:mt-0"
                  dangerouslySetInnerHTML={{
                    __html: t.raw(excerptKey),
                  }}
                />
                <span className="mt-3 inline-block text-sm font-medium text-accent-orange group-hover:underline">
                  {t('blogReadMore')}
                </span>
              </Link>
            ))}
          </div>
        )}
        <Link href="/blog" className="btn-primary mt-8 inline-block">
          {t('blogAllArticles')}
        </Link>
      </Section>

      {/* CTA / Контакт */}
      <Section id="contact" variant="surface" containerClassName="text-center">
        <h2 className="heading-2 mb-4 text-accent-orange">
          {t('ctaBannerTitle')}
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-foreground/85">
          {t('ctaBannerText')}
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
          <Link href="/contact" className="btn-primary inline-block px-8">
            {t('ctaBannerContact')}
          </Link>
          {(contact?.email ||
            process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim()) && (
            <div
              className="inline-flex overflow-hidden rounded-md border border-border shadow-sm"
              role="group"
              aria-label={t('ctaBannerEmailWhatsapp')}
            >
              {contact?.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="btn-secondary inline-block rounded-none border-0 px-6 py-3 text-center transition-colors hover:bg-[var(--surface-elevated)]"
                >
                  {t('ctaBannerEmail')}
                </a>
              )}
              {process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() && (
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn-secondary inline-block rounded-none border-0 px-6 py-3 text-center transition-colors hover:bg-[var(--surface-elevated)] ${contact?.email ? 'border-l border-border' : ''}`}
                >
                  {t('ctaBannerWhatsapp')}
                </a>
              )}
            </div>
          )}
        </div>
        {contact && (
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
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
      </Section>
    </>
  );
}
