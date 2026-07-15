import type {
  CriteriaGroup,
  GasProperties,
  GasRef,
  MaterialEntry,
  ShieldingGasCatalog,
  ThicknessOption,
} from './types';

export type GasInfo = GasProperties & {
  id: string;
  name: string;
  recommendedThickness?: string[];
};

export type CriteriaForGas = {
  groupId: string;
  criteria: { id: string; label: string }[];
  scores: Record<string, number>;
};

export type CalculatorState = {
  material: string | null;
  process: string | null;
  thickness: string | null;
  gas: string | null;
};

export class Calculator {
  selectedMaterial: string | null = null;
  selectedProcess: string | null = null;
  selectedThickness: string | null = null;
  selectedGas: string | null = null;

  constructor(private readonly catalog: ShieldingGasCatalog) {}

  getMaterials(): MaterialEntry[] {
    return Object.values(this.catalog.materials);
  }

  selectMaterial(materialId: string): boolean {
    if (!this.catalog.materials[materialId]) {
      return false;
    }
    this.selectedMaterial = materialId;
    this.selectedProcess = null;
    this.selectedThickness = null;
    this.selectedGas = null;
    return true;
  }

  getAvailableProcesses(): string[] {
    if (!this.selectedMaterial) {
      return [];
    }
    return this.catalog.materials[this.selectedMaterial]?.processes ?? [];
  }

  selectProcess(process: string): boolean {
    if (!this.getAvailableProcesses().includes(process)) {
      return false;
    }
    this.selectedProcess = process;
    this.selectedThickness = null;
    this.selectedGas = null;
    return true;
  }

  getAvailableThicknesses(): ThicknessOption[] {
    if (!this.selectedMaterial || !this.selectedProcess) {
      return [];
    }
    return (
      this.catalog.thicknessOptions[this.selectedMaterial]?.[
        this.selectedProcess
      ] ?? []
    );
  }

  selectThickness(thicknessId: string): boolean {
    const thickness = this.getAvailableThicknesses().find(
      (option) => option.id === thicknessId
    );
    if (!thickness) {
      return false;
    }
    this.selectedThickness = thicknessId;
    this.selectedGas = null;
    return true;
  }

  getAvailableGases(): GasRef[] {
    if (
      !this.selectedMaterial ||
      !this.selectedProcess ||
      !this.selectedThickness
    ) {
      return [];
    }
    return (
      this.catalog.gases[this.selectedMaterial]?.[this.selectedProcess]?.[
        this.selectedThickness
      ] ?? []
    );
  }

  selectGas(gasId: string): boolean {
    const gas = this.getAvailableGases().find((item) => item.id === gasId);
    if (!gas) {
      return false;
    }
    this.selectedGas = gasId;
    return true;
  }

  getGasInfo(): GasInfo | null {
    if (!this.selectedGas) {
      return null;
    }
    const properties = this.catalog.gasProperties[this.selectedGas];
    if (!properties) {
      return null;
    }

    const gas = this.getAvailableGases().find(
      (item) => item.id === this.selectedGas
    );
    const thicknessIds = this.getAvailableThicknesses()
      .map((option) => option.id)
      .filter((thicknessId) => {
        const processGases =
          this.catalog.gases[this.selectedMaterial!]?.[this.selectedProcess!] ??
          {};
        const thicknessGases = processGases[thicknessId] ?? [];
        return thicknessGases.some((item) => item.id === this.selectedGas);
      });

    return {
      id: this.selectedGas,
      name: gas?.name ?? '',
      ...properties,
      recommendedThickness:
        thicknessIds.length > 0
          ? thicknessIds
          : properties.recommendedThickness,
    };
  }

  getGasInfoById(gasId: string): GasInfo | null {
    if (!gasId) {
      return null;
    }
    const properties = this.catalog.gasProperties[gasId];
    if (!properties) {
      return null;
    }

    let name = '';
    Object.values(this.catalog.gases).forEach((materialGroup) => {
      Object.values(materialGroup).forEach((processGroup) => {
        if (Array.isArray(processGroup)) {
          const found = processGroup.find((item) => item.id === gasId);
          if (found) {
            name = found.name;
          }
        } else {
          Object.values(processGroup).forEach((list) => {
            const found = (list ?? []).find((item) => item.id === gasId);
            if (found) {
              name = found.name;
            }
          });
        }
      });
    });

    return {
      id: gasId,
      name,
      ...properties,
    };
  }

  getCriteriaGroupByGasId(
    gasId: string
  ): (CriteriaGroup & { id: string }) | null {
    for (const [groupId, group] of Object.entries(
      this.catalog.criteriaGroups
    )) {
      if (group.gasIds.includes(gasId)) {
        return { id: groupId, ...group };
      }
    }
    return null;
  }

  getCriteriaForGas(gasId: string): CriteriaForGas | null {
    const group = this.getCriteriaGroupByGasId(gasId);
    if (!group) {
      return null;
    }
    return {
      groupId: group.id,
      criteria: group.criteria,
      scores: this.catalog.gasCriteriaScores[gasId] ?? {},
    };
  }

  getCriteriaAverageScore(gasId: string): number | null {
    const criteriaData = this.getCriteriaForGas(gasId);
    if (!criteriaData || criteriaData.criteria.length === 0) {
      return null;
    }
    const values = criteriaData.criteria
      .map((item) => criteriaData.scores[item.id])
      .filter((value): value is number => typeof value === 'number');
    if (values.length === 0) {
      return null;
    }
    const sum = values.reduce((acc, value) => acc + value, 0);
    return Math.round((sum / values.length) * 10) / 10;
  }

  getAllGasesList(): GasRef[] {
    const list: GasRef[] = [];
    Object.values(this.catalog.gases).forEach((materialGroup) => {
      Object.values(materialGroup).forEach((processGroup) => {
        if (Array.isArray(processGroup)) {
          processGroup.forEach((item) => list.push(item));
        } else {
          Object.values(processGroup).forEach((items) => {
            (items ?? []).forEach((item) => list.push(item));
          });
        }
      });
    });

    const uniqueMap = new Map<string, GasRef>();
    list.forEach((item) => {
      if (!uniqueMap.has(item.id)) {
        uniqueMap.set(item.id, item);
      }
    });
    return Array.from(uniqueMap.values());
  }

  isRootProtectionRequired(): boolean {
    return (
      this.selectedMaterial === 'cr-ni-steel' && this.selectedProcess === 'TIG'
    );
  }

  getRootProtectionGases(): GasRef[] {
    return this.isRootProtectionRequired()
      ? this.catalog.rootProtectionGases
      : [];
  }

  getRootProtectionWarning(): string | null {
    return this.isRootProtectionRequired()
      ? this.catalog.rootProtectionWarning
      : null;
  }

  getPropertyLabel(property: string, value: string): string {
    return this.catalog.propertyLabels[property]?.[value] ?? value;
  }

  reset(): void {
    this.selectedMaterial = null;
    this.selectedProcess = null;
    this.selectedThickness = null;
    this.selectedGas = null;
  }

  getState(): CalculatorState {
    return {
      material: this.selectedMaterial,
      process: this.selectedProcess,
      thickness: this.selectedThickness,
      gas: this.selectedGas,
    };
  }

  getThicknessLabel(thicknessId: string): string {
    const option = this.getAvailableThicknesses().find(
      (item) => item.id === thicknessId
    );
    return option?.label ?? thicknessId;
  }
}
