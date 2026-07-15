type WizardSelectCardProps = {
  id: string;
  label: string;
  selected: boolean;
  onClick: () => void;
  size?: 'sm' | 'md';
};

export function WizardSelectCard({
  id,
  label,
  selected,
  onClick,
  size = 'md',
}: WizardSelectCardProps) {
  return (
    <button
      type="button"
      id={id}
      onClick={onClick}
      aria-pressed={selected}
      className={`sg-wizard-card card w-full text-center transition-colors ${
        selected ? 'sg-wizard-card-selected' : ''
      } ${size === 'sm' ? 'p-4' : 'p-6'}`}
    >
      <span
        className={
          size === 'sm'
            ? 'text-base font-semibold text-foreground'
            : 'heading-3 text-foreground'
        }
      >
        {label}
      </span>
    </button>
  );
}
