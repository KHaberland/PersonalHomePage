type WizardBackButtonProps = {
  label: string;
  onClick: () => void;
  className?: string;
};

export function WizardBackButton({
  label,
  onClick,
  className = 'mt-6',
}: WizardBackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`btn-secondary ${className}`.trim()}
    >
      ← {label}
    </button>
  );
}
