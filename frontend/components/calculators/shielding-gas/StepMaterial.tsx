import { WizardSelectCard } from './WizardSelectCard';
import type { Calculator } from '@/lib/shielding-gas/calculator';
import type { WizardTextFn } from './types';

type StepMaterialProps = {
  calculator: Calculator;
  text: WizardTextFn;
  onSelect: (materialId: string) => void;
};

export function StepMaterial({ calculator, onSelect }: StepMaterialProps) {
  const materials = calculator.getMaterials();

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {materials.map((material) => (
        <WizardSelectCard
          key={material.id}
          id={`material-${material.id}`}
          label={material.name}
          selected={calculator.selectedMaterial === material.id}
          onClick={() => onSelect(material.id)}
        />
      ))}
    </div>
  );
}
