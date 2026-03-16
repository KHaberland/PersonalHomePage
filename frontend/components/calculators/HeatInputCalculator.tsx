'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { calculateHeatInput } from '@/lib/api';

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground">
          {t('heatInput.voltage')}
        </label>
        <input
          type="number"
          step="0.1"
          value={voltage}
          onChange={(e) => setVoltage(e.target.value)}
          className="input-industrial mt-1 w-full"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground">
          {t('heatInput.current')}
        </label>
        <input
          type="number"
          step="0.1"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          className="input-industrial mt-1 w-full"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground">
          {t('heatInput.travelSpeed')}
        </label>
        <input
          type="number"
          step="1"
          value={travelSpeed}
          onChange={(e) => setTravelSpeed(e.target.value)}
          className="input-industrial mt-1 w-full"
          required
        />
      </div>
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
