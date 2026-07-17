/**
 * Единый паттерн: данные с API → при отсутствии — строки из messages (namespace home).
 */
import type { Calculator } from '@/lib/api-types';

/** Порядок и slug совпадают с прежним статическим списком на /tools */
export const FALLBACK_TOOLS_SPEC = [
  { slug: 'shielding-gas', key: 'shieldingGas' },
  { slug: 'heat-input', key: 'heatInput' },
  { slug: 'gas-flow', key: 'gasFlow' },
  { slug: 'gas-cutting', key: 'gasCutting' },
  { slug: 'welding-cost', key: 'weldingCost' },
  { slug: 'welding-parameters', key: 'weldingParameters' },
] as const;

export function buildFallbackTools(
  t: (key: string) => string
): Omit<Calculator, 'created_at'>[] {
  return FALLBACK_TOOLS_SPEC.map((item, i) => ({
    id: i + 1,
    slug: item.slug,
    name: t(`fallbackTool.${item.key}.name`),
    description: t(`fallbackTool.${item.key}.description`),
  }));
}

export const BLOG_FALLBACK_MESSAGE_KEYS = [
  {
    titleKey: 'blogFallbackCard1Title',
    excerptKey: 'blogFallbackCard1Excerpt',
  },
  {
    titleKey: 'blogFallbackCard2Title',
    excerptKey: 'blogFallbackCard2Excerpt',
  },
  {
    titleKey: 'blogFallbackCard3Title',
    excerptKey: 'blogFallbackCard3Excerpt',
  },
] as const;

export const BLOG_FALLBACK_CARD_COUNT = BLOG_FALLBACK_MESSAGE_KEYS.length;
