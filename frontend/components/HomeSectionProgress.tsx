'use client';

import { useEffect, useState } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

const SECTION_IDS = [
  'why-choose',
  'about',
  'competencies',
  'services',
  'cases',
  'experience',
  'book',
  'tools',
  'blog',
  'contact',
] as const;

const SECTION_LABEL_KEYS = [
  'homeSectionWhy',
  'homeSectionAbout',
  'expertiseCompetencies',
  'expertiseServices',
  'expertiseCases',
  'homeSectionExperience',
  'homeSectionBook',
  'homeSectionTools',
  'homeSectionBlog',
  'homeSectionContact',
] as const;

/**
 * Мини-навигация по якорям главной (п. 9 site_rework): подсветка активного блока при скролле.
 */
export function HomeSectionProgress() {
  const pathname = usePathname();
  const t = useTranslations('common');
  const [activeId, setActiveId] = useState<string>(SECTION_IDS[0]);

  const isHome = pathname === '/' || pathname === '';

  useEffect(() => {
    if (!isHome || typeof window === 'undefined') return;

    const nodes = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: '-45% 0px -45% 0px',
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    for (const el of nodes) observer.observe(el);
    return () => observer.disconnect();
  }, [isHome]);

  if (!isHome) return null;

  return (
    <nav
      className="pointer-events-auto fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2 xl:flex"
      aria-label={t('homePageProgressLabel')}
    >
      {SECTION_IDS.map((id, i) => {
        const labelKey = SECTION_LABEL_KEYS[i];
        const active = activeId === id;
        return (
          <Link
            key={id}
            href={`/#${id}`}
            title={t(labelKey)}
            className={`group flex items-center justify-end gap-2 outline-none ${
              active ? 'opacity-100' : 'opacity-55 hover:opacity-90'
            }`}
          >
            <span className="max-w-[7rem] truncate text-right text-[0.65rem] font-medium uppercase tracking-wide text-foreground/80 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              {t(labelKey)}
            </span>
            <span
              className={`shrink-0 rounded-full border-2 transition-all ${
                active
                  ? 'h-2.5 w-2.5 border-accent-orange bg-accent-orange shadow-[0_0_8px_var(--accent-orange-glow)]'
                  : 'h-2 w-2 border-foreground/50 bg-transparent group-hover:border-accent-orange'
              }`}
              aria-hidden
            />
          </Link>
        );
      })}
    </nav>
  );
}
