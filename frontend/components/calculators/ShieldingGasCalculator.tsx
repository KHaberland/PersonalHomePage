'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { calculateShieldingGas } from '@/lib/api';
import { CalculatorField } from '@/components/calculators/CalculatorField';

export function ShieldingGasCalculator() {
  const t = useTranslations('calculators');
  const [wireDiameter, setWireDiameter] = useState('1.2');
  const [material, setMaterial] = useState('steel');
  const [process, setProcess] = useState('MIG/MAG');
  const [result, setResult] = useState<{
    flow_rate_min: number;
    flow_rate_max: number;
    flow_rate_typical: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    const wd = parseFloat(wireDiameter);
    if (isNaN(wd) || wd <= 0) {
      setError(t('errorWireDiameter'));
      return;
    }
    setLoading(true);
    try {
      const res = await calculateShieldingGas({
        wire_diameter_mm: wd,
        material,
        process,
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

  const hw = t('shieldingGas.hints.wireDiameter');
  const hm = t('shieldingGas.hints.material');
  const hp = t('shieldingGas.hints.process');

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CalculatorField label={t('shieldingGas.wireDiameter')} hint={hw}>
        {({ inputId, hintId }) => (
          <select
            id={inputId}
            value={wireDiameter}
            onChange={(e) => setWireDiameter(e.target.value)}
            className="input-industrial w-full"
            aria-describedby={hintId}
            title={hw}
          >
            <option value="0.8">0.8</option>
            <option value="1.0">1.0</option>
            <option value="1.2">1.2</option>
            <option value="1.6">1.6</option>
          </select>
        )}
      </CalculatorField>
      <CalculatorField label={t('shieldingGas.material')} hint={hm}>
        {({ inputId, hintId }) => (
          <select
            id={inputId}
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="input-industrial w-full"
            aria-describedby={hintId}
            title={hm}
          >
            <option value="steel">Steel</option>
            <option value="stainless">Stainless steel</option>
            <option value="aluminum">Aluminum</option>
          </select>
        )}
      </CalculatorField>
      <CalculatorField label={t('shieldingGas.process')} hint={hp}>
        {({ inputId, hintId }) => (
          <select
            id={inputId}
            value={process}
            onChange={(e) => setProcess(e.target.value)}
            className="input-industrial w-full"
            aria-describedby={hintId}
            title={hp}
          >
            <option value="MIG/MAG">MIG/MAG</option>
            <option value="TIG">TIG</option>
          </select>
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
        <div className="card space-y-2 p-4">
          <p className="text-accent-orange">
            {t('shieldingGas.flowRange')}: {result.flow_rate_min}–
            {result.flow_rate_max} L/min
          </p>
          <p className="text-foreground">
            {t('shieldingGas.typical')}: {result.flow_rate_typical} L/min
          </p>
        </div>
      )}
    </form>
  );
}
