'use client';

import { useId } from 'react';

type Props = {
  label: string;
  hint: string;
  children: (ids: { inputId: string; hintId: string }) => React.ReactNode;
};

/**
 * Подпись поля, текст подсказки (aria-describedby) и передача id в инпут/select.
 * На элемент ввода добавьте title={hint} и aria-describedby={hintId} из render-prop.
 */
export function CalculatorField({ label, hint, children }: Props) {
  const reactId = useId();
  const base = `calc-field-${reactId.replace(/:/g, '')}`;
  const inputId = `${base}-input`;
  const hintId = `${base}-hint`;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-foreground"
      >
        {label}
      </label>
      <p id={hintId} className="mt-1 text-xs text-foreground/65">
        {hint}
      </p>
      <div className="mt-1">{children({ inputId, hintId })}</div>
    </div>
  );
}
