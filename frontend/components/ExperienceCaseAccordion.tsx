'use client';

import { useId, useState } from 'react';
import { Link } from '@/i18n/navigation';

export type ExperienceCaseItem = {
  id: string;
  title: string;
  summary: string;
  context: string;
  problem: string;
  engineeringAction: string;
  result: string;
  moreHref?: string;
  moreLabel?: string;
};

type Props = {
  items: ExperienceCaseItem[];
  labels: {
    toggleShow: string;
    toggleHide: string;
    context: string;
    problem: string;
    engineeringAction: string;
    result: string;
  };
};

export function ExperienceCaseAccordion({ items, labels }: Props) {
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
              className={`card card-passive overflow-hidden ${isOpen ? 'card-expanded' : ''}`}
            >
              <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                <div className="min-w-0 flex-1">
                  <h3 id={titleId} className="heading-3 text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-foreground/80">
                    {item.summary}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-secondary shrink-0 self-start"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                >
                  {isOpen ? labels.toggleHide : labels.toggleShow}
                </button>
              </div>
              <div
                id={panelId}
                role="region"
                aria-labelledby={titleId}
                hidden={!isOpen}
                className="border-t border-border/80 px-4 pb-4 pt-3"
              >
                <div className="space-y-4 text-sm leading-relaxed text-foreground/80">
                  <dl className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <dt className="font-semibold text-accent-orange">
                        {labels.context}
                      </dt>
                      <dd className="mt-1 text-foreground/80">
                        {item.context}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-accent-orange">
                        {labels.problem}
                      </dt>
                      <dd className="mt-1 text-foreground/80">
                        {item.problem}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-accent-orange">
                        {labels.engineeringAction}
                      </dt>
                      <dd className="mt-1 text-foreground/80">
                        {item.engineeringAction}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-accent-orange">
                        {labels.result}
                      </dt>
                      <dd className="mt-1 text-foreground/80">{item.result}</dd>
                    </div>
                  </dl>
                  {item.moreHref && item.moreLabel ? (
                    <Link
                      href={item.moreHref}
                      className="link-accent inline-flex items-center gap-1"
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
