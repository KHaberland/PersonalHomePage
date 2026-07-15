import { WizardBackButton } from './WizardBackButton';
import { WizardSelectCard } from './WizardSelectCard';
import type { WizardStepProps } from './types';

type StepProcessProps = WizardStepProps & {
  onSelect: (process: string) => void;
};

export function StepProcess({
  calculator,
  text,
  onBack,
  onSelect,
}: StepProcessProps) {
  const processes = calculator.getAvailableProcesses();

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {processes.map((process) => (
          <WizardSelectCard
            key={process}
            id={`process-${process}`}
            label={process}
            selected={calculator.selectedProcess === process}
            onClick={() => onSelect(process)}
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
