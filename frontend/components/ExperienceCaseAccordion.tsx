'use client';

import { useTranslations } from 'next-intl';
import { useId, useState } from 'react';
import { Link } from '@/i18n/navigation';

export type ExperienceCaseItem = {
  id: string;
  title: string;
  summary: string;
  detail: string;
  moreHref?: string;
  moreLabel?: string;
};

type Props = {
  items: ExperienceCaseItem[];
};

export function ExperienceCaseAccordion({ items }: Props) {
  const t = useTranslations('experience');
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <ul className="space-y-3">
      {items.map((item) => {
        const isOpen = openId === item.id;
        const panelId = `${baseId}-${item.id}-panel`;
        const titleId = `${baseId}-${item.id}-title`;

        return (
          <li key={item.id}>
            <div
              className={`card overflow-hidden border transition-colors ${
                isOpen
                  ? 'border-accent-orange/50 bg-[color-mix(in_srgb,var(--surface-elevated)_80%,transparent)]'
                  : 'border-border'
              }`}
            >
              <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                <div className="min-w-0 flex-1">
                  <h3 id={titleId} className="heading-3 text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-foreground/85">
                    {item.summary}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-secondary shrink-0 self-start px-4 py-2 text-sm"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                >
                  {isOpen ? t('caseToggleHide') : t('caseToggleShow')}
                </button>
              </div>
              <div
                id={panelId}
                role="region"
                aria-labelledby={titleId}
                hidden={!isOpen}
                className="border-t border-border/80 px-4 pb-4 pt-3"
              >
                <div className="space-y-4 text-sm leading-relaxed text-foreground/90">
                  <p>{item.detail}</p>
                  {item.moreHref && item.moreLabel ? (
                    <Link
                      href={item.moreHref}
                      className="inline-flex items-center gap-1 font-medium text-accent-orange underline-offset-4 hover:underline"
                    >
                      {item.moreLabel}
                      <span aria-hidden>→</span>
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
