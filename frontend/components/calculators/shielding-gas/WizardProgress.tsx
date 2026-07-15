type WizardProgressProps = {
  currentStep: number;
  labels: string[];
};

export function WizardProgress({ currentStep, labels }: WizardProgressProps) {
  const progress = (currentStep / 5) * 100;

  return (
    <div className="mb-8">
      <div
        className="sg-wizard-progress-track mb-4"
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={5}
        aria-label={`Step ${currentStep} of 5`}
      >
        <div
          className="sg-wizard-progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>
      <ol className="sg-wizard-stepper">
        {labels.map((label, index) => {
          const step = index + 1;
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;
          return (
            <li
              key={label}
              className={`sg-wizard-step ${
                isActive
                  ? 'sg-wizard-step-active'
                  : isCompleted
                    ? 'sg-wizard-step-completed'
                    : ''
              }`}
              aria-current={isActive ? 'step' : undefined}
            >
              <span className="sg-wizard-step-number">{step}</span>
              <span className="sg-wizard-step-label">{label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
