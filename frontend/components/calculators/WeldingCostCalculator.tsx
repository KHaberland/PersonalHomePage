'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { calculateWeldingCost } from '@/lib/api';
import { CalculatorField } from '@/components/calculators/CalculatorField';

export function WeldingCostCalculator() {
  const t = useTranslations('calculators');
  const [wirePrice, setWirePrice] = useState('');
  const [gasPrice, setGasPrice] = useState('');
  const [cylinderVolume, setCylinderVolume] = useState('');
  const [depositionRate, setDepositionRate] = useState('');
  const [weldingTime, setWeldingTime] = useState('');
  const [result, setResult] = useState<{
    wire_consumption_kg: number;
    gas_consumption_l: number;
    cylinders_used: number;
    wire_cost: number;
    gas_cost: number;
    total_cost: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    const wp = parseFloat(wirePrice);
    const gp = parseFloat(gasPrice);
    const cv = parseFloat(cylinderVolume);
    const dr = parseFloat(depositionRate);
    const wt = parseFloat(weldingTime);
    if ([wp, gp, cv, dr, wt].some(isNaN) || cv <= 0) {
      setError(`${t('errorInvalid')} ${t('errorCylinderVolume')}`);
      return;
    }
    setLoading(true);
    try {
      const res = await calculateWeldingCost({
        wire_price_per_kg: wp,
        gas_price_per_cylinder: gp,
        cylinder_volume_l: cv,
        deposition_rate_kg_h: dr,
        welding_time_h: wt,
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

  const ha = t('weldingCost.hints.wirePrice');
  const hb = t('weldingCost.hints.gasPrice');
  const hc = t('weldingCost.hints.cylinderVolume');
  const hd = t('weldingCost.hints.depositionRate');
  const he = t('weldingCost.hints.weldingTime');

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CalculatorField label={t('weldingCost.wirePrice')} hint={ha}>
        {({ inputId, hintId }) => (
          <input
            id={inputId}
            type="number"
            step="0.01"
            value={wirePrice}
            onChange={(e) => setWirePrice(e.target.value)}
            className="input-industrial w-full"
            required
            aria-describedby={hintId}
            title={ha}
          />
        )}
      </CalculatorField>
      <CalculatorField label={t('weldingCost.gasPrice')} hint={hb}>
        {({ inputId, hintId }) => (
          <input
            id={inputId}
            type="number"
            step="0.01"
            value={gasPrice}
            onChange={(e) => setGasPrice(e.target.value)}
            className="input-industrial w-full"
            required
            aria-describedby={hintId}
            title={hb}
          />
        )}
      </CalculatorField>
      <CalculatorField label={t('weldingCost.cylinderVolume')} hint={hc}>
        {({ inputId, hintId }) => (
          <input
            id={inputId}
            type="number"
            step="1"
            value={cylinderVolume}
            onChange={(e) => setCylinderVolume(e.target.value)}
            className="input-industrial w-full"
            required
            aria-describedby={hintId}
            title={hc}
          />
        )}
      </CalculatorField>
      <CalculatorField label={t('weldingCost.depositionRate')} hint={hd}>
        {({ inputId, hintId }) => (
          <input
            id={inputId}
            type="number"
            step="0.01"
            value={depositionRate}
            onChange={(e) => setDepositionRate(e.target.value)}
            className="input-industrial w-full"
            required
            aria-describedby={hintId}
            title={hd}
          />
        )}
      </CalculatorField>
      <CalculatorField label={t('weldingCost.weldingTime')} hint={he}>
        {({ inputId, hintId }) => (
          <input
            id={inputId}
            type="number"
            step="0.1"
            value={weldingTime}
            onChange={(e) => setWeldingTime(e.target.value)}
            className="input-industrial w-full"
            required
            aria-describedby={hintId}
            title={he}
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
          <p className="text-foreground">
            {t('weldingCost.wireConsumption')}: {result.wire_consumption_kg} kg
          </p>
          <p className="text-foreground">
            {t('weldingCost.gasConsumption')}: {result.gas_consumption_l} L
          </p>
          <p className="text-foreground">
            {t('weldingCost.cylindersUsed')}: {result.cylinders_used}
          </p>
          <p className="text-foreground">
            {t('weldingCost.wireCost')}: {result.wire_cost}
          </p>
          <p className="text-foreground">
            {t('weldingCost.gasCost')}: {result.gas_cost}
          </p>
          <p className="text-lg font-semibold text-accent-orange">
            {t('weldingCost.totalCost')}: {result.total_cost}
          </p>
        </div>
      )}
    </form>
  );
}
