'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { calculateWeldingParameters } from '@/lib/api';
import { CalculatorField } from '@/components/calculators/CalculatorField';

export function WeldingParametersCalculator() {
  const t = useTranslations('calculators');
  const [plateThickness, setPlateThickness] = useState('');
  const [jointType, setJointType] = useState('butt');
  const [wireDiameter, setWireDiameter] = useState('1.2');
  const [result, setResult] = useState<{
    current_a: number;
    voltage_v: number;
    travel_speed_mm_min: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    const pt = parseFloat(plateThickness);
    const wd = parseFloat(wireDiameter);
    if (isNaN(pt) || pt <= 0 || isNaN(wd) || wd <= 0) {
      setError(`${t('errorInvalid')} ${t('errorPlateThickness')}`);
      return;
    }
    setLoading(true);
    try {
      const res = await calculateWeldingParameters({
        plate_thickness_mm: pt,
        joint_type: jointType,
        wire_diameter_mm: wd,
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

  const h1 = t('weldingParameters.hints.plateThickness');
  const h2 = t('weldingParameters.hints.jointType');
  const h3 = t('weldingParameters.hints.wireDiameter');

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CalculatorField label={t('weldingParameters.plateThickness')} hint={h1}>
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
      <CalculatorField label={t('weldingParameters.jointType')} hint={h2}>
        {({ inputId, hintId }) => (
          <select
            id={inputId}
            value={jointType}
            onChange={(e) => setJointType(e.target.value)}
            className="input-industrial w-full"
            aria-describedby={hintId}
            title={h2}
          >
            <option value="butt">Butt</option>
            <option value="fillet">Fillet</option>
            <option value="lap">Lap</option>
            <option value="corner">Corner</option>
          </select>
        )}
      </CalculatorField>
      <CalculatorField label={t('weldingParameters.wireDiameter')} hint={h3}>
        {({ inputId, hintId }) => (
          <select
            id={inputId}
            value={wireDiameter}
            onChange={(e) => setWireDiameter(e.target.value)}
            className="input-industrial w-full"
            aria-describedby={hintId}
            title={h3}
          >
            <option value="0.8">0.8</option>
            <option value="1.0">1.0</option>
            <option value="1.2">1.2</option>
            <option value="1.6">1.6</option>
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
            {t('weldingParameters.current')}: {result.current_a} A
          </p>
          <p className="text-accent-orange">
            {t('weldingParameters.voltage')}: {result.voltage_v} V
          </p>
          <p className="text-accent-orange">
            {t('weldingParameters.travelSpeed')}: {result.travel_speed_mm_min}{' '}
            mm/min
          </p>
        </div>
      )}
    </form>
  );
}
