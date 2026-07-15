'use client';

import { useState } from 'react';
import { calculateShieldingGas } from '@/lib/api';
import { CalculatorField } from '@/components/calculators/CalculatorField';
import type { CalculatorProps } from '@/components/calculators';

export function ShieldingGasCalculator({ texts }: CalculatorProps) {
  const text = (key: string, fallback?: string) =>
    texts?.[key] ?? fallback ?? '';
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
      setError(text('errorWireDiameter'));
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
        err instanceof Error ? err.message : text('errorCalculationFailed')
      );
    } finally {
      setLoading(false);
    }
  }

  const hw = text('shieldingGas.hints.wireDiameter');
  const hm = text('shieldingGas.hints.material');
  const hp = text('shieldingGas.hints.process');

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CalculatorField label={text('shieldingGas.wireDiameter')} hint={hw}>
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
      <CalculatorField label={text('shieldingGas.material')} hint={hm}>
        {({ inputId, hintId }) => (
          <select
            id={inputId}
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="input-industrial w-full"
            aria-describedby={hintId}
            title={hm}
          >
            <option value="steel">
              {text('shieldingGas.options.steel', 'Steel')}
            </option>
            <option value="stainless">
              {text('shieldingGas.options.stainless', 'Stainless steel')}
            </option>
            <option value="aluminum">
              {text('shieldingGas.options.aluminum', 'Aluminum')}
            </option>
          </select>
        )}
      </CalculatorField>
      <CalculatorField label={text('shieldingGas.process')} hint={hp}>
        {({ inputId, hintId }) => (
          <select
            id={inputId}
            value={process}
            onChange={(e) => setProcess(e.target.value)}
            className="input-industrial w-full"
            aria-describedby={hintId}
            title={hp}
          >
            <option value="MIG/MAG">
              {text('shieldingGas.options.migMag', 'MIG/MAG')}
            </option>
            <option value="TIG">
              {text('shieldingGas.options.tig', 'TIG')}
            </option>
          </select>
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
        <div className="card space-y-2 p-4">
          <p className="text-accent-orange">
            {text('shieldingGas.flowRange')}: {result.flow_rate_min}–
            {result.flow_rate_max} L/min
          </p>
          <p className="text-foreground">
            {text('shieldingGas.typical')}: {result.flow_rate_typical} L/min
          </p>
        </div>
      )}
    </form>
  );
}
