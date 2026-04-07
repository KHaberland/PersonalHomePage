import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import {
  ExperienceCaseAccordion,
  type ExperienceCaseItem,
} from '@/components/ExperienceCaseAccordion';
import { getExperience } from '@/lib/api';
import type { Lang } from '@/lib/api-types';
import { htmlToPlainText } from '@/lib/html-to-plain-text';
import { createPageMetadata } from '@/lib/metadata';

const experiences = [
  { key: 'elme' as const, order: 1, yearBadge: '2015' },
  { key: 'buts' as const, order: 2, yearBadge: '2013' },
  { key: 'production' as const, order: 3, yearBadge: '—' },
];

const experiencePhotos = [
  'DSC_2992.jpg',
  'DSC_3010.jpg',
  'IMG20250618100959.jpg',
];

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
    titleKey: 'experienceTitle',
    descriptionKey: 'experienceDescription',
    path: '/experience',
  });
}

function buildCaseItems(t: (key: string) => string): ExperienceCaseItem[] {
  const ids = ['case1', 'case2', 'case3'] as const;
  return ids.map((id) => {
    const href = t(`${id}MoreHref`).trim();
    const label = t(`${id}MoreLabel`).trim();
    return {
      id: `${id}-slot`,
      title: t(`${id}Title`),
      summary: t(`${id}Summary`),
      detail: t(`${id}Detail`),
      moreHref: href || undefined,
      moreLabel: href && label ? label : undefined,
    };
  });
}

export default async function ExperiencePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = langFromLocale(locale);

  const [t, apiExperience] = await Promise.all([
    getTranslations('experience'),
    getExperience(lang).catch(() => []),
  ]);

  const useApiTimeline = apiExperience.length > 0;
  const caseItems = buildCaseItems(t);

  return (
    <div className="container-narrow section">
      <h1 className="heading-1 mb-12 text-accent-orange">{t('title')}</h1>

      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-surface/45 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:p-10">
        <div
          className="pointer-events-none absolute inset-y-8 left-4 w-0.5 bg-gradient-to-b from-accent-orange/50 via-border to-border/40 md:left-1/2 md:-translate-x-px"
          aria-hidden
        />

        {useApiTimeline
          ? apiExperience.map((exp, i) => {
              const yearLabel = `${exp.start_year} — ${exp.end_year ?? t('present')}`;
              return (
                <div
                  key={exp.id}
                  className={`relative flex flex-col gap-4 py-8 md:flex-row md:gap-8 ${
                    i % 2 === 1 ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  <div className="relative z-10 ml-8 flex shrink-0 items-center gap-3 md:ml-0 md:left-1/2 md:-translate-x-1/2">
                    <span className="inline-flex min-w-[5.5rem] justify-center rounded-full border border-accent-orange/40 bg-background/90 px-2 py-1 font-mono text-xs tabular-nums text-accent-orange">
                      {yearLabel}
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-orange shadow-[0_0_0_4px_var(--background)] ring-2 ring-accent-orange/30">
                      <span className="text-sm font-bold text-white">
                        {i + 1}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`ml-14 flex-1 md:ml-0 md:px-8 ${
                      i % 2 === 1 ? 'md:text-right' : 'md:pl-16'
                    }`}
                  >
                    <h2 className="heading-3 text-foreground">{exp.title}</h2>
                    <p className="text-accent-orange">{exp.company}</p>
                    {exp.description?.trim() ? (
                      <p
                        className={`mt-3 max-w-xl text-sm text-foreground/80 ${
                          i % 2 === 1 ? 'md:ml-auto' : ''
                        }`}
                      >
                        {htmlToPlainText(exp.description)}
                      </p>
                    ) : null}
                  </div>

                  <div className="ml-14 md:ml-0 md:w-1/2" />
                </div>
              );
            })
          : experiences.map(({ key, yearBadge }, i) => (
              <div
                key={key}
                className={`relative flex flex-col gap-4 py-8 md:flex-row md:gap-8 ${
                  i % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className="relative z-10 ml-8 flex shrink-0 items-center gap-3 md:ml-0 md:left-1/2 md:-translate-x-1/2">
                  <span className="inline-flex min-w-[3rem] justify-center rounded-full border border-accent-orange/40 bg-background/90 px-2 py-1 font-mono text-xs tabular-nums text-accent-orange">
                    {yearBadge}
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-orange shadow-[0_0_0_4px_var(--background)] ring-2 ring-accent-orange/30">
                    <span className="text-sm font-bold text-white">
                      {i + 1}
                    </span>
                  </div>
                </div>

                <div
                  className={`ml-14 flex-1 md:ml-0 md:px-8 ${
                    i % 2 === 1 ? 'md:text-right' : 'md:pl-16'
                  }`}
                >
                  <h2 className="heading-3 text-foreground">
                    {t(`${key}.role`)}
                  </h2>
                  <p className="text-accent-orange">{t(`${key}.company`)}</p>
                  <p className="text-sm text-foreground/70">
                    {t(`${key}.period`)}
                  </p>
                </div>

                <div className="ml-14 md:ml-0 md:w-1/2" />
              </div>
            ))}
      </div>

      <section className="mt-16 scroll-mt-24 space-y-4" id="cases">
        <h2 className="heading-2 text-foreground">{t('casesTitle')}</h2>
        <p className="max-w-3xl text-foreground/85 leading-relaxed">
          {t('casesIntro')}
        </p>
        <ExperienceCaseAccordion items={caseItems} />
      </section>

      <section className="mt-16 space-y-4">
        <h2 className="heading-2 text-foreground">{t('projectsTitle')}</h2>
        <p className="max-w-3xl text-foreground/85 leading-relaxed">
          {t('projectsIntro')}
        </p>
      </section>

      <section className="mt-12 space-y-4">
        <h2 className="heading-2 text-foreground">{t('resultsTitle')}</h2>
        <p className="max-w-3xl text-foreground/85 leading-relaxed">
          {t('resultsIntro')}
        </p>
      </section>

      <section className="mt-12 space-y-4">
        <h2 className="heading-2 text-foreground">{t('testimonialsTitle')}</h2>
        <blockquote className="card border-l-4 border-l-accent-orange p-6 text-foreground/90">
          <p className="italic leading-relaxed">{t('testimonial1')}</p>
          <footer className="mt-4 text-sm text-foreground/65">
            {t('testimonialAttribution')}
          </footer>
        </blockquote>
      </section>

      <section className="mt-16">
        <h2 className="heading-2 mb-6 text-foreground">{t('photosTitle')}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {experiencePhotos.map((name) => (
            <div
              key={name}
              className="relative aspect-video overflow-hidden rounded-lg border border-border"
            >
              <Image
                src={`/images/photos/${name}`}
                alt={t('photosTitle')}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
