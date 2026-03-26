'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { calculateHeatInput } from '@/lib/api';
import { CalculatorField } from '@/components/calculators/CalculatorField';

export function HeatInputCalculator() {
  const t = useTranslations('calculators');
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
      setError(`${t('errorInvalid')} ${t('errorSpeedPositive')}`);
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
        err instanceof Error ? err.message : t('errorCalculationFailed')
      );
    } finally {
      setLoading(false);
    }
  }

  const hv = t('heatInput.hints.voltage');
  const hc = t('heatInput.hints.current');
  const hs = t('heatInput.hints.travelSpeed');

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CalculatorField label={t('heatInput.voltage')} hint={hv}>
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
      <CalculatorField label={t('heatInput.current')} hint={hc}>
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
      <CalculatorField label={t('heatInput.travelSpeed')} hint={hs}>
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
        {loading ? t('calculating') : t('calculate')}
      </button>
      {error && <p className="text-red-400">{error}</p>}
      {result && (
        <div className="card p-4">
          <p className="text-lg font-semibold text-accent-orange">
            {t('heatInput.result')}: {result.heat_input_kj_mm} kJ/mm
          </p>
        </div>
      )}
    </form>
  );
}
