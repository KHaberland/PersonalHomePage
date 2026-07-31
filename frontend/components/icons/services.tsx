import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { title?: string };

const base = 'inline-block shrink-0 text-current';

/** Консультации — диалог, документ */
export function IconServiceConsulting({ className, title, ...p }: IconProps) {
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
      <path d="M8 9h8M8 13h5" />
      <path d="M6 4h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-4l-4 3v-3H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
    </svg>
  );
}

/** Повышение качества сварки — цилиндрическое сопло с вольфрамовым электродом */
export function IconServiceTigTorch({ className, title, ...p }: IconProps) {
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
      <path d="M3 22h14" />
      <g transform="rotate(-32 11.5 12)">
        <path d="M11 3.5h2" />
        <path d="M12 3.5v3.5" />
        <path d="M9.5 7h5" />
        <path d="M9.5 7v11" />
        <path d="M14.5 7v11" />
        <path d="M9.5 18h5" />
        <path d="M12 18v4" />
      </g>
    </svg>
  );
}

/** Оптимизация процесса — колба, узлы и связи */
export function IconServiceImplementation({
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
      <path d="M5 3.5h2" />
      <path d="M6 3.5v2" />
      <path d="M4 5.5h4" />
      <path d="M4 5.5v7" />
      <path d="M8 5.5v7" />
      <path d="M4 12.5h4" />
      <circle cx="18" cy="8" r="3" />
      <circle cx="12" cy="16" r="2.5" />
      <path d="M8 9.5 10.5 14M16.5 9.5 13.5 14M8 16h8" />
    </svg>
  );
}

/** Подбор оборудования — инструмент и блок */
export function IconServiceEquipment({ className, title, ...p }: IconProps) {
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
      <path d="M14.5 4L19 8.5l-7 7L5 8.5 9.5 4h5z" />
      <path d="M9 14l-4 4M11 16l-2 2" />
      <path d="M12 11h.01" />
    </svg>
  );
}

/** Выбор защитного газа — вертикальный баллон с аргоновой смесью */
export function IconServiceGasSelection({ className, title, ...p }: IconProps) {
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
      <path d="M10 2h4v3.5a2 2 0 0 1-4 0V2z" />
      <path d="M12 5.5v2" />
      <path d="M9 7.5h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-10a2 2 0 0 1 2-2z" />
      <path d="M7.5 21.5h9" />
      <path d="M9.5 12h5" />
      <path d="M9.5 15.5h5" />
      <path d="M12 12v3.5" />
      <text
        x="10.75"
        y="14.1"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="3.2"
        fontWeight="700"
        fill="currentColor"
        stroke="none"
      >
        Ar
      </text>
      <path d="M13.3 13.7v1.6M12.5 14.5h1.6" />
    </svg>
  );
}

/** Поддержка проектов / WPS — раскрытая книга */
export function IconServiceOpenBook({ className, title, ...p }: IconProps) {
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
      <path d="M12 3v18" />
      <path d="M12 3 5 6.5v13l7-3.5" />
      <path d="M12 3l7 3.5v13l-7-3.5" />
      <path d="M7.5 10h3M7.5 13h3.5" />
      <path d="M13.5 10H16.5M13.5 13H16" />
    </svg>
  );
}

/** Обучение — шапочка магистра */
export function IconServiceTraining({ className, title, ...p }: IconProps) {
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
      <path d="M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 1 2 2 6 2s6-1 6-2v-5" />
      <path d="M20 10v5.5" />
      <circle cx="20" cy="17" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
