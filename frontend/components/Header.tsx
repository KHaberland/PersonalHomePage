'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { primaryNavLinks } from '@/lib/ia';
import { LanguageSwitcher } from './LanguageSwitcher';
import type { LabelMap } from '@/lib/common-labels';

const navLinkClass =
  'block py-2 text-sm text-foreground/80 transition-colors hover:text-accent-orange md:inline-block md:py-0';

type HeaderProps = {
  headerLabels?: LabelMap;
  navLabels?: LabelMap;
  brandLabels?: LabelMap;
  languageLabels?: LabelMap;
};

export function Header({
  headerLabels,
  navLabels,
  brandLabels,
  languageLabels,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navText = (key: string) => navLabels?.[key] ?? '';
  const headerText = (key: string) => headerLabels?.[key] ?? '';
  const brandText = (key: string) => brandLabels?.[key] ?? 'Oleg Suvorov';
  const languageText = (key: string) => languageLabels?.[key] ?? 'Language';

  const closeMobile = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 shrink-0 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <nav className="container-wide flex items-center px-4 py-4 md:px-6">
        <div className="shrink-0">
          <Link
            href="/"
            className="block text-xl font-bold text-accent-orange transition-colors hover:text-accent-orange/90"
          >
            {brandText('name')}
          </Link>
          <p className="caption hidden font-medium uppercase tracking-wide sm:block">
            {headerText('systemLabel')}
          </p>
        </div>

        <div className="ml-4 hidden min-h-0 flex-1 items-center justify-between gap-4 md:flex">
          <div className="flex min-w-0 flex-wrap items-center gap-6">
            {primaryNavLinks.map((item) => (
              <Link key={item.href} href={item.href} className={navLinkClass}>
                {navText(item.key)}
              </Link>
            ))}
          </div>
          <LanguageSwitcher ariaLabel={languageText('switcherAriaLabel')} />
        </div>

        <div className="ml-auto flex items-center gap-3 md:hidden">
          <LanguageSwitcher ariaLabel={languageText('switcherAriaLabel')} />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded p-2 text-foreground/80 hover:bg-surface hover:text-accent-orange"
            aria-expanded={mobileMenuOpen}
            aria-label={
              mobileMenuOpen ? headerText('menuClose') : headerText('menuOpen')
            }
          >
            {mobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-surface md:hidden">
          <div className="container-wide flex flex-col gap-1 px-4 py-4">
            {primaryNavLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobile}
                className={navLinkClass}
              >
                {navText(item.key)}
              </Link>
            ))}
            <p className="caption mt-3 border-t border-border pt-3 font-medium uppercase tracking-wide">
              {headerText('systemFlow')}
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
