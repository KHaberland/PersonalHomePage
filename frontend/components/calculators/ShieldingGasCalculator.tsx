'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { calculateShieldingGas } from '@/lib/api';

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-[#e6edf3]">
          {t('shieldingGas.wireDiameter')}
        </label>
        <select
          value={wireDiameter}
          onChange={(e) => setWireDiameter(e.target.value)}
          className="mt-1 w-full rounded border border-[#30363d] bg-[#0d1117] px-3 py-2 text-[#e6edf3]"
        >
          <option value="0.8">0.8</option>
          <option value="1.0">1.0</option>
          <option value="1.2">1.2</option>
          <option value="1.6">1.6</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-[#e6edf3]">
          {t('shieldingGas.material')}
        </label>
        <select
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
          className="mt-1 w-full rounded border border-[#30363d] bg-[#0d1117] px-3 py-2 text-[#e6edf3]"
        >
          <option value="steel">Steel</option>
          <option value="stainless">Stainless steel</option>
          <option value="aluminum">Aluminum</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-[#e6edf3]">
          {t('shieldingGas.process')}
        </label>
        <select
          value={process}
          onChange={(e) => setProcess(e.target.value)}
          className="mt-1 w-full rounded border border-[#30363d] bg-[#0d1117] px-3 py-2 text-[#e6edf3]"
        >
          <option value="MIG/MAG">MIG/MAG</option>
          <option value="TIG">TIG</option>
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
        <div className="space-y-2 rounded-lg border border-[#30363d] bg-[#161b22] p-4">
          <p className="text-[#f97316]">
            {t('shieldingGas.flowRange')}: {result.flow_rate_min}–
            {result.flow_rate_max} L/min
          </p>
          <p className="text-[#e6edf3]">
            {t('shieldingGas.typical')}: {result.flow_rate_typical} L/min
          </p>
        </div>
      )}
    </form>
  );
}
