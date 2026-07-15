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
  const steps = [
    { x: 32, label: 'Material', state: 'completed' as const },
    { x: 88, label: 'Process', state: 'completed' as const },
    { x: 144, label: 'Thickness', state: 'active' as const },
    { x: 200, label: 'Gas', state: 'pending' as const },
    { x: 256, label: 'Result', state: 'pending' as const },
  ];

  return (
    <svg
      viewBox="0 0 320 132"
      className="h-auto w-full max-w-md"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="16"
        y="16"
        width="288"
        height="6"
        rx="3"
        className="fill-foreground/10"
      />
      <rect
        x="16"
        y="16"
        width="172"
        height="6"
        rx="3"
        className="fill-orange-500/80"
      />
      {steps.map((step, index) => {
        const next = steps[index + 1];
        const circleClass =
          step.state === 'active'
            ? 'fill-orange-500/20 stroke-orange-500'
            : step.state === 'completed'
              ? 'fill-emerald-500/25 stroke-emerald-500'
              : 'fill-foreground/5 stroke-foreground/25';
        const textClass =
          step.state === 'active'
            ? 'fill-orange-500 font-medium'
            : step.state === 'completed'
              ? 'fill-foreground/70'
              : 'fill-foreground/45';
        return (
          <g key={step.label}>
            {next && (
              <line
                x1={step.x + 14}
                y1="52"
                x2={next.x - 14}
                y2="52"
                className={
                  step.state === 'completed'
                    ? 'stroke-emerald-500/50'
                    : 'stroke-foreground/15'
                }
                strokeWidth="1.5"
              />
            )}
            <circle
              cx={step.x}
              cy="52"
              r="14"
              className={circleClass}
              strokeWidth="1.5"
            />
            <text
              x={step.x}
              y="56"
              textAnchor="middle"
              className={`text-[10px] font-semibold ${textClass}`}
            >
              {index + 1}
            </text>
            <text
              x={step.x}
              y="82"
              textAnchor="middle"
              className={`text-[8px] ${textClass}`}
            >
              {step.label}
            </text>
          </g>
        );
      })}
      <rect
        x="196"
        y="96"
        width="108"
        height="24"
        rx="4"
        className="fill-foreground/5 stroke-foreground/12"
        strokeWidth="1"
      />
      <text x="206" y="112" className="fill-foreground/55 text-[8px]">
        ISO · score 1–5
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
