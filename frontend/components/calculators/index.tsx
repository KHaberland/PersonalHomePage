export const CALCULATOR_SLUGS = [
  'heat-input',
  'gas-flow',
  'shielding-gas',
  'gas-cutting',
  'welding-cost',
  'welding-parameters',
] as const;

export type CalculatorSlug = (typeof CALCULATOR_SLUGS)[number];

export function isCalculatorSlug(slug: string): slug is CalculatorSlug {
  return (CALCULATOR_SLUGS as readonly string[]).includes(slug);
}
