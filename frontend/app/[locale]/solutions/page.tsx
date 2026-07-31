import { Link } from '@/i18n/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Section } from '@/components/Section';
import {
  IconServiceTigTorch,
  IconServiceGasSelection,
  IconServiceImplementation,
  IconServiceOpenBook,
  IconServiceTraining,
} from '@/components/icons';
import { getCmsPage } from '@/lib/cms-content';
import { cmsText } from '@/lib/cms-page-text';
import { createPageMetadata } from '@/lib/metadata';

const CMS_PAGE = 'solutions';

const solutionItems = [
  {
    Icon: IconServiceTigTorch,
    anchorId: 'solutions-defect-reduction',
    itemKey: 'defectReduction',
  },
  {
    Icon: IconServiceImplementation,
    anchorId: 'solutions-process-optimization',
    itemKey: 'processOptimization',
  },
  {
    Icon: IconServiceGasSelection,
    anchorId: 'solutions-gas-selection',
    itemKey: 'gasSelection',
  },
  {
    Icon: IconServiceTraining,
    anchorId: 'solutions-training',
    itemKey: 'training',
  },
  {
    Icon: IconServiceOpenBook,
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
    tone: 'blue',
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
  const solutionsCms = (block: string, key: string) =>
    cmsText(CMS_PAGE, block, key, solutionText(block, key));
  const solutionListEntries = (section: string, listKey: string) =>
    Object.entries(content[section] ?? {})
      .filter(([key]) => key.startsWith(`${listKey}_`))
      .sort(
        ([left], [right]) =>
          Number(left.split('_').at(-1)) - Number(right.split('_').at(-1))
      )
      .map(([key, value]) => ({ key, value: String(value) }))
      .filter(({ value }) => value);

  return (
    <Section bordered={false} scrollMargin={false}>
      <section className="card-highlight">
        <p className="eyebrow-blue mb-3">
          {solutionsCms('hero', 'heroEyebrow')}
        </p>
        <h1 className="heading-1 text-accent-orange">
          {solutionsCms('hero', 'title')}
        </h1>
        <p className="lead mt-6 max-w-3xl">{solutionsCms('hero', 'lead')}</p>
      </section>

      <section className="card-cta-blue-compact mt-8">
        <p className="eyebrow-blue">
          {solutionsCms('validation', 'validationEyebrow')}
        </p>
        <h2 className="heading-3 mt-2 text-foreground">
          {solutionsCms('validation', 'validationTitle')}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-foreground/80">
          {solutionsCms('validation', 'validationText')}
        </p>
        <Link
          href="/experience"
          className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-accent-orange underline-offset-4 hover:underline"
        >
          {solutionsCms('validation', 'validationCta')}
          <span aria-hidden>→</span>
        </Link>
      </section>

      <nav className="mt-12" aria-label={solutionText('nav', 'navAriaLabel')}>
        <h2 className="heading-2 text-foreground">
          {solutionsCms('nav', 'navTitle')}
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {solutionItems.map(({ Icon, anchorId, itemKey }) => (
            <a
              key={anchorId}
              href={`#${anchorId}`}
              className="card card-nav group flex h-full flex-col p-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-orange"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-orange/10 text-accent-orange transition-colors group-hover:bg-accent-orange/20">
                <Icon className="h-6 w-6" aria-hidden title={undefined} />
              </div>
              <h3 className="heading-3 mt-4 text-foreground">
                {solutionsCms(`nav_${itemKey}`, 'title')}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/80">
                {solutionsCms(`nav_${itemKey}`, 'description')}
              </p>
              <span className="mt-5 text-sm font-semibold text-accent-orange">
                {solutionsCms('nav', 'navReadMore')}
              </span>
            </a>
          ))}
        </div>
      </nav>

      <div className="mt-14 space-y-8">
        {solutionItems.map(({ anchorId, itemKey }, index) => {
          const sectionBlock = `section_${itemKey}`;

          return (
            <section
              key={anchorId}
              id={anchorId}
              className="card-highlight-soft scroll-mt-28"
            >
              <div>
                <div>
                  <p className="eyebrow-blue">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h2 className="heading-2 mt-2 text-foreground">
                    {solutionsCms(sectionBlock, 'title')}
                  </h2>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                {sectionColumns.map((column) => {
                  const { labelKey, listKey, className } = column;
                  const isBlue = 'tone' in column && column.tone === 'blue';
                  const items = solutionListEntries(sectionBlock, listKey);

                  return (
                    <div
                      key={listKey}
                      className={`card-nested card-passive ${isBlue ? 'card-passive--blue' : ''} ${className}`}
                    >
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
                        {solutionsCms('labels', labelKey)}
                      </h3>
                      <ul
                        className={`list-row-hover mt-4 space-y-3 text-sm leading-relaxed text-foreground/80 ${isBlue ? 'list-row-hover--blue' : ''}`}
                      >
                        {items.map(({ key, value }) => (
                          <li key={key} className="flex gap-2">
                            <span
                              className={`list-row-bullet mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${isBlue ? 'bg-accent-blue' : 'bg-accent-orange'}`}
                            />
                            <span>
                              {cmsText(CMS_PAGE, sectionBlock, key, value)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <section className="card-cta mt-12">
        <h2 className="heading-3 text-foreground">
          {solutionsCms('final_cta', 'finalCtaTitle')}
        </h2>
        <p className="mt-3 max-w-3xl text-foreground/80">
          {solutionsCms('final_cta', 'finalCtaText')}
        </p>
        <Link href="/contact" className="btn-primary mt-6 inline-block">
          {solutionsCms('final_cta', 'finalCtaContact')}
        </Link>
      </section>
    </Section>
  );
}
