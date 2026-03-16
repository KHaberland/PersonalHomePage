'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { calculateGasFlow } from '@/lib/api';

export function GasFlowCalculator() {
  const t = useTranslations('calculators');
  const [flowRate, setFlowRate] = useState('');
  const [weldingTime, setWeldingTime] = useState('');
  const [cylinderVolume, setCylinderVolume] = useState('');
  const [result, setResult] = useState<{
    consumption_l: number;
    cylinder_duration_min: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    const fr = parseFloat(flowRate);
    const wt = parseFloat(weldingTime);
    const cv = parseFloat(cylinderVolume);
    if (isNaN(fr) || isNaN(wt) || isNaN(cv) || fr <= 0) {
      setError(`${t('errorInvalid')} ${t('errorFlowPositive')}`);
      return;
    }
    setLoading(true);
    try {
      const res = await calculateGasFlow({
        flow_rate: fr,
        welding_time_min: wt,
        cylinder_volume_l: cv,
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
          {t('gasFlow.flowRate')}
        </label>
        <input
          type="number"
          step="0.1"
          value={flowRate}
          onChange={(e) => setFlowRate(e.target.value)}
          className="input-industrial mt-1 w-full"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground">
          {t('gasFlow.weldingTime')}
        </label>
        <input
          type="number"
          step="0.1"
          value={weldingTime}
          onChange={(e) => setWeldingTime(e.target.value)}
          className="input-industrial mt-1 w-full"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground">
          {t('gasFlow.cylinderVolume')}
        </label>
        <input
          type="number"
          step="1"
          value={cylinderVolume}
          onChange={(e) => setCylinderVolume(e.target.value)}
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
        <div className="card space-y-2 p-4">
          <p className="text-accent-orange">
            {t('gasFlow.consumption')}: {result.consumption_l} L
          </p>
          <p className="text-accent-orange">
            {t('gasFlow.cylinderDuration')}: {result.cylinder_duration_min} min
          </p>
        </div>
      )}
    </form>
  );
}
