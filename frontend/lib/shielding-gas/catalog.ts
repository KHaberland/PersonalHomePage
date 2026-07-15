import { Calculator } from './calculator';
import type { ShieldingGasCatalog } from './types';

export function createCalculator(catalog: ShieldingGasCatalog): Calculator {
  return new Calculator(catalog);
}
