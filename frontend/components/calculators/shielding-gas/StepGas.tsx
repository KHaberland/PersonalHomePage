import { WizardBackButton } from './WizardBackButton';
import { WizardSelectCard } from './WizardSelectCard';
import type { WizardStepProps } from './types';

type StepGasProps = WizardStepProps & {
  onSelect: (gasId: string) => void;
};

export function StepGas({ calculator, text, onBack, onSelect }: StepGasProps) {
  const gases = calculator.getAvailableGases();
  const rootRequired = calculator.isRootProtectionRequired();
  const rootGases = rootRequired ? calculator.getRootProtectionGases() : [];
  const rootWarning = rootRequired
    ? calculator.getRootProtectionWarning()
    : null;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {gases.map((gas) => (
          <WizardSelectCard
            key={gas.id}
            id={`gas-${gas.id}`}
            label={gas.name}
            selected={calculator.selectedGas === gas.id}
            size="sm"
            onClick={() => onSelect(gas.id)}
          />
        ))}
      </div>

      {rootRequired && rootWarning && (
        <div className="card-accent mt-6 space-y-3" role="alert">
          <h3 className="heading-3 text-foreground">
            {text('shieldingGas.wizard.importantAlert', 'Important!')}
          </h3>
          <p className="text-sm leading-relaxed text-foreground/80">
            {rootWarning}
          </p>
          {rootGases.length > 0 && (
            <>
              <p className="text-sm font-semibold text-foreground">
                {text(
                  'shieldingGas.wizard.rootProtectionGases',
                  'Root protection gases:'
                )}
              </p>
              <ul className="list-inside list-disc text-sm text-foreground/80">
                {rootGases.map((gas) => (
                  <li key={gas.id}>{gas.name}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      <WizardBackButton
        label={text('shieldingGas.wizard.back', 'Back')}
        onClick={onBack}
      />
    </>
  );
}
