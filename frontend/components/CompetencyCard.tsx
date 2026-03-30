import Image from 'next/image';
import type { ReactNode } from 'react';

export type CompetencyCardVariant = 'technical' | 'business';

type CompetencyCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  /** Технические навыки (оранжевый акцент) или результаты для бизнеса (синий) */
  variant?: CompetencyCardVariant;
  /** Верхнее изображение (например, кейсы на главной) */
  imageSrc?: string;
  imageAlt?: string;
};

export function CompetencyCard({
  title,
  description,
  icon,
  variant = 'technical',
  imageSrc,
  imageAlt,
}: CompetencyCardProps) {
  const hasImage = Boolean(imageSrc);
  const isBusiness = variant === 'business';

  return (
    <article
      className={`card flex h-full min-h-0 flex-col gap-3 overflow-hidden ${hasImage ? 'p-0' : 'p-5'} ${isBusiness ? 'competency-card--business' : ''}`}
    >
      {hasImage && imageSrc && (
        <div className="relative aspect-[16/10] w-full shrink-0 border-b border-border">
          <Image
            src={imageSrc}
            alt={imageAlt ?? ''}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 33vw"
          />
        </div>
      )}
      <div
        className={`flex min-h-0 flex-1 flex-col gap-3 ${hasImage ? 'p-5' : ''}`}
      >
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-lg ${isBusiness ? 'bg-accent-blue/15 text-accent-blue' : 'bg-accent-orange/10 text-accent-orange'}`}
        >
          {icon}
        </div>
        <h3 className="heading-3 text-foreground">{title}</h3>
        {description ? (
          <p
            className={`text-sm leading-relaxed ${isBusiness ? 'text-foreground/85' : 'text-foreground/80'}`}
          >
            {description}
          </p>
        ) : null}
      </div>
    </article>
  );
}
