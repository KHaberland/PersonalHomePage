import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { IconShieldingGasCalculator } from '@/components/icons';

const TOOL_ICONS: Partial<Record<string, ReactNode>> = {
  'shielding-gas': (
    <IconShieldingGasCalculator
      className="h-6 w-6 text-accent-orange"
      title="Shielding Gas Selection Calculator"
    />
  ),
};

export type ToolCardItem = {
  id: number | string;
  slug: string;
  name: string;
  description: string;
};

type ToolCardLinkProps = {
  tool: ToolCardItem;
  ctaText?: string;
  /** Главная: компактная сетка; /tools — крупная карточка со стрелкой */
  density?: 'compact' | 'comfortable';
};

/**
 * Одна карточка инструмента для списков: данные с API (или fallback), без разметки под каждый slug.
 */
export function ToolCardLink({
  tool,
  ctaText,
  density = 'comfortable',
}: ToolCardLinkProps) {
  const isCompact = density === 'compact';
  const icon = TOOL_ICONS[tool.slug];

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={
        isCompact ? 'card card-compact block' : 'card card-comfortable block'
      }
    >
      {icon ? (
        <div
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent-orange/10"
          aria-hidden={true}
        >
          {icon}
        </div>
      ) : null}
      {isCompact ? (
        <>
          <h3 className="heading-3 text-foreground">{tool.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-foreground/80">
            {tool.description}
          </p>
        </>
      ) : (
        <>
          <h2 className="heading-3 text-foreground">{tool.name}</h2>
          <p className="mt-2 text-foreground/80">{tool.description}</p>
          {ctaText ? (
            <span className="link-accent mt-4 inline-block text-sm">
              {ctaText} →
            </span>
          ) : null}
        </>
      )}
    </Link>
  );
}
