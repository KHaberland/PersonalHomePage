'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { calculateGasCutting } from '@/lib/api';
import { CalculatorField } from '@/components/calculators/CalculatorField';

export function GasCuttingCalculator() {
  const t = useTranslations('calculators');
  const [plateThickness, setPlateThickness] = useState('');
  const [gasType, setGasType] = useState('acetylene');
  const [cuttingSpeed, setCuttingSpeed] = useState('');
  const [result, setResult] = useState<{
    o2_pressure_bar: number;
    fuel_flow_l_h: number;
    cutting_speed_m_min?: number | null;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    const pt = parseFloat(plateThickness);
    if (isNaN(pt) || pt <= 0) {
      setError(t('errorPlateThickness'));
      return;
    }
    setLoading(true);
    try {
      const res = await calculateGasCutting({
        plate_thickness_mm: pt,
        gas_type: gasType,
        cutting_speed_m_min: cuttingSpeed
          ? parseFloat(cuttingSpeed)
          : undefined,
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

  const h1 = t('gasCutting.hints.plateThickness');
  const h2 = t('gasCutting.hints.gasType');
  const h3 = t('gasCutting.hints.cuttingSpeed');

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CalculatorField label={t('gasCutting.plateThickness')} hint={h1}>
        {({ inputId, hintId }) => (
          <input
            id={inputId}
            type="number"
            step="0.1"
            value={plateThickness}
            onChange={(e) => setPlateThickness(e.target.value)}
            className="input-industrial w-full"
            required
            aria-describedby={hintId}
            title={h1}
          />
        )}
      </CalculatorField>
      <CalculatorField label={t('gasCutting.gasType')} hint={h2}>
        {({ inputId, hintId }) => (
          <select
            id={inputId}
            value={gasType}
            onChange={(e) => setGasType(e.target.value)}
            className="input-industrial w-full"
            aria-describedby={hintId}
            title={h2}
          >
            <option value="acetylene">Acetylene</option>
            <option value="propane">Propane</option>
          </select>
        )}
      </CalculatorField>
      <CalculatorField label={t('gasCutting.cuttingSpeed')} hint={h3}>
        {({ inputId, hintId }) => (
          <input
            id={inputId}
            type="number"
            step="0.1"
            value={cuttingSpeed}
            onChange={(e) => setCuttingSpeed(e.target.value)}
            className="input-industrial w-full"
            placeholder={t('gasCutting.cuttingSpeedPlaceholder')}
            aria-describedby={hintId}
            title={h3}
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
        <div className="card space-y-2 p-4">
          <p className="text-accent-orange">
            {t('gasCutting.o2Pressure')}: {result.o2_pressure_bar} bar
          </p>
          <p className="text-accent-orange">
            {t('gasCutting.fuelFlow')}: {result.fuel_flow_l_h} L/h
          </p>
        </div>
      )}
    </form>
  );
}
