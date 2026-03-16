'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { calculateWeldingParameters } from '@/lib/api';

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground">
          {t('weldingParameters.plateThickness')}
        </label>
        <input
          type="number"
          step="0.1"
          value={plateThickness}
          onChange={(e) => setPlateThickness(e.target.value)}
          className="input-industrial mt-1 w-full"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground">
          {t('weldingParameters.jointType')}
        </label>
        <select
          value={jointType}
          onChange={(e) => setJointType(e.target.value)}
          className="input-industrial mt-1 w-full"
        >
          <option value="butt">Butt</option>
          <option value="fillet">Fillet</option>
          <option value="lap">Lap</option>
          <option value="corner">Corner</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground">
          {t('weldingParameters.wireDiameter')}
        </label>
        <select
          value={wireDiameter}
          onChange={(e) => setWireDiameter(e.target.value)}
          className="input-industrial mt-1 w-full"
        >
          <option value="0.8">0.8</option>
          <option value="1.0">1.0</option>
          <option value="1.2">1.2</option>
          <option value="1.6">1.6</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded bg-[#f97316] px-4 py-2 font-medium text-white hover:bg-[#ea580c] disabled:opacity-50"
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
