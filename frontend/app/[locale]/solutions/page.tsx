import { Link } from '@/i18n/navigation';
import { setRequestLocale } from 'next-intl/server';
import {
  IconCompetencyGas,
  IconServiceConsulting,
  IconServiceImplementation,
  IconServiceTraining,
} from '@/components/icons';
import { getCmsPage } from '@/lib/cms-content';
import { createPageMetadata } from '@/lib/metadata';

const solutionItems = [
  {
    Icon: IconServiceConsulting,
    anchorId: 'solutions-defect-reduction',
    itemKey: 'defectReduction',
  },
  {
    Icon: IconServiceImplementation,
    anchorId: 'solutions-process-optimization',
    itemKey: 'processOptimization',
  },
  {
    Icon: IconCompetencyGas,
    anchorId: 'solutions-gas-selection',
    itemKey: 'gasSelection',
  },
  {
    Icon: IconServiceTraining,
    anchorId: 'solutions-training',
    itemKey: 'training',
  },
  {
    Icon: IconServiceImplementation,
    anchorId: 'solutions-wps-support',
    itemKey: 'wpsSupport',
  },
] as const;

const sectionColumns = [
  {
    labelKey: 'problem',
    listKey: 'problems',
    className: 'border-accent-orange/25 bg-accent-orange/10',
  },
  {
    labelKey: 'cause',
    listKey: 'causes',
    className: 'border-border bg-background/35',
  },
  {
    labelKey: 'engineeringAnalysis',
    listKey: 'analysisItems',
    className: 'border-accent-blue/25 bg-accent-blue/10',
  },
  {
    labelKey: 'solution',
    listKey: 'solutionSteps',
    className: 'border-border bg-background/35',
  },
  {
    labelKey: 'expectedResult',
    listKey: 'expectedResults',
    className: 'border-border bg-background/35',
  },
] as const;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return createPageMetadata({
    locale,
    titleKey: 'solutionsTitle',
    descriptionKey: 'solutionsDescription',
    path: '/solutions',
  });
}

export default async function SolutionsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = await getCmsPage('solutions', locale);
  const solutionText = (section: string, key: string) =>
    content[section]?.[key] || '';
  const solutionList = (section: string, listKey: string) =>
    Object.entries(content[section] ?? {})
      .filter(([key]) => key.startsWith(`${listKey}_`))
      .sort(
        ([left], [right]) =>
          Number(left.split('_').at(-1)) - Number(right.split('_').at(-1))
      )
      .map(([, value]) => value)
      .filter(Boolean);

  return (
    <div className="container-wide section">
      <section className="rounded-2xl border border-border bg-surface/60 p-6 sm:p-8 lg:p-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-accent-blue">
          {solutionText('hero', 'heroEyebrow')}
        </p>
        <h1 className="heading-1 text-accent-orange">
          {solutionText('hero', 'title')}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-foreground/85">
          {solutionText('hero', 'lead')}
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-accent-blue/30 bg-accent-blue/10 p-5 sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent-blue">
          {solutionText('validation', 'validationEyebrow')}
        </p>
        <h2 className="heading-3 mt-2 text-foreground">
          {solutionText('validation', 'validationTitle')}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-foreground/80">
          {solutionText('validation', 'validationText')}
        </p>
        <Link
          href="/experience"
          className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-accent-orange underline-offset-4 hover:underline"
        >
          {solutionText('validation', 'validationCta')}
          <span aria-hidden>→</span>
        </Link>
      </section>

      <nav className="mt-12" aria-label={solutionText('nav', 'navAriaLabel')}>
        <h2 className="heading-2 text-foreground">
          {solutionText('nav', 'navTitle')}
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {solutionItems.map(({ Icon, anchorId, itemKey }) => (
            <a
              key={anchorId}
              href={`#${anchorId}`}
              className="card group flex h-full flex-col p-5 transition-transform duration-200 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-orange"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-orange/10 text-accent-orange transition-colors group-hover:bg-accent-orange/20">
                <Icon className="h-6 w-6" aria-hidden title={undefined} />
              </div>
              <h3 className="heading-3 mt-4 text-foreground">
                {solutionText(`nav_${itemKey}`, 'title')}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/80">
                {solutionText(`nav_${itemKey}`, 'description')}
              </p>
              <span className="mt-5 text-sm font-semibold text-accent-orange">
                {solutionText('nav', 'navReadMore')}
              </span>
            </a>
          ))}
        </div>
      </nav>

      <div className="mt-14 space-y-8">
        {solutionItems.map(({ anchorId, itemKey }, index) => (
          <section
            key={anchorId}
            id={anchorId}
            className="scroll-mt-28 rounded-2xl border border-border bg-surface/70 p-6 sm:p-8"
          >
            <div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-accent-blue">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h2 className="heading-2 mt-2 text-foreground">
                  {solutionText(`section_${itemKey}`, 'title')}
                </h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {sectionColumns.map(({ labelKey, listKey, className }) => {
                const items = solutionList(`section_${itemKey}`, listKey);

                return (
                  <div
                    key={listKey}
                    className={`rounded-xl border p-5 ${className}`}
                  >
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
                      {solutionText('labels', labelKey)}
                    </h3>
                    <ul className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/80">
                      {items.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-orange" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <section className="mt-12 rounded-2xl border border-accent-orange/30 bg-accent-orange/10 p-6 sm:p-8">
        <h2 className="heading-3 text-foreground">
          {solutionText('final_cta', 'finalCtaTitle')}
        </h2>
        <p className="mt-3 max-w-3xl text-foreground/80">
          {solutionText('final_cta', 'finalCtaText')}
        </p>
        <Link href="/contact" className="btn-primary mt-6 inline-block">
          {solutionText('final_cta', 'finalCtaContact')}
        </Link>
      </section>
    </div>
  );
}
