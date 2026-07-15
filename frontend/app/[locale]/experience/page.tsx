import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { setRequestLocale } from 'next-intl/server';
import {
  ExperienceCaseAccordion,
  type ExperienceCaseItem,
} from '@/components/ExperienceCaseAccordion';
import { Section } from '@/components/Section';
import { getExperience } from '@/lib/api';
import type { Lang } from '@/lib/api-types';
import { getCmsPage } from '@/lib/cms-content';
import { htmlToPlainText } from '@/lib/html-to-plain-text';
import { createPageMetadata } from '@/lib/metadata';

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

function buildCaseItems(text: (key: string) => string): ExperienceCaseItem[] {
  const ids = ['case1', 'case2', 'case3'] as const;
  return ids.map((id) => {
    const href = text(`${id}MoreHref`).trim();
    const label = text(`${id}MoreLabel`).trim();
    return {
      id: `${id}-slot`,
      title: text(`${id}Title`),
      summary: text(`${id}Summary`),
      context: text(`${id}Context`),
      problem: text(`${id}Problem`),
      engineeringAction: text(`${id}EngineeringAction`),
      result: text(`${id}Result`),
      moreHref: href || undefined,
      moreLabel: href && label ? label : undefined,
    };
  });
}

export default async function ExperiencePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = langFromLocale(locale);

  const [apiExperience, content] = await Promise.all([
    getExperience(lang).catch(() => []),
    getCmsPage('experience', locale),
  ]);
  const experienceText = (key: string) => content.ui?.[key] || '';
  const caseText = (key: string) => content.cases?.[key] || '';

  const caseItems = buildCaseItems(caseText);
  const caseLabels = {
    toggleShow: experienceText('caseToggleShow'),
    toggleHide: experienceText('caseToggleHide'),
    context: experienceText('caseContextLabel'),
    problem: experienceText('caseProblemLabel'),
    engineeringAction: experienceText('caseEngineeringActionLabel'),
    result: experienceText('caseResultLabel'),
  };

  return (
    <Section container="narrow" bordered={false} scrollMargin={false}>
      <section className="card-highlight mb-12">
        <p className="eyebrow-blue mb-3">{experienceText('layerEyebrow')}</p>
        <h1 className="heading-1 text-accent-orange">
          {experienceText('title')}
        </h1>
        <p className="lead mt-6 max-w-3xl">{experienceText('lead')}</p>
      </section>

      <div className="card-highlight relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-y-8 left-10 w-0.5 -translate-x-1/2 bg-gradient-to-b from-accent-orange/50 via-border to-border/40 sm:left-11 md:left-[3.75rem]"
          aria-hidden
        />

        <div className="space-y-6">
          {apiExperience.map((exp, i) => {
            const yearLabel = `${exp.start_year} — ${
              exp.end_year ?? experienceText('present')
            }`;
            return (
              <article key={exp.id} className="relative pl-14 sm:pl-16">
                <div className="absolute left-0 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-accent-orange shadow-[0_0_0_4px_var(--background)] ring-2 ring-accent-orange/30">
                  <span className="text-sm font-bold text-white">{i + 1}</span>
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
          })}
        </div>
      </div>

      <section className="mt-16 scroll-mt-24 space-y-4" id="cases">
        <h2 className="heading-2 text-foreground">
          {experienceText('casesTitle')}
        </h2>
        <p className="max-w-3xl leading-relaxed text-foreground/80">
          {experienceText('casesIntro')}
        </p>
        <ExperienceCaseAccordion items={caseItems} labels={caseLabels} />
      </section>

      <section className="card-cta-blue mt-16">
        <p className="eyebrow-blue">
          {experienceText('relatedPatternsEyebrow')}
        </p>
        <h2 className="heading-3 mt-2 text-foreground">
          {experienceText('relatedPatternsTitle')}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-foreground/80">
          {experienceText('relatedPatternsText')}
        </p>
        <Link
          href="/solutions"
          className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-accent-orange underline-offset-4 hover:underline"
        >
          {experienceText('relatedPatternsCta')}
          <span aria-hidden>→</span>
        </Link>
      </section>

      <section className="mt-16">
        <h2 className="heading-2 mb-6 text-foreground">
          {experienceText('photosTitle')}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {experiencePhotos.map((name) => (
            <div
              key={name}
              className="relative aspect-video overflow-hidden rounded-lg border border-border"
            >
              <Image
                src={`/images/photos/${name}`}
                alt={experienceText('photosTitle')}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
          ))}
        </div>
      </section>
    </Section>
  );
}
