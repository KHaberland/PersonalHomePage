import type { CalculatorSlug } from './index';

type Props = {
  slug: CalculatorSlug;
  className?: string;
};

/** Статичная мини-инфографика: числа и схемы без привязки к вводу; пояснение — в подписи страницы. */
export function CalculatorStaticExample({ slug, className = '' }: Props) {
  return (
    <div
      className={`rounded-lg border border-foreground/10 bg-background/50 p-4 ${className}`}
      role="img"
      aria-hidden
    >
      {slug === 'heat-input' && <HeatInputExample />}
      {slug === 'gas-flow' && <GasFlowExample />}
      {slug === 'shielding-gas' && <ShieldingGasExample />}
      {slug === 'gas-cutting' && <GasCuttingExample />}
      {slug === 'welding-cost' && <WeldingCostExample />}
      {slug === 'welding-parameters' && <WeldingParametersExample />}
    </div>
  );
}

function HeatInputExample() {
  return (
    <svg
      viewBox="0 0 320 120"
      className="h-auto w-full max-w-md"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text x="8" y="18" className="fill-foreground/80 text-[11px]">
        kJ/mm
      </text>
      <rect
        x="40"
        y="28"
        width="48"
        height="72"
        rx="4"
        className="fill-emerald-500/70"
      />
      <text x="52" y="112" className="fill-foreground/70 text-[10px]">
        0.9
      </text>
      <rect
        x="120"
        y="8"
        width="48"
        height="92"
        rx="4"
        className="fill-orange-500/80"
      />
      <text x="128" y="112" className="fill-foreground/70 text-[10px]">
        1.5
      </text>
      <line
        x1="32"
        y1="100"
        x2="280"
        y2="100"
        className="stroke-foreground/30"
        strokeWidth="1"
      />
      <text x="168" y="72" className="fill-foreground/55 text-[10px]">
        ↑ Q → heat
      </text>
    </svg>
  );
}

function GasFlowExample() {
  return (
    <svg
      viewBox="0 0 320 140"
      className="h-auto w-full max-w-md"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="16"
        y="24"
        width="288"
        height="88"
        rx="6"
        className="fill-foreground/5 stroke-foreground/15"
        strokeWidth="1"
      />
      <text x="28" y="48" className="fill-foreground/80 text-[11px]">
        12 L/min × 45 min
      </text>
      <text x="28" y="68" className="fill-foreground/60 text-[10px]">
        → ≈ 540 L
      </text>
      <rect
        x="28"
        y="78"
        width="200"
        height="22"
        rx="3"
        className="fill-sky-500/25"
      />
      <text x="36" y="94" className="fill-foreground/75 text-[10px]">
        e.g. 10 m³ cylinder
      </text>
    </svg>
  );
}

function ShieldingGasExample() {
  return (
    <svg
      viewBox="0 0 320 100"
      className="h-auto w-full max-w-md"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="24"
        y1="56"
        x2="296"
        y2="56"
        className="stroke-foreground/35"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="80" cy="56" r="6" className="fill-emerald-500" />
      <circle cx="160" cy="56" r="8" className="fill-orange-500" />
      <circle cx="240" cy="56" r="6" className="fill-emerald-500" />
      <text x="56" y="84" className="fill-foreground/65 text-[9px]">
        min
      </text>
      <text x="132" y="84" className="fill-foreground/65 text-[9px]">
        typ
      </text>
      <text x="216" y="84" className="fill-foreground/65 text-[9px]">
        max
      </text>
    </svg>
  );
}

function GasCuttingExample() {
  return (
    <svg
      viewBox="0 0 320 120"
      className="h-auto w-full max-w-md"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text x="12" y="22" className="fill-foreground/70 text-[10px]">
        O₂ bar
      </text>
      <rect
        x="40"
        y="32"
        width="36"
        height="64"
        rx="3"
        className="fill-sky-500/50"
      />
      <rect
        x="92"
        y="24"
        width="36"
        height="72"
        rx="3"
        className="fill-sky-500/65"
      />
      <rect
        x="144"
        y="16"
        width="36"
        height="80"
        rx="3"
        className="fill-sky-500/80"
      />
      <text x="188" y="64" className="fill-foreground/55 text-[10px]">
        thicker → higher p
      </text>
    </svg>
  );
}

function WeldingCostExample() {
  return (
    <svg
      viewBox="0 0 320 100"
      className="h-auto w-full max-w-md"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="24"
        y="28"
        width="200"
        height="28"
        rx="4"
        className="fill-amber-500/70"
      />
      <rect
        x="24"
        y="60"
        width="120"
        height="28"
        rx="4"
        className="fill-slate-500/55"
      />
      <text x="232" y="46" className="fill-foreground/70 text-[10px]">
        wire
      </text>
      <text x="152" y="78" className="fill-foreground/70 text-[10px]">
        gas
      </text>
    </svg>
  );
}

function WeldingParametersExample() {
  return (
    <svg
      viewBox="0 0 320 100"
      className="h-auto w-full max-w-md"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="16"
        y="12"
        width="288"
        height="76"
        rx="4"
        className="fill-foreground/5 stroke-foreground/12"
        strokeWidth="1"
      />
      <text x="28" y="34" className="fill-foreground/75 text-[10px]">
        I
      </text>
      <text
        x="120"
        y="34"
        className="fill-accent-orange text-[11px] font-medium"
      >
        180 A
      </text>
      <text x="28" y="54" className="fill-foreground/75 text-[10px]">
        U
      </text>
      <text
        x="120"
        y="54"
        className="fill-accent-orange text-[11px] font-medium"
      >
        24 V
      </text>
      <text x="28" y="74" className="fill-foreground/75 text-[10px]">
        v
      </text>
      <text
        x="120"
        y="74"
        className="fill-accent-orange text-[11px] font-medium"
      >
        350 mm/min
      </text>
    </svg>
  );
}
