'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './LanguageSwitcher';

const navItems = [
  { href: '/', key: 'home' },
  { href: '/about', key: 'about' },
  { href: '/experience', key: 'experience' },
  { href: '/book', key: 'book' },
  { href: '/tools', key: 'tools' },
  { href: '/knowledge', key: 'knowledge' },
  { href: '/blog', key: 'blog' },
  { href: '/contact', key: 'contact' },
] as const;

const navLinkClass =
  'block py-2 text-sm text-foreground/80 transition-colors hover:text-accent-orange md:inline-block md:py-0';

export function Header() {
  const t = useTranslations('common');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <nav className="container-wide flex items-center justify-between px-4 py-4 md:px-6">
        {/* Логотип */}
        <Link
          href="/"
          className="text-xl font-bold text-accent-orange transition-colors hover:text-accent-orange/90"
        >
          Oleg Suvorov
        </Link>

        {/* Desktop: навигация + переключатель языка */}
        <div className="hidden items-center gap-6 md:flex">
          {navItems.map(({ href, key }) => (
            <Link key={href} href={href} className={navLinkClass}>
              {t(key)}
            </Link>
          ))}
          <LanguageSwitcher />
        </div>

        {/* Mobile: кнопка меню */}
        <div className="flex items-center gap-3 md:hidden">
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

      {/* Mobile: выпадающее меню */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-surface md:hidden">
          <div className="container-wide flex flex-col gap-1 px-4 py-4">
            {navItems.map(({ href, key }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass}
              >
                {t(key)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
