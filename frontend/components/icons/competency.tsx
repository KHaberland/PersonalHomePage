import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { title?: string };

const base = 'inline-block shrink-0 text-current';

/** MIG/MAG — дуга и проволока */
export function IconCompetencyMigMag({ className, title, ...p }: IconProps) {
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
      <path d="M4 18h16M6 14l3-8h6l3 8" />
      <path d="M10 10h4M12 6v4" />
      <circle cx="12" cy="16" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** TIG — электрод и дуга */
export function IconCompetencyTig({ className, title, ...p }: IconProps) {
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
      <path d="M12 3v14M10 17h4" />
      <path d="M9 21h6" />
      <path d="M11 7l1-2h0l1 2" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Защитный газ — баллон и поток */
export function IconCompetencyGas({ className, title, ...p }: IconProps) {
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
      <path d="M9 3h6v4a3 3 0 0 1-3 3 3 3 0 0 1-3-3V3z" />
      <path d="M8 21h8M12 10v8" />
      <path d="M10 14h4" />
    </svg>
  );
}

/** Сварочное оборудование — инвертор */
export function IconCompetencyEquipment({ className, title, ...p }: IconProps) {
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
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <path d="M8 10h8M8 14h5" />
      <circle cx="17" cy="9" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Газовая резка — сопло и пламя */
export function IconCompetencyCutting({ className, title, ...p }: IconProps) {
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
      <path d="M12 3v6M10 9h4l-1 12h-2L10 9z" />
      <path d="M9 15h6" />
    </svg>
  );
}

/** Металлургия — структура зерна / слои */
export function IconCompetencyMetallurgy({
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
      <circle cx="12" cy="12" r="2" />
      <path d="M12 4v4M12 16v4M4 12h4M16 12h4" />
      <path d="M6.34 6.34l2.83 2.83M14.83 14.83l2.83 2.83M6.34 17.66l2.83-2.83M14.83 9.17l2.83-2.83" />
    </svg>
  );
}
