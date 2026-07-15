import type { CalculatorProps, CalculatorSlug } from '@/components/calculators';
import type { PageContent } from './cms-content';

type Translate = (key: string) => string;

type CalculatorFieldSpec = {
  cmsKey: string;
  textKey: string;
  fallback?: string;
};

export type CalculatorPageText = {
  lead: string;
  exampleTitle: string;
  exampleCaption: string;
};

export type CalculatorChromeText = {
  exampleSectionTitle: string;
  engineeringNoteTitle: string;
  engineeringNote: string;
  validationCtaTitle: string;
  validationCtaText: string;
  validationCta: string;
};

export type ShieldingGasWizardText = {
  back: string;
  reset: string;
  importantAlert: string;
  rootProtectionGases: string;
  rootProtectionWarning: string;
  errorGasNotFound: string;
  isoLabel: string;
  totalScoreLabel: string;
  applicationLabel: string;
  stepMaterial: string;
  stepProcess: string;
  stepThickness: string;
  stepGas: string;
  stepResult: string;
  scoreNote: string;
};

type WizardFieldSpec = {
  cmsKey: keyof ShieldingGasWizardText;
  textKey: string;
  fallback: string;
};

const SHIELDING_GAS_WIZARD_SPECS: WizardFieldSpec[] = [
  {
    cmsKey: 'back',
    textKey: 'shieldingGas.wizard.back',
    fallback: 'Back',
  },
  {
    cmsKey: 'reset',
    textKey: 'shieldingGas.wizard.reset',
    fallback: 'Start over',
  },
  {
    cmsKey: 'importantAlert',
    textKey: 'shieldingGas.wizard.importantAlert',
    fallback: 'Important!',
  },
  {
    cmsKey: 'rootProtectionGases',
    textKey: 'shieldingGas.wizard.rootProtectionGases',
    fallback: 'Root protection gases:',
  },
  {
    cmsKey: 'rootProtectionWarning',
    textKey: 'shieldingGas.wizard.rootProtectionWarning',
    fallback:
      'During TIG welding of stainless steels without root protection, hard chromium oxides form on the reverse side, reducing corrosion resistance.',
  },
  {
    cmsKey: 'errorGasNotFound',
    textKey: 'shieldingGas.wizard.errorGasNotFound',
    fallback: 'Error: gas information not found',
  },
  {
    cmsKey: 'isoLabel',
    textKey: 'shieldingGas.wizard.isoLabel',
    fallback: 'ISO EN 14175 designation:',
  },
  {
    cmsKey: 'totalScoreLabel',
    textKey: 'shieldingGas.wizard.totalScoreLabel',
    fallback: 'Overall score:',
  },
  {
    cmsKey: 'applicationLabel',
    textKey: 'shieldingGas.wizard.applicationLabel',
    fallback: 'Main application:',
  },
  {
    cmsKey: 'stepMaterial',
    textKey: 'shieldingGas.wizard.stepMaterial',
    fallback: 'Material',
  },
  {
    cmsKey: 'stepProcess',
    textKey: 'shieldingGas.wizard.stepProcess',
    fallback: 'Process',
  },
  {
    cmsKey: 'stepThickness',
    textKey: 'shieldingGas.wizard.stepThickness',
    fallback: 'Thickness',
  },
  {
    cmsKey: 'stepGas',
    textKey: 'shieldingGas.wizard.stepGas',
    fallback: 'Gas',
  },
  {
    cmsKey: 'stepResult',
    textKey: 'shieldingGas.wizard.stepResult',
    fallback: 'Result',
  },
  {
    cmsKey: 'scoreNote',
    textKey: 'shieldingGas.wizard.scoreNote',
    fallback:
      'Assessment is based on a relative 1–5 scale for welding mixtures, where 1 is the worst and 5 is the best.',
  },
];

const SHIELDING_GAS_PAGE_FALLBACKS: CalculatorPageText = {
  lead: 'Guides you through material, welding process, plate thickness and gas mixture to recommend shielding gases for MAG, MIG and TIG. Compare ISO designations, typical applications and relative criteria scores — not gas flow rates.',
  exampleTitle: 'Selection in five steps',
  exampleCaption:
    'Material → Process → Thickness → Gas → Result: ISO mix, application and criteria scores on a 1–5 scale.',
};

const COMMON_KEYS = [
  'calculate',
  'calculating',
  'errorInvalid',
  'errorSpeedPositive',
  'errorFlowPositive',
  'errorWireDiameter',
  'errorPlateThickness',
  'errorCylinderVolume',
  'errorCalculationFailed',
] as const;

