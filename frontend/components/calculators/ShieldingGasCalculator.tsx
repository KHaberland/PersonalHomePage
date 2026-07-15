'use client';

import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { useLocale } from 'next-intl';
import { getShieldingGasCatalog } from '@/lib/api';
import type { Lang } from '@/lib/api-types';
import { createCalculator } from '@/lib/shielding-gas/catalog';
import type { Calculator } from '@/lib/shielding-gas/calculator';
import type { CalculatorProps } from '@/components/calculators';
import { WizardProgress } from './shielding-gas/WizardProgress';
import { StepMaterial } from './shielding-gas/StepMaterial';
import { StepProcess } from './shielding-gas/StepProcess';
import { StepThickness } from './shielding-gas/StepThickness';
import { StepGas } from './shielding-gas/StepGas';
import { StepResult } from './shielding-gas/StepResult';

function langFromLocale(locale: string): Lang {
  return locale === 'en' || locale === 'ru' || locale === 'lv'
    ? (locale as Lang)
    : 'en';
}

export function ShieldingGasCalculator({ texts }: CalculatorProps) {
  const locale = useLocale();
  const lang = langFromLocale(locale);

  const text = useCallback(
    (key: string, fallback?: string) => texts?.[key] ?? fallback ?? '',
    [texts]
  );

  const [fetchResult, setFetchResult] = useState<{
    lang: Lang;
    calculator: Calculator | null;
    error: string | null;
  } | null>(null);
  const [step, setStep] = useState(1);
  const [, rerender] = useReducer((n: number) => n + 1, 0);

  useEffect(() => {
    let cancelled = false;

    getShieldingGasCatalog(lang)
      .then((catalog) => {
        if (cancelled) return;
        setFetchResult({
          lang,
          calculator: createCalculator(catalog),
          error: null,
        });
        setStep(1);
      })
      .catch((err) => {
        if (cancelled) return;
        setFetchResult({
          lang,
          calculator: null,
          error:
            err instanceof Error
              ? err.message
              : text('errorCalculationFailed', 'Calculation failed'),
        });
      });

    return () => {
      cancelled = true;
    };
  }, [lang, text]);

  const ready = fetchResult?.lang === lang;
  const loading = !ready;
  const calculator = ready ? fetchResult.calculator : null;
  const error = ready ? fetchResult.error : null;

  const stepLabels = useMemo(
    () => [
      text('shieldingGas.wizard.stepMaterial', 'Material'),
      text('shieldingGas.wizard.stepProcess', 'Process'),
      text('shieldingGas.wizard.stepThickness', 'Thickness'),
      text('shieldingGas.wizard.stepGas', 'Gas'),
      text('shieldingGas.wizard.stepResult', 'Result'),
    ],
    [text]
  );

  const goToStep = useCallback(
    (target: number) => {
      if (!calculator || target < 1 || target > 5) return;

      if (target === 1) {
        calculator.reset();
      } else if (target === 2 && !calculator.selectedMaterial) {
        return;
      } else if (
        target === 3 &&
        (!calculator.selectedMaterial || !calculator.selectedProcess)
      ) {
        return;
      } else if (
        target === 4 &&
        (!calculator.selectedMaterial ||
          !calculator.selectedProcess ||
          !calculator.selectedThickness)
      ) {
        return;
      } else if (
        target === 5 &&
        (!calculator.selectedMaterial ||
          !calculator.selectedProcess ||
          !calculator.selectedThickness ||
          !calculator.selectedGas)
      ) {
        return;
      }

      setStep(target);
      rerender();
    },
    [calculator]
  );

  const handleReset = useCallback(() => {
    calculator?.reset();
    setStep(1);
    rerender();
  }, [calculator]);

  const handleSelectMaterial = useCallback(
    (materialId: string) => {
      if (calculator?.selectMaterial(materialId)) {
        setStep(2);
        rerender();
      }
    },
    [calculator]
  );

  const handleSelectProcess = useCallback(
    (process: string) => {
      if (calculator?.selectProcess(process)) {
        setStep(3);
        rerender();
      }
    },
    [calculator]
  );

  const handleSelectThickness = useCallback(
    (thicknessId: string) => {
      if (calculator?.selectThickness(thicknessId)) {
        setStep(4);
        rerender();
      }
    },
    [calculator]
  );

  const handleSelectGas = useCallback(
    (gasId: string) => {
      if (calculator?.selectGas(gasId)) {
        setStep(5);
        rerender();
      }
    },
    [calculator]
  );

  if (loading) {
    return (
      <p className="text-foreground/70" aria-live="polite">
        {text('calculating', 'Loading…')}
      </p>
    );
  }

  if (error || !calculator) {
    return (
      <p className="text-red-400">{error ?? text('errorCalculationFailed')}</p>
    );
  }

  const sharedProps = { calculator, text };

  return (
    <div className="sg-wizard">
      <WizardProgress currentStep={step} labels={stepLabels} />

      {step === 1 && (
        <StepMaterial {...sharedProps} onSelect={handleSelectMaterial} />
      )}
      {step === 2 && (
        <StepProcess
          {...sharedProps}
          onSelect={handleSelectProcess}
          onBack={() => goToStep(1)}
        />
      )}
      {step === 3 && (
        <StepThickness
          {...sharedProps}
          onSelect={handleSelectThickness}
          onBack={() => goToStep(2)}
        />
      )}
      {step === 4 && (
        <StepGas
          {...sharedProps}
          onSelect={handleSelectGas}
          onBack={() => goToStep(3)}
        />
      )}
      {step === 5 && (
        <StepResult
          {...sharedProps}
          onReset={handleReset}
          onBack={() => goToStep(4)}
        />
      )}
    </div>
  );
}
