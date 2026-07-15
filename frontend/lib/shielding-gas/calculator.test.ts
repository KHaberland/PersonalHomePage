import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createCalculator } from './catalog';
import type { ShieldingGasCatalog } from './types';

const LOCALE_KEYS = new Set(['en', 'ru', 'lv', 'de', 'lt', 'et']);

function isLocaleMap(value: Record<string, unknown>): boolean {
  return Object.keys(value).some((key) => LOCALE_KEYS.has(key));
}

function pickLocalized(value: unknown, lang: string): unknown {
  if (value == null || typeof value !== 'object') {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => pickLocalized(item, lang));
  }

  const record = value as Record<string, unknown>;
  if (isLocaleMap(record)) {
    for (const candidate of [lang, 'en', 'ru', 'lv']) {
      const localized = record[candidate];
      if (typeof localized === 'string' && localized.trim()) {
        return localized;
      }
    }
    for (const localized of Object.values(record)) {
      if (typeof localized === 'string' && localized.trim()) {
        return localized;
      }
    }
    return '';
  }

  return Object.fromEntries(
    Object.entries(record).map(([key, item]) => [
      key,
      pickLocalized(item, lang),
    ])
  );
}

function loadLocalizedCatalog(lang: 'en' | 'ru' | 'lv'): ShieldingGasCatalog {
  const catalogPath = join(
    __dirname,
    '../../../backend/apps/calculators/shielding_gas_catalog.json'
  );
  const raw = JSON.parse(readFileSync(catalogPath, 'utf-8'));
  return pickLocalized(raw, lang) as ShieldingGasCatalog;
}

const MVP_SCENARIOS = [
  {
    id: 1,
    material: 'fe-steel',
    process: 'MAG',
    thickness: 'thin',
    gases: ['ferroline-c6x1', 'ferroline-c8'],
    rootProtection: false,
  },
  {
    id: 2,
    material: 'fe-steel',
    process: 'MAG',
    thickness: 'thick',
    gases: ['ferroline-c25', 'ferroline-c18', 'ferroline-c12x2'],
    rootProtection: false,
  },
  {
    id: 3,
    material: 'fe-steel',
    process: 'TIG',
    thickness: 'thin',
    gases: ['ar'],
    rootProtection: false,
  },
  {
    id: 4,
    material: 'fe-steel',
    process: 'TIG',
    thickness: 'thick',
    gases: ['aluline-he30'],
    rootProtection: false,
  },
  {
    id: 5,
    material: 'cr-ni-steel',
    process: 'MAG',
    thickness: 'thin',
    gases: ['inoxline-c3h1', 'inoxline-c2', 'inoxline-x2'],
    rootProtection: false,
  },
  {
    id: 6,
    material: 'cr-ni-steel',
    process: 'MAG',
    thickness: 'thick',
    gases: ['inoxline-he15c2'],
    rootProtection: false,
  },
  {
    id: 7,
    material: 'cr-ni-steel',
    process: 'TIG',
    thickness: 'thin',
    gases: ['ar', 'inoxline-he3h1'],
    rootProtection: true,
    rootGasIds: ['ar', 'forming-gas'],
  },
  {
    id: 8,
    material: 'al-alloys',
    process: 'MIG',
    thickness: 'thin',
    gases: ['ar', 'aluline-he30'],
    rootProtection: false,
  },
  {
    id: 9,
    material: 'al-alloys',
    process: 'TIG',
    thickness: 'thick',
    gases: ['aluline-he30', 'aluline-he50', 'aluline-he70'],
    rootProtection: false,
  },
] as const;

describe('ShieldingGas Calculator MVP scenarios', () => {
  const catalog = loadLocalizedCatalog('en');
  const calculator = createCalculator(catalog);

  it.each(MVP_SCENARIOS)(
    'scenario #$id returns expected gases',
    ({ material, process, thickness, gases, rootProtection, rootGasIds }) => {
      calculator.reset();
      expect(calculator.selectMaterial(material)).toBe(true);
      expect(calculator.selectProcess(process)).toBe(true);
      expect(calculator.selectThickness(thickness)).toBe(true);

      const availableGasIds = calculator
        .getAvailableGases()
        .map((gas) => gas.id);
      expect(availableGasIds).toEqual(gases);
      expect(calculator.isRootProtectionRequired()).toBe(rootProtection);

      if (rootProtection) {
        expect(calculator.getRootProtectionWarning()).toBeTruthy();
        expect(
          calculator.getRootProtectionGases().map((gas) => gas.id)
        ).toEqual(rootGasIds);
      } else {
        expect(calculator.getRootProtectionGases()).toEqual([]);
        expect(calculator.getRootProtectionWarning()).toBeNull();
      }
    }
  );

  it('returns gas info and criteria for ferroline-c6x1', () => {
    calculator.reset();
    calculator.selectMaterial('fe-steel');
    calculator.selectProcess('MAG');
    calculator.selectThickness('thin');
    calculator.selectGas('ferroline-c6x1');

    const gasInfo = calculator.getGasInfo();
    expect(gasInfo?.id).toBe('ferroline-c6x1');
    expect(gasInfo?.isoStandard).toContain('ISO EN 14175');
    expect(
      calculator.getCriteriaForGas('ferroline-c6x1')?.criteria.length
    ).toBe(5);
    expect(calculator.getCriteriaAverageScore('ferroline-c6x1')).toBeTypeOf(
      'number'
    );
  });

  it('resets dependent selections when material changes', () => {
    calculator.reset();
    calculator.selectMaterial('fe-steel');
    calculator.selectProcess('MAG');
    calculator.selectThickness('thin');
    calculator.selectGas('ferroline-c6x1');

    calculator.selectMaterial('cr-ni-steel');
    expect(calculator.getState()).toEqual({
      material: 'cr-ni-steel',
      process: null,
      thickness: null,
      gas: null,
    });
  });
});
