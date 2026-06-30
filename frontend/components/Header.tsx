'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { primaryNavLinks } from '@/lib/ia';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './LanguageSwitcher';

const navLinkClass =
  'block py-2 text-sm text-foreground/80 transition-colors hover:text-accent-orange md:inline-block md:py-0';

export function Header() {
  const t = useTranslations('common');
  const th = useTranslations('header');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            Oleg Suvorov
          </Link>
          <p className="hidden text-xs font-medium uppercase tracking-wide text-foreground/55 sm:block">
            {th('systemLabel')}
          </p>
        </div>

        <div className="ml-4 hidden min-h-0 flex-1 items-center justify-between gap-4 md:flex">
          <div className="flex min-w-0 flex-wrap items-center gap-6">
            {primaryNavLinks.map((item) => (
              <Link key={item.href} href={item.href} className={navLinkClass}>
                {t(item.key)}
              </Link>
            ))}
          </div>
          <LanguageSwitcher />
        </div>

        <div className="ml-auto flex items-center gap-3 md:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded p-2 text-foreground/80 hover:bg-surface hover:text-accent-orange"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? th('menuClose') : th('menuOpen')}
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
                {t(item.key)}
              </Link>
            ))}
            <p className="mt-3 border-t border-border pt-3 text-xs font-medium uppercase tracking-wide text-foreground/55">
              {th('systemFlow')}
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
