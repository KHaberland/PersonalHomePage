'use client';

import { useId, type ReactNode } from 'react';

type Props = {
  label: ReactNode;
  hint?: string;
  children: (ids: { inputId: string; hintId?: string }) => React.ReactNode;
};

/**
 * Подпись поля, опциональная подсказка (aria-describedby) и передача id в инпут/select.
 */
export function CalculatorField({ label, hint, children }: Props) {
  const reactId = useId();
  const base = `calc-field-${reactId.replace(/:/g, '')}`;
  const inputId = `${base}-input`;
  const hintId = hint ? `${base}-hint` : undefined;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-foreground"
      >
        {label}
      </label>
      {hint && (
        <p id={hintId} className="caption mt-1">
          {hint}
        </p>
      )}
      <div className="mt-1">{children({ inputId, hintId })}</div>
    </div>
  );
}
