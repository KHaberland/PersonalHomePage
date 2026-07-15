import { WizardBackButton } from './WizardBackButton';
import { WizardSelectCard } from './WizardSelectCard';
import type { WizardStepProps } from './types';

type StepThicknessProps = WizardStepProps & {
  onSelect: (thicknessId: string) => void;
};

export function StepThickness({
  calculator,
  text,
  onBack,
  onSelect,
}: StepThicknessProps) {
  const thicknesses = calculator.getAvailableThicknesses();

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {thicknesses.map((option) => (
          <WizardSelectCard
            key={option.id}
            id={`thickness-${option.id}`}
            label={option.label}
            selected={calculator.selectedThickness === option.id}
            onClick={() => onSelect(option.id)}
          />
        ))}
      </div>
      <WizardBackButton
        label={text('shieldingGas.wizard.back', 'Back')}
        onClick={onBack}
      />
    </>
  );
}
