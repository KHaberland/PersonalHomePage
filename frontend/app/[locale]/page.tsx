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
  IconCompetencyGas,
  IconCompetencyMigMag,
  IconCompetencyTig,
  IconServiceConsulting,
  IconServiceImplementation,
  IconServiceTraining,
} from '@/components/icons';
import {
  getContact,
  getHomeTechnicalSkills,
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
    anchorId: 'expertise-mig-mag',
    titleKey: 'competencyIconMigMag',
    descKey: 'competencyCard1',
  },
  {
    Icon: IconCompetencyTig,
    anchorId: 'expertise-tig',
    titleKey: 'competencyIconTigAl',
    descKey: 'competencyCard2',
  },
  {
    Icon: IconCompetencyGas,
    anchorId: 'expertise-gases',
    titleKey: 'competencyIconGas',
    descKey: 'competencyCard3',
  },
] as const;

const solutionFlowItems = [
  {
    Icon: IconServiceConsulting,
    anchorId: 'solutions-defect-reduction',
    titleKey: 'serviceConsulting',
    descKey: 'serviceConsultingDesc',
    impactKey: 'solutionsImpactDefects',
    extraImpactKey: null,
  },
  {
    Icon: IconServiceImplementation,
    anchorId: 'solutions-process-optimization',
    titleKey: 'serviceImplementation',
    descKey: 'serviceImplementationDesc',
    impactKey: 'solutionsImpactStableProcesses',
    extraImpactKey: 'solutionsImpactTraceability',
  },
  {
    Icon: IconCompetencyGas,
    anchorId: 'solutions-gas-selection',
    titleKey: 'solutionGasSelectionTitle',
    descKey: 'solutionGasSelectionDesc',
    impactKey: 'solutionsImpactCosts',
    extraImpactKey: null,
  },
  {
    Icon: IconServiceTraining,
    anchorId: 'solutions-training',
    titleKey: 'serviceTraining',
    descKey: 'serviceTrainingDesc',
    impactKey: 'solutionsImpactTeam',
    extraImpactKey: null,
  },
] as const;

