import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { getTools } from '@/lib/api';
import { CALCULATOR_SLUGS, isCalculatorSlug } from '@/components/calculators';
import { loadCalculator } from '@/components/calculators/loadCalculator';
import { CalculatorStaticExample } from '@/components/calculators/CalculatorStaticExample';
import { Section } from '@/components/Section';
import type { Lang } from '@/lib/api-types';
import {
  getCalculatorChromeText,
  getCalculatorPageText,
  getCalculatorProps,
} from '@/lib/calculator-content';
import { getCmsPage } from '@/lib/cms-content';
import { createPageMetadata } from '@/lib/metadata';

export function generateStaticParams() {
  return CALCULATOR_SLUGS.map((slug) => ({ slug }));
}

const fallbackTools: { name: string; slug: string }[] = [
  { name: 'Shielding Gas Calculator', slug: 'shielding-gas' },
  { name: 'Heat Input Calculator', slug: 'heat-input' },
  { name: 'Gas Flow Calculator', slug: 'gas-flow' },
  { name: 'Gas Cutting Calculator', slug: 'gas-cutting' },
  { name: 'Welding Cost Calculator', slug: 'welding-cost' },
  { name: 'Welding Parameters Calculator', slug: 'welding-parameters' },
];

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

function langFromLocale(locale: string): Lang {
  return locale === 'en' || locale === 'ru' || locale === 'lv'
    ? (locale as Lang)
    : 'en';
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  if (!isCalculatorSlug(slug)) return {};
  const lang = langFromLocale(locale);
  const apiTools = await getTools(lang).catch(() => []);
  const tool =
    apiTools.find((t) => t.slug === slug) ??
    fallbackTools.find((t) => t.slug === slug);
  const toolName = tool?.name ?? slug;
  const t = await getTranslations({ locale, namespace: 'seo' });
  const baseDesc = t('toolsDescription');
  return createPageMetadata({
    locale,
    title: toolName,
    description: `${toolName}. ${baseDesc}`,
    path: `/tools/${slug}`,
  });
}

export default async function CalculatorPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const lang = langFromLocale(locale);

  if (!isCalculatorSlug(slug)) {
    notFound();
  }

  const [apiTools, content] = await Promise.all([
    getTools(lang).catch(() => []),
    getCmsPage('calculators', locale),
  ]);
  const tool =
    apiTools.find((t) => t.slug === slug) ??
    fallbackTools.find((t) => t.slug === slug);

  const CalculatorComponent = await loadCalculator(slug);
  if (!CalculatorComponent) notFound();

  const calculatorFallback = () => '';
  const pageText = getCalculatorPageText(content, slug, calculatorFallback);
  const chromeText = getCalculatorChromeText(content, calculatorFallback);
  const calculatorProps = getCalculatorProps(content, slug, calculatorFallback);

  return (
    <Section container="narrow" bordered={false} scrollMargin={false}>
      <h1 className="heading-1 mb-4 text-accent-orange">
        {tool?.name ?? slug}
      </h1>
      <p className="lead mb-8 max-w-3xl">{pageText.lead}</p>

      <section
        className="card-subtle mb-8"
        aria-labelledby="calc-example-heading"
      >
        <p className="caption mb-1 font-medium uppercase tracking-wide">
          {chromeText.exampleSectionTitle}
        </p>
        <h2
          id="calc-example-heading"
          className="heading-3 mb-3 text-foreground"
        >
          {pageText.exampleTitle}
        </h2>
        <p className="caption mb-4">{pageText.exampleCaption}</p>
        <CalculatorStaticExample slug={slug} />
      </section>

      <section
        className="card-accent mb-8"
        aria-labelledby="calc-engineering-note-heading"
      >
        <h2
          id="calc-engineering-note-heading"
          className="heading-3 mb-2 text-foreground"
        >
          {chromeText.engineeringNoteTitle}
        </h2>
        <p className="text-sm leading-relaxed text-foreground/80">
          {chromeText.engineeringNote}
        </p>
      </section>

      <div className="card p-6">
        <CalculatorComponent {...calculatorProps} />
      </div>

      <section className="card-subtle mt-8">
        <h2 className="heading-3 mb-2 text-foreground">
          {chromeText.validationCtaTitle}
        </h2>
        <p className="text-sm leading-relaxed text-foreground/80">
          {chromeText.validationCtaText}
        </p>
        <Link href="/contact" className="link-accent mt-4 inline-block text-sm">
          {chromeText.validationCta} →
        </Link>
      </section>
    </Section>
  );
}
