import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getTools } from '@/lib/api';
import {
  getCalculatorComponent,
  isCalculatorSlug,
} from '@/components/calculators';

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

  const CalculatorComponent = getCalculatorComponent(slug);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-[#f97316]">
        {tool?.name ?? slug}
      </h1>
      <div className="rounded-lg border border-[#30363d] bg-[#161b22] p-6">
        <CalculatorComponent />
      </div>
    </div>
  );
}
