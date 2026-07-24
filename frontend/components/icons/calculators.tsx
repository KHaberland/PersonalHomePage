import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { title?: string };

const base = 'inline-block shrink-0 text-current';

/**
 * Shielding Gas Selection Calculator — баллон, смесь газов и поток к шву.
 */
export function IconShieldingGasCalculator({
  className,
  title,
  ...p
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ?? base}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      {...p}
    >
      {title ? <title>{title}</title> : null}
      {/* Gas cylinder */}
      <path d="M4 3.5h4.5v3.5a2.25 2.25 0 0 1-4.5 0V3.5z" />
      <path d="M3 20.5h6.5M6.25 7v13.5" />
      <path d="M4.75 12.5h3" />
      {/* Gas mix selection (Ar / CO₂ / O₂) */}
      <circle cx="14.5" cy="6.5" r="1.35" />
      <circle cx="18.5" cy="9" r="1.35" />
      <circle cx="14.5" cy="11.5" r="1.35" />
      <path d="M14.5 7.85l3.2 1M17.5 10.15l-2.4 1" />
      {/* Shielding flow to weld */}
      <path d="M6.25 15.5c2.5-1 5-1 7.5 0 1.5.6 2.75 1.5 4 2.5" />
      <path d="M14.5 18.5h5" />
      <circle cx="17" cy="19.75" r="1.1" fill="currentColor" stroke="none" />
      <path d="M16 17.75l1-1.5 1 1.5" />
    </svg>
  );
}
