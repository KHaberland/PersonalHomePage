import type { Calculator } from '@/lib/shielding-gas/calculator';

export type WizardTextFn = (key: string, fallback?: string) => string;

export type WizardStepProps = {
  calculator: Calculator;
  text: WizardTextFn;
  onBack: () => void;
};

export type WizardSelectProps = WizardStepProps & {
  onSelect: () => void;
};
