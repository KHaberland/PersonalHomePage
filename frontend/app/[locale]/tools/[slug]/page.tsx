import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { getTools } from '@/lib/api';
import { CALCULATOR_SLUGS, isCalculatorSlug } from '@/components/calculators';
import { loadCalculator } from '@/components/calculators/loadCalculator';
import { CalculatorStaticExample } from '@/components/calculators/CalculatorStaticExample';
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

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  if (!isCalculatorSlug(slug)) return {};
  const apiTools = await getTools().catch(() => []);
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

  if (!isCalculatorSlug(slug)) {
    notFound();
  }

  const apiTools = await getTools().catch(() => []);
  const tool =
    apiTools.find((t) => t.slug === slug) ??
    fallbackTools.find((t) => t.slug === slug);

  const CalculatorComponent = await loadCalculator(slug);
  if (!CalculatorComponent) notFound();

  const tCalc = await getTranslations({ locale, namespace: 'calculators' });
  const pageBase = `pages.${slug}`;
  const lead = tCalc(`${pageBase}.lead` as 'pages.heat-input.lead');
  const exampleTitle = tCalc(
    `${pageBase}.exampleTitle` as 'pages.heat-input.exampleTitle'
  );
  const exampleCaption = tCalc(
    `${pageBase}.exampleCaption` as 'pages.heat-input.exampleCaption'
  );
  const exampleSectionTitle = tCalc('exampleSectionTitle');

  return (
    <div className="container-narrow section">
      <h1 className="heading-1 mb-4 text-accent-orange">
        {tool?.name ?? slug}
      </h1>
      <p className="mb-8 max-w-3xl text-lg leading-relaxed text-foreground/85">
        {lead}
      </p>

      <section
        className="mb-8 rounded-xl border border-foreground/10 bg-foreground/[0.03] p-6"
        aria-labelledby="calc-example-heading"
      >
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-foreground/55">
          {exampleSectionTitle}
        </p>
        <h2
          id="calc-example-heading"
          className="heading-3 mb-3 text-foreground"
        >
          {exampleTitle}
        </h2>
        <p className="mb-4 text-sm text-foreground/70">{exampleCaption}</p>
        <CalculatorStaticExample slug={slug} />
      </section>

      <div className="card p-6">
        <CalculatorComponent />
      </div>
    </div>
  );
}
