import { ScoreDisplay } from './ScoreDisplay';
import { WizardBackButton } from './WizardBackButton';
import type { WizardStepProps } from './types';

type StepResultProps = WizardStepProps & {
  onReset: () => void;
};

export function StepResult({
  calculator,
  text,
  onBack,
  onReset,
}: StepResultProps) {
  const gasInfo = calculator.getGasInfo();

  if (!gasInfo) {
    return (
      <p className="text-red-400">
        {text(
          'shieldingGas.wizard.errorGasNotFound',
          'Error: gas information not found'
        )}
      </p>
    );
  }

  const criteriaData = calculator.getCriteriaForGas(gasInfo.id);
  const averageScore = calculator.getCriteriaAverageScore(gasInfo.id);
  const isoShort = gasInfo.isoStandard?.replace('ISO EN 14175: ', '') ?? '';
  const isoFull = (gasInfo.isoStandardFull ?? '').trim();
  const isoText = isoFull ? `${isoShort} — ${isoFull}` : isoShort;

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-[color-mix(in_srgb,var(--foreground)_10%,transparent)]">
        <div className="bg-[color-mix(in_srgb,var(--accent-orange)_90%,black)] px-4 py-3">
          <h3 className="heading-3 text-white">{gasInfo.name}</h3>
        </div>
        <div className="space-y-4 p-4">
          {isoText && (
            <p className="text-sm text-foreground">
              <span className="font-semibold">
                {text(
                  'shieldingGas.wizard.isoLabel',
                  'ISO EN 14175 designation:'
                )}
              </span>{' '}
              {isoText}
            </p>
          )}

          {criteriaData && criteriaData.criteria.length > 0 && (
            <div className="space-y-3">
              {criteriaData.criteria.map((criterion) => (
                <div
                  key={criterion.id}
                  className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="text-sm font-medium text-foreground">
                    {criterion.label}
                  </span>
                  <ScoreDisplay score={criteriaData.scores[criterion.id]} />
                </div>
              ))}
            </div>
          )}

          {averageScore !== null && (
            <p className="text-sm text-foreground">
              <span className="font-semibold">
                {text('shieldingGas.wizard.totalScoreLabel', 'Overall score:')}
              </span>{' '}
              {averageScore.toFixed(1)}
            </p>
          )}

          <p className="caption text-foreground/65">
            {text(
              'shieldingGas.wizard.scoreNote',
              'Assessment is based on a relative 1–5 scale for welding mixtures, where 1 is the worst and 5 is the best.'
            )}
          </p>

          {gasInfo.application && (
            <div>
              <p className="text-sm font-semibold text-foreground">
                {text(
                  'shieldingGas.wizard.applicationLabel',
                  'Main application:'
                )}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-foreground/80">
                {gasInfo.application}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={onReset} className="btn-primary">
          {text('shieldingGas.wizard.reset', 'Start over')}
        </button>
        <WizardBackButton
          label={text('shieldingGas.wizard.back', 'Back')}
          onClick={onBack}
          className=""
        />
      </div>
    </>
  );
}
