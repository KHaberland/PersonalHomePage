import type { ReactNode } from 'react';

export type SectionVariant = 'default' | 'surface' | 'tools';

type SectionProps = {
  id?: string;
  variant?: SectionVariant;
  /** Верхняя граница между секциями (паттерн главной) */
  bordered?: boolean;
  /** Отступ под фиксированный header при якорной навигации */
  scrollMargin?: boolean;
  className?: string;
  containerClassName?: string;
  'aria-labelledby'?: string;
  children: ReactNode;
};

const variantClass: Record<SectionVariant, string> = {
  default: '',
  surface: 'bg-surface',
  tools: 'section-tools',
};

/**
 * Единый каркас секции: отступы `.section`, контейнер `container-wide`.
 * П. 8 site_rework — унификация отступов и структуры блоков.
 */
export function Section({
  id,
  variant = 'default',
  bordered = true,
  scrollMargin = true,
  className = '',
  containerClassName = '',
  'aria-labelledby': ariaLabelledBy,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={[
        'section',
        bordered ? 'border-t border-border' : '',
        scrollMargin ? 'scroll-mt-24' : '',
        variantClass[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-labelledby={ariaLabelledBy}
    >
      <div
        className={['container-wide', containerClassName]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </div>
    </section>
  );
}
