import type { ComponentType } from 'react';
import type { CalculatorSlug } from './index';

/** Единый реестр: новый калькулятор — одна строка здесь, без дублирования разметки страницы. */
const loaders: Record<
  CalculatorSlug,
  () => Promise<{ default: ComponentType<object> }>
> = {
  'heat-input': () =>
    import('./HeatInputCalculator').then((m) => ({
      default: m.HeatInputCalculator,
    })),
  'gas-flow': () =>
    import('./GasFlowCalculator').then((m) => ({
      default: m.GasFlowCalculator,
    })),
  'shielding-gas': () =>
    import('./ShieldingGasCalculator').then((m) => ({
      default: m.ShieldingGasCalculator,
    })),
  'gas-cutting': () =>
    import('./GasCuttingCalculator').then((m) => ({
      default: m.GasCuttingCalculator,
    })),
  'welding-cost': () =>
    import('./WeldingCostCalculator').then((m) => ({
      default: m.WeldingCostCalculator,
    })),
  'welding-parameters': () =>
    import('./WeldingParametersCalculator').then((m) => ({
      default: m.WeldingParametersCalculator,
    })),
};

export async function loadCalculator(
  slug: CalculatorSlug
): Promise<ComponentType<object> | null> {
  const load = loaders[slug];
  if (!load) return null;
  const mod = await load();
  return mod.default ?? null;
}