const caseItems = [
  {
    Icon: IconCompetencyMigMag,
    titleKey: 'case1Title',
    descKey: 'case1Description',
    imageSrc: '/images/photos/small/Author_small.jpg',
  },
  {
    Icon: IconServiceTraining,
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

  const [contact, tools, postsResponse, homeTechnicalSkills] =
    await Promise.all([
      getContact().catch(() => null),
      getTools().catch(() => []),
      getPosts(lang, { page: '1' }).catch(() => ({ results: [], count: 0 })),
      getHomeTechnicalSkills(lang).catch(() => null),
    ]);

  const homeTechnicalByOrder = new Map(
    (homeTechnicalSkills?.items ?? []).map((row) => [row.order, row])
  );
  const technicalLeadParagraph =
    (homeTechnicalSkills?.technical_lead ?? '').trim() ||
    t('competenciesTechnicalLead');

  const latestPosts =
    postsResponse.results?.slice(0, HOME_BLOG_POSTS_LIMIT) ?? [];

  const toolsForHome =
    tools.length > 0
      ? tools
      : buildFallbackTools((key) => t(key)).map((item) => ({
          ...item,
          created_at: '',
        }));

  return (
    <>
      <Hero />
      <HomeSectionProgress />

      {/* Решения для производственных задач */}
      <Section id="solutions" variant="surface">
        <h2 className="heading-2 mb-2 font-semibold tracking-tight text-white">
          {t('servicesTitle')}
        </h2>
        {t('servicesSubtitle').trim() ? (
          <p className="mb-8 max-w-3xl text-foreground/80">
            {t('servicesSubtitle')}
          </p>
        ) : null}
        <div className="rounded-2xl border border-border bg-background/35 p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] sm:p-6 lg:p-8">
          <ul className="list-none space-y-4">
            {solutionFlowItems.map(
              ({
                Icon,
                anchorId,
                titleKey,
                descKey,
                impactKey,
                extraImpactKey,
              }) => (
                <li
                  key={titleKey}
                  id={anchorId}
                  className="group grid min-h-0 scroll-mt-24 gap-3 md:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)] md:items-stretch"
                >
                  <article className="card flex h-full min-h-0 flex-col gap-3 p-5 transition-colors group-hover:border-accent-orange/60 group-hover:bg-[var(--surface-elevated)] group-focus-within:border-accent-orange/60 group-focus-within:bg-[var(--surface-elevated)]">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-orange/10 text-accent-orange transition-colors group-hover:bg-accent-orange/15">
                      <Icon className="h-6 w-6" aria-hidden title={undefined} />
                    </div>
                    <h3 className="heading-3 text-foreground">{t(titleKey)}</h3>
                    <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                      {t(descKey)}
                    </p>
                  </article>
                  <div
                    className="flex items-center justify-center text-accent-blue/70"
                    aria-hidden
                  >
                    <span className="md:hidden">↓</span>
                    <span className="hidden h-px w-full bg-gradient-to-r from-accent-orange/25 via-accent-blue/80 to-accent-blue/25 transition-opacity group-hover:opacity-100 md:block" />
                  </div>
                  <article className="flex h-full min-h-0 flex-col justify-center rounded-xl border border-accent-blue/25 bg-surface px-5 py-4 transition-colors group-hover:border-accent-blue/70 group-hover:bg-accent-blue/10 group-focus-within:border-accent-blue/70 group-focus-within:bg-accent-blue/10">
                    <p className="text-base font-semibold text-foreground">
                      {t(impactKey)}
                    </p>
                    {extraImpactKey ? (
                      <p className="mt-2 text-sm font-medium text-accent-blue">
                        {t(extraImpactKey)}
                      </p>
                    ) : null}
                  </article>
                </li>
              )
            )}
          </ul>
        </div>
        <Link href="/solutions" className="btn-primary mt-8 inline-block">
          {t('solutionsMoreCta')}
        </Link>
      </Section>

      {/* Инженерная экспертиза: технические навыки */}
      <Section id="expertise" aria-labelledby="home-expertise-heading">
        <h2
          id="home-expertise-heading"
          className="heading-2 mb-8 max-w-4xl font-semibold tracking-tight text-white md:mb-10"
        >
          {t('competenciesTitle')}
        </h2>

        <div className="space-y-2">
          <h3
            id="competencies-technical"
            className="heading-3 scroll-mt-24 competency-accent-orange"
          >
            {t('competenciesTechnicalSubtitle')}
          </h3>
          <p className="mb-6 max-w-3xl text-sm text-foreground/70">
            {technicalLeadParagraph}
          </p>
          <ul
            className="grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3"
            aria-labelledby="competencies-technical"
          >
            {competencyTechnicalItems.map(
              ({ Icon, anchorId, titleKey, descKey }, idx) => {
                const order = idx + 1;
                const fromApi = homeTechnicalByOrder.get(order);
                const cardTitle = (fromApi?.title ?? '').trim() || t(titleKey);
                const cardDescription =
                  (fromApi?.description ?? '').trim() || t(descKey);
                return (
                  <li
                    key={titleKey}
                    id={anchorId}
                    className="h-full min-h-0 scroll-mt-24"
                  >
                    <CompetencyCard
                      variant="technical"
                      title={cardTitle}
                      description={cardDescription}
                      icon={
                        <Icon
                          className="h-6 w-6"
                          aria-hidden
                          title={undefined}
                        />
                      }
                    />
                  </li>
                );
              }
            )}
          </ul>
        </div>
        <Link href="/expertise" className="btn-primary mt-8 inline-block">
          {t('expertiseMoreCta')}
        </Link>
      </Section>

      {/* Практический опыт / кейсы */}
      <Section id="cases" aria-labelledby="home-cases-heading">
        <h2
          id="home-cases-heading"
          className="heading-2 mb-2 font-semibold tracking-tight text-white"
        >
          {t('casesTitle')}
        </h2>
        {t('casesSubtitle').trim() ? (
          <p className="mb-8 max-w-3xl text-foreground/80">
            {t('casesSubtitle')}
          </p>
        ) : null}
        <ul className="flex list-none gap-4 overflow-x-auto pb-3 snap-x sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-3">
          {caseItems.map(({ Icon, titleKey, descKey, imageSrc }) => (
            <li
              key={titleKey}
              className="h-full min-w-[82%] min-h-0 snap-start sm:min-w-0"
            >
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
        <div className="mt-10 rounded-2xl border border-border bg-surface/70 p-5 sm:p-6">
          <h3 className="heading-3 text-foreground">
            {t('experienceSummaryTitle')}
          </h3>
          <ul className="mt-5 grid list-none gap-4 sm:grid-cols-3">
            {[
              'experienceSummaryIwe',
              'experienceSummaryElme',
              'experienceSummaryTeacher',
            ].map((key) => (
              <li
                key={key}
                className="rounded-xl border border-border bg-background/35 p-4 text-sm font-medium text-foreground/90"
              >
                {t(key)}
              </li>
            ))}
          </ul>
          <Link href="/experience" className="btn-secondary mt-6 inline-block">
            {t('experienceMoreCta')}
          </Link>
        </div>
      </Section>

      {/* Карточки инженерных калькуляторов */}
      <Section id="tools" variant="tools">
        <h2 className="heading-2 mb-2 font-semibold tracking-tight text-white">
          {t('toolsTitle')}
        </h2>
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
        <h2 className="heading-2 mb-2 font-semibold tracking-tight text-white">
          {t('blogTitle')}
        </h2>
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
        <h2 className="mb-4 text-[18px] font-semibold leading-snug tracking-tight text-white">
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
