export type MaterialEntry = {
  id: string;
  name: string;
  fullName: string;
  processes: string[];
};

export type ThicknessOption = {
  id: string;
  label: string;
};

export type GasRef = {
  id: string;
  name: string;
};

export type GasProperties = {
  isoStandard?: string;
  isoStandardFull?: string;
  penetration?: string;
  smokeEmission?: string;
  spatter?: string;
  porosityRisk?: string;
  cleaningDifficulty?: string;
  silicateIslands?: string;
  application?: string;
  recommendedThickness?: string[];
};

export type Criterion = {
  id: string;
  label: string;
};

export type CriteriaGroup = {
  gasIds: string[];
  criteria: Criterion[];
};

export type ShieldingGasCatalog = {
  materials: Record<string, MaterialEntry>;
  thicknessOptions: Record<string, Record<string, ThicknessOption[]>>;
  gases: Record<string, Record<string, Record<string, GasRef[]>>>;
  rootProtectionGases: GasRef[];
  gasProperties: Record<string, GasProperties>;
  criteriaGroups: Record<string, CriteriaGroup>;
  gasCriteriaScores: Record<string, Record<string, number>>;
  propertyLabels: Record<string, Record<string, string>>;
  rootProtectionWarning: string;
};
