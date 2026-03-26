import { Link } from '@/i18n/navigation';

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

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={isCompact ? 'card block p-4' : 'card block p-6'}
    >
      {isCompact ? (
        <>
          <h3 className="heading-3 text-foreground">{tool.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-foreground/70">
            {tool.description}
          </p>
        </>
      ) : (
        <>
          <h2 className="heading-3 text-foreground">{tool.name}</h2>
          <p className="mt-2 text-foreground/70">{tool.description}</p>
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