const FIELD_SPECS: Record<CalculatorSlug, CalculatorFieldSpec[]> = {
  'heat-input': [
    { cmsKey: 'voltage_label', textKey: 'heatInput.voltage' },
    { cmsKey: 'voltage_hint', textKey: 'heatInput.hints.voltage' },
    { cmsKey: 'current_label', textKey: 'heatInput.current' },
    { cmsKey: 'current_hint', textKey: 'heatInput.hints.current' },
    { cmsKey: 'travelSpeed_label', textKey: 'heatInput.travelSpeed' },
    { cmsKey: 'travelSpeed_hint', textKey: 'heatInput.hints.travelSpeed' },
    { cmsKey: 'result_label', textKey: 'heatInput.result' },
  ],
  'gas-flow': [
    { cmsKey: 'flowRate_label', textKey: 'gasFlow.flowRate' },
    { cmsKey: 'flowRate_hint', textKey: 'gasFlow.hints.flowRate' },
    { cmsKey: 'weldingTime_label', textKey: 'gasFlow.weldingTime' },
    { cmsKey: 'weldingTime_hint', textKey: 'gasFlow.hints.weldingTime' },
    { cmsKey: 'cylinderVolume_label', textKey: 'gasFlow.cylinderVolume' },
    { cmsKey: 'cylinderVolume_hint', textKey: 'gasFlow.hints.cylinderVolume' },
    { cmsKey: 'consumption_label', textKey: 'gasFlow.consumption' },
    { cmsKey: 'cylinderDuration_label', textKey: 'gasFlow.cylinderDuration' },
  ],
  'shielding-gas': [],
  'gas-cutting': [
    { cmsKey: 'plateThickness_label', textKey: 'gasCutting.plateThickness' },
    {
      cmsKey: 'plateThickness_hint',
      textKey: 'gasCutting.hints.plateThickness',
    },
    { cmsKey: 'gasType_label', textKey: 'gasCutting.gasType' },
    { cmsKey: 'gasType_hint', textKey: 'gasCutting.hints.gasType' },
    { cmsKey: 'cuttingSpeed_label', textKey: 'gasCutting.cuttingSpeed' },
    { cmsKey: 'cuttingSpeed_hint', textKey: 'gasCutting.hints.cuttingSpeed' },
    {
      cmsKey: 'cuttingSpeedPlaceholder_label',
      textKey: 'gasCutting.cuttingSpeedPlaceholder',
    },
    { cmsKey: 'o2Pressure_label', textKey: 'gasCutting.o2Pressure' },
    { cmsKey: 'fuelFlow_label', textKey: 'gasCutting.fuelFlow' },
    {
      cmsKey: 'acetylene_option',
      textKey: 'gasCutting.options.acetylene',
      fallback: 'Acetylene',
    },
    {
      cmsKey: 'propane_option',
      textKey: 'gasCutting.options.propane',
      fallback: 'Propane',
    },
  ],
  'welding-cost': [
    { cmsKey: 'wirePrice_label', textKey: 'weldingCost.wirePrice' },
    { cmsKey: 'wirePrice_hint', textKey: 'weldingCost.hints.wirePrice' },
    { cmsKey: 'gasPrice_label', textKey: 'weldingCost.gasPrice' },
    { cmsKey: 'gasPrice_hint', textKey: 'weldingCost.hints.gasPrice' },
    { cmsKey: 'cylinderVolume_label', textKey: 'weldingCost.cylinderVolume' },
    {
      cmsKey: 'cylinderVolume_hint',
      textKey: 'weldingCost.hints.cylinderVolume',
    },
    { cmsKey: 'depositionRate_label', textKey: 'weldingCost.depositionRate' },
    {
      cmsKey: 'depositionRate_hint',
      textKey: 'weldingCost.hints.depositionRate',
    },
    { cmsKey: 'weldingTime_label', textKey: 'weldingCost.weldingTime' },
    { cmsKey: 'weldingTime_hint', textKey: 'weldingCost.hints.weldingTime' },
    { cmsKey: 'wireConsumption_label', textKey: 'weldingCost.wireConsumption' },
    { cmsKey: 'gasConsumption_label', textKey: 'weldingCost.gasConsumption' },
    { cmsKey: 'cylindersUsed_label', textKey: 'weldingCost.cylindersUsed' },
    { cmsKey: 'wireCost_label', textKey: 'weldingCost.wireCost' },
    { cmsKey: 'gasCost_label', textKey: 'weldingCost.gasCost' },
    { cmsKey: 'totalCost_label', textKey: 'weldingCost.totalCost' },
  ],
  'welding-parameters': [
    {
      cmsKey: 'plateThickness_label',
      textKey: 'weldingParameters.plateThickness',
    },
    {
      cmsKey: 'plateThickness_hint',
      textKey: 'weldingParameters.hints.plateThickness',
    },
    { cmsKey: 'jointType_label', textKey: 'weldingParameters.jointType' },
    { cmsKey: 'jointType_hint', textKey: 'weldingParameters.hints.jointType' },
    { cmsKey: 'wireDiameter_label', textKey: 'weldingParameters.wireDiameter' },
    {
      cmsKey: 'wireDiameter_hint',
      textKey: 'weldingParameters.hints.wireDiameter',
    },
    { cmsKey: 'current_label', textKey: 'weldingParameters.current' },
    { cmsKey: 'voltage_label', textKey: 'weldingParameters.voltage' },
    { cmsKey: 'travelSpeed_label', textKey: 'weldingParameters.travelSpeed' },
    {
      cmsKey: 'butt_option',
      textKey: 'weldingParameters.options.butt',
      fallback: 'Butt',
    },
    {
      cmsKey: 'fillet_option',
      textKey: 'weldingParameters.options.fillet',
      fallback: 'Fillet',
    },
    {
      cmsKey: 'lap_option',
      textKey: 'weldingParameters.options.lap',
      fallback: 'Lap',
    },
    {
      cmsKey: 'corner_option',
      textKey: 'weldingParameters.options.corner',
      fallback: 'Corner',
    },
  ],
};

