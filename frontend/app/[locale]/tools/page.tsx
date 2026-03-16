import { Link } from '@/i18n/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { getTools } from '@/lib/api';
import type { Calculator } from '@/lib/api-types';

const fallbackTools: Omit<Calculator, 'id' | 'created_at'>[] = [
  {
    name: 'Shielding Gas Calculator',
    description: 'Calculate recommended shielding gas flow rate',
    slug: 'shielding-gas',
  },
  {
    name: 'Heat Input Calculator',
    description: 'Calculate heat input from voltage, current and travel speed',
    slug: 'heat-input',
  },
  {
    name: 'Gas Flow Calculator',
    description: 'Estimate gas consumption and cylinder duration',
    slug: 'gas-flow',
  },
  {
    name: 'Gas Cutting Calculator',
    description: 'Gas cutting parameters for plate thickness',
    slug: 'gas-cutting',
  },
  {
    name: 'Welding Cost Calculator',
    description: 'Estimate welding cost from wire, gas and time',
    slug: 'welding-cost',
  },
  {
    name: 'Welding Parameters Calculator',
    description: 'Recommended welding parameters by thickness',
    slug: 'welding-parameters',
  },
];

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ToolsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, apiTools] = await Promise.all([
    getTranslations('home'),
    getTools().catch(() => []),
  ]);

  const tools =
    apiTools.length > 0
      ? apiTools
      : fallbackTools.map((item, i) => ({
          ...item,
          id: i + 1,
          created_at: '',
        }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-4 text-3xl font-bold text-[#f97316]">
        {t('toolsTitle')}
      </h1>
      <p className="mb-12 text-[#e6edf3]/80">{t('toolsDescription')}</p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            href={`/tools/${tool.slug}`}
            className="block rounded-lg border border-[#30363d] bg-[#161b22] p-6 transition-colors hover:border-[#f97316]"
          >
            <h2 className="text-xl font-semibold text-[#e6edf3]">
              {tool.name}
            </h2>
            <p className="mt-2 text-[#e6edf3]/70">{tool.description}</p>
            <span className="mt-4 inline-block text-sm text-[#f97316]">
              {t('toolsCta')} →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
