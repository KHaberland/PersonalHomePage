import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { title?: string };

const base = 'inline-block shrink-0 text-current';

/** Диплом / сертификат */
export function IconWhyDiploma({ className, title, ...p }: IconProps) {
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
      <path d="M6 4h12a2 2 0 0 1 2 2v14l-4-2-4 2-4-2-4 2V6a2 2 0 0 1 2-2z" />
      <path d="M9 9h6M9 13h4" />
    </svg>
  );
}

/** График / щит — результаты для бизнеса */
export function IconWhyChartShield({ className, title, ...p }: IconProps) {
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
      <path d="M12 21s8-4.5 8-11V5l-8-3-8 3v5c0 6.5 8 11 8 11z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

/** Группа / обучение */
export function IconWhyTeam({ className, title, ...p }: IconProps) {
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
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

/** Книга / документ */
export function IconWhyBook({ className, title, ...p }: IconProps) {
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
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M8 7h8M8 11h6" />
    </svg>
  );
}
