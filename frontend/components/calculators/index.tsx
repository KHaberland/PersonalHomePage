import { HeatInputCalculator } from './HeatInputCalculator';
import { GasFlowCalculator } from './GasFlowCalculator';
import { ShieldingGasCalculator } from './ShieldingGasCalculator';
import { GasCuttingCalculator } from './GasCuttingCalculator';
import { WeldingCostCalculator } from './WeldingCostCalculator';
import { WeldingParametersCalculator } from './WeldingParametersCalculator';

const CALCULATOR_SLUGS = [
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

const CALCULATOR_COMPONENTS: Record<CalculatorSlug, React.ComponentType> = {
  'heat-input': HeatInputCalculator,
  'gas-flow': GasFlowCalculator,
  'shielding-gas': ShieldingGasCalculator,
  'gas-cutting': GasCuttingCalculator,
  'welding-cost': WeldingCostCalculator,
  'welding-parameters': WeldingParametersCalculator,
};

export function getCalculatorComponent(slug: CalculatorSlug) {
  return CALCULATOR_COMPONENTS[slug];
}
