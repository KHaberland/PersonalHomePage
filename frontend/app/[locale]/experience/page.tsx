import Image from 'next/image';
import { Link } from '@/i18n/navigation';
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
  { key: 'elme' as const },
  { key: 'buts' as const },
  { key: 'production' as const },
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
      context: t(`${id}Context`),
      problem: t(`${id}Problem`),
      engineeringAction: t(`${id}EngineeringAction`),
      result: t(`${id}Result`),
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
      <section className="mb-12 rounded-2xl border border-border bg-surface/60 p-6 sm:p-8 lg:p-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-accent-blue">
          {t('layerEyebrow')}
        </p>
        <h1 className="heading-1 text-accent-orange">{t('title')}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-foreground/85">
          {t('lead')}
        </p>
      </section>

      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-surface/45 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-6 md:p-10">
        <div
          className="pointer-events-none absolute inset-y-8 left-10 w-0.5 -translate-x-1/2 bg-gradient-to-b from-accent-orange/50 via-border to-border/40 sm:left-11 md:left-[3.75rem]"
          aria-hidden
        />

        <div className="space-y-6">
          {useApiTimeline
            ? apiExperience.map((exp, i) => {
                const yearLabel = `${exp.start_year} — ${exp.end_year ?? t('present')}`;
                return (
                  <article key={exp.id} className="relative pl-14 sm:pl-16">
                    <div className="absolute left-0 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-accent-orange shadow-[0_0_0_4px_var(--background)] ring-2 ring-accent-orange/30">
                      <span className="text-sm font-bold text-white">
                        {i + 1}
                      </span>
                    </div>
                    <div className="card p-5 sm:p-6">
                      <p className="mb-3 inline-flex rounded-full border border-accent-orange/40 bg-background/70 px-3 py-1 font-mono text-xs tabular-nums text-accent-orange">
                        {yearLabel}
                      </p>
                      <h2 className="heading-3 text-foreground">{exp.title}</h2>
                      <p className="mt-1 font-medium text-accent-orange">
                        {exp.company}
                      </p>
                      {exp.description?.trim() ? (
                        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-foreground/80">
                          {htmlToPlainText(exp.description)}
                        </p>
                      ) : null}
                    </div>
                  </article>
                );
              })
            : experiences.map(({ key }, i) => (
                <article key={key} className="relative pl-14 sm:pl-16">
                  <div className="absolute left-0 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-accent-orange shadow-[0_0_0_4px_var(--background)] ring-2 ring-accent-orange/30">
                    <span className="text-sm font-bold text-white">
                      {i + 1}
                    </span>
                  </div>
                  <div className="card p-5 sm:p-6">
                    <p className="mb-3 inline-flex rounded-full border border-accent-orange/40 bg-background/70 px-3 py-1 font-mono text-xs tabular-nums text-accent-orange">
                      {t(`${key}.period`)}
                    </p>
                    <h2 className="heading-3 text-foreground">
                      {t(`${key}.role`)}
                    </h2>
                    <p className="mt-1 font-medium text-accent-orange">
                      {t(`${key}.company`)}
                    </p>
                  </div>
                </article>
              ))}
        </div>
      </div>

      <section className="mt-16 scroll-mt-24 space-y-4" id="cases">
        <h2 className="heading-2 text-foreground">{t('casesTitle')}</h2>
        <p className="max-w-3xl text-foreground/85 leading-relaxed">
          {t('casesIntro')}
        </p>
        <ExperienceCaseAccordion items={caseItems} />
      </section>

      <section className="mt-16 rounded-2xl border border-accent-blue/30 bg-accent-blue/10 p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent-blue">
          {t('relatedPatternsEyebrow')}
        </p>
        <h2 className="heading-3 mt-2 text-foreground">
          {t('relatedPatternsTitle')}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-foreground/80">
          {t('relatedPatternsText')}
        </p>
        <Link
          href="/solutions"
          className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-accent-orange underline-offset-4 hover:underline"
        >
          {t('relatedPatternsCta')}
          <span aria-hidden>→</span>
        </Link>
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
