'use client';

import { useState } from 'react';
import { calculateHeatInput } from '@/lib/api';
import { CalculatorField } from '@/components/calculators/CalculatorField';
import type { CalculatorProps } from '@/components/calculators';

export function HeatInputCalculator({ texts }: CalculatorProps) {
  const text = (key: string) => texts?.[key] ?? '';
  const [voltage, setVoltage] = useState('');
  const [current, setCurrent] = useState('');
  const [travelSpeed, setTravelSpeed] = useState('');
  const [result, setResult] = useState<{ heat_input_kj_mm: number } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    const v = parseFloat(voltage);
    const c = parseFloat(current);
    const s = parseFloat(travelSpeed);
    if (isNaN(v) || isNaN(c) || isNaN(s) || s <= 0) {
      setError(`${text('errorInvalid')} ${text('errorSpeedPositive')}`);
      return;
    }
    setLoading(true);
    try {
      const res = await calculateHeatInput({
        voltage: v,
        current: c,
        travel_speed: s,
      });
      setResult(res);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : text('errorCalculationFailed')
      );
    } finally {
      setLoading(false);
    }
  }

  const hv = text('heatInput.hints.voltage');
  const hc = text('heatInput.hints.current');
  const hs = text('heatInput.hints.travelSpeed');

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CalculatorField label={text('heatInput.voltage')} hint={hv}>
        {({ inputId, hintId }) => (
          <input
            id={inputId}
            type="number"
            step="0.1"
            value={voltage}
            onChange={(e) => setVoltage(e.target.value)}
            className="input-industrial w-full"
            required
            aria-describedby={hintId}
            title={hv}
          />
        )}
      </CalculatorField>
      <CalculatorField label={text('heatInput.current')} hint={hc}>
        {({ inputId, hintId }) => (
          <input
            id={inputId}
            type="number"
            step="0.1"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className="input-industrial w-full"
            required
            aria-describedby={hintId}
            title={hc}
          />
        )}
      </CalculatorField>
      <CalculatorField label={text('heatInput.travelSpeed')} hint={hs}>
        {({ inputId, hintId }) => (
          <input
            id={inputId}
            type="number"
            step="1"
            value={travelSpeed}
            onChange={(e) => setTravelSpeed(e.target.value)}
            className="input-industrial w-full"
            required
            aria-describedby={hintId}
            title={hs}
          />
        )}
      </CalculatorField>
      <button
        type="submit"
        disabled={loading}
        className="btn-primary disabled:opacity-50"
      >
        {loading ? text('calculating') : text('calculate')}
      </button>
      {error && <p className="text-red-400">{error}</p>}
      {result && (
        <div className="card p-4">
          <p className="text-lg font-semibold text-accent-orange">
            {text('heatInput.result')}: {result.heat_input_kj_mm} kJ/mm
          </p>
        </div>
      )}
    </form>
  );
}
