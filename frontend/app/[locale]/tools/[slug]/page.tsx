import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { getTools } from '@/lib/api';
import {
  isCalculatorSlug,
  type CalculatorSlug,
} from '@/components/calculators';
import { createPageMetadata } from '@/lib/metadata';

/** Динамическая загрузка калькуляторов для code splitting */
async function loadCalculator(slug: CalculatorSlug) {
  switch (slug) {
    case 'heat-input':
      return (await import('@/components/calculators/HeatInputCalculator'))
        .HeatInputCalculator;
    case 'gas-flow':
      return (await import('@/components/calculators/GasFlowCalculator'))
        .GasFlowCalculator;
    case 'shielding-gas':
      return (await import('@/components/calculators/ShieldingGasCalculator'))
        .ShieldingGasCalculator;
    case 'gas-cutting':
      return (await import('@/components/calculators/GasCuttingCalculator'))
        .GasCuttingCalculator;
    case 'welding-cost':
      return (await import('@/components/calculators/WeldingCostCalculator'))
        .WeldingCostCalculator;
    case 'welding-parameters':
      return (
        await import('@/components/calculators/WeldingParametersCalculator')
      ).WeldingParametersCalculator;
    default:
      return null;
  }
}

export function generateStaticParams() {
  return [
    { slug: 'heat-input' },
    { slug: 'gas-flow' },
    { slug: 'shielding-gas' },
    { slug: 'gas-cutting' },
    { slug: 'welding-cost' },
    { slug: 'welding-parameters' },
  ];
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

  return (
    <div className="container-narrow section">
      <h1 className="heading-1 mb-8 text-accent-orange">
        {tool?.name ?? slug}
      </h1>
      <div className="card p-6">
        <CalculatorComponent />
      </div>
    </div>
  );
}
