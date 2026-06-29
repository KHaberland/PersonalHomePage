'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './LanguageSwitcher';

const primaryNavLinks = [
  { href: '/', key: 'home' as const, dropdown: null },
  { href: '/about', key: 'about' as const, dropdown: null },
  { href: '/experience', key: 'experience' as const, dropdown: null },
  { href: '/expertise', key: 'expertise' as const, dropdown: null },
  { href: '/solutions', key: 'solutions' as const, dropdown: null },
  { href: '/tools', key: 'toolsNav' as const, dropdown: null },
  { href: '/blog', key: 'blogKnowledge' as const, dropdown: null },
  { href: '/knowledge', key: 'knowledgeNav' as const, dropdown: null },
  { href: '/contact', key: 'contact' as const, dropdown: null },
] as const;

const navLinkClass =
  'block py-2 text-sm text-foreground/80 transition-colors hover:text-accent-orange md:inline-block md:py-0';

export function Header() {
  const t = useTranslations('common');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobile = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 shrink-0 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <nav className="container-wide flex items-center px-4 py-4 md:px-6">
        <Link
          href="/"
          className="shrink-0 text-xl font-bold text-accent-orange transition-colors hover:text-accent-orange/90"
        >
          Oleg Suvorov
        </Link>

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
            aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
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
          </div>
        </div>
      )}
    </header>
  );
}
