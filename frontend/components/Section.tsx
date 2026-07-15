import type { ReactNode } from 'react';

export type SectionVariant = 'default' | 'surface' | 'tools';
export type SectionContainer = 'wide' | 'narrow';
export type SectionAs = 'section' | 'article' | 'div';

type SectionProps = {
  id?: string;
  variant?: SectionVariant;
  /** Ширина контейнера: `wide` — списки и лендинги, `narrow` — статьи и формы */
  container?: SectionContainer;
  /** Корневой HTML-элемент (например `article` для детальной страницы блога) */
  as?: SectionAs;
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

const containerClassByWidth: Record<SectionContainer, string> = {
  wide: 'container-wide',
  narrow: 'container-narrow',
};

/**
 * Единый каркас секции: отступы `.section`, контейнер `container-wide` или `container-narrow`.
 * П. 8 site_rework — унификация отступов и структуры блоков.
 */
export function Section({
  id,
  variant = 'default',
  container = 'wide',
  as: Component = 'section',
  bordered = true,
  scrollMargin = true,
  className = '',
  containerClassName = '',
  'aria-labelledby': ariaLabelledBy,
  children,
}: SectionProps) {
  return (
    <Component
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
        className={[containerClassByWidth[container], containerClassName]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </div>
    </Component>
  );
}