function readCms(
  content: PageContent,
  block: string,
  key: string
): string | undefined {
  const value = content[block]?.[key];
  return value && value.trim() ? value : undefined;
}

function readFallback(t: Translate, key: string): string | undefined {
  try {
    return t(key);
  } catch {
    return undefined;
  }
}

function readText(
  content: PageContent,
  block: string,
  cmsKey: string,
  textKey: string,
  t: Translate,
  fallback?: string
): string {
  return (
    readCms(content, block, cmsKey) ??
    fallback ??
    readFallback(t, textKey) ??
    ''
  );
}

export function getCalculatorPageText(
  content: PageContent,
  slug: CalculatorSlug,
  t: Translate
): CalculatorPageText {
  const block = `${slug}_page`;
  const fallbackBase = `pages.${slug}`;
  const pageFallbacks =
    slug === 'shielding-gas' ? SHIELDING_GAS_PAGE_FALLBACKS : undefined;
  return {
    lead: readText(
      content,
      block,
      'lead',
      `${fallbackBase}.lead`,
      t,
      pageFallbacks?.lead
    ),
    exampleTitle: readText(
      content,
      block,
      'exampleTitle',
      `${fallbackBase}.exampleTitle`,
      t,
      pageFallbacks?.exampleTitle
    ),
    exampleCaption: readText(
      content,
      block,
      'exampleCaption',
      `${fallbackBase}.exampleCaption`,
      t,
      pageFallbacks?.exampleCaption
    ),
  };
}

export function getShieldingGasWizardText(
  content: PageContent,
  t: Translate
): ShieldingGasWizardText {
  const wizard: Partial<ShieldingGasWizardText> = {};

  for (const spec of SHIELDING_GAS_WIZARD_SPECS) {
    wizard[spec.cmsKey] = readText(
      content,
      'shielding-gas_wizard',
      spec.cmsKey,
      spec.textKey,
      t,
      spec.fallback
    );
  }

  return wizard as ShieldingGasWizardText;
}

export function getCalculatorChromeText(
  content: PageContent,
  t: Translate
): CalculatorChromeText {
  return {
    exampleSectionTitle: readText(
      content,
      'common',
      'exampleSectionTitle',
      'exampleSectionTitle',
      t
    ),
    engineeringNoteTitle: readText(
      content,
      'common',
      'engineeringNoteTitle',
      'engineeringNoteTitle',
      t
    ),
    engineeringNote: readText(
      content,
      'common',
      'engineeringNote',
      'engineeringNote',
      t
    ),
    validationCtaTitle: readText(
      content,
      'common',
      'validationCtaTitle',
      'validationCtaTitle',
      t
    ),
    validationCtaText: readText(
      content,
      'common',
      'validationCtaText',
      'validationCtaText',
      t
    ),
    validationCta: readText(
      content,
      'common',
      'validationCta',
      'validationCta',
      t
    ),
  };
}

export function getCalculatorProps(
  content: PageContent,
  slug: CalculatorSlug,
  t: Translate
): CalculatorProps {
  const texts: Record<string, string> = {};
  const fieldsBlock = `${slug}_fields`;

  for (const key of COMMON_KEYS) {
    texts[key] = readText(content, 'common', key, key, t);
  }

  for (const spec of FIELD_SPECS[slug]) {
    texts[spec.textKey] = readText(
      content,
      fieldsBlock,
      spec.cmsKey,
      spec.textKey,
      t,
      spec.fallback
    );
  }

  if (slug === 'shielding-gas') {
    const wizard = getShieldingGasWizardText(content, t);
    for (const spec of SHIELDING_GAS_WIZARD_SPECS) {
      texts[spec.textKey] = wizard[spec.cmsKey];
    }
  }

  return { texts };
}
