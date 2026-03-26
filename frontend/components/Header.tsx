'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './LanguageSwitcher';

/** Якоря ключевых блоков главной — порядок как на странице (п. 1 site_rework) */
const homeSectionLinks = [
  { href: '/#why-choose', key: 'homeSectionWhy' as const },
  { href: '/#about', key: 'homeSectionAbout' as const },
  { href: '/#competencies', key: 'expertiseCompetencies' as const },
  { href: '/#services', key: 'expertiseServices' as const },
  { href: '/#cases', key: 'expertiseCases' as const },
  { href: '/#experience', key: 'homeSectionExperience' as const },
  { href: '/#book', key: 'homeSectionBook' as const },
  { href: '/#tools', key: 'homeSectionTools' as const },
  { href: '/#blog', key: 'homeSectionBlog' as const },
  { href: '/#contact', key: 'homeSectionContact' as const },
] as const;

const navRest = [
  { href: '/tools', key: 'toolsNav' as const },
  { href: '/blog', key: 'blogNav' as const },
  { href: '/knowledge', key: 'knowledgeNav' as const },
  { href: '/book', key: 'book' as const },
  { href: '/contact', key: 'contact' as const },
] as const;

const navLinkClass =
  'block py-2 text-sm text-foreground/80 transition-colors hover:text-accent-orange md:inline-block md:py-0';

export function Header() {
  const t = useTranslations('common');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expertiseOpen, setExpertiseOpen] = useState(false);

  const closeMobile = () => {
    setMobileMenuOpen(false);
    setExpertiseOpen(false);
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
            <Link href="/" className={navLinkClass}>
              {t('home')}
            </Link>

            <div className="group relative">
              <span className="inline-block cursor-default py-2 text-sm text-foreground/80">
                {t('homePageSections')}
              </span>
              <div className="invisible absolute left-0 top-full z-50 max-h-[min(70vh,24rem)] min-w-[14rem] overflow-y-auto pt-1 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                <div className="rounded-md border border-border bg-surface py-1 shadow-lg">
                  {homeSectionLinks.map(({ href, key }) => (
                    <Link
                      key={href}
                      href={href}
                      className="block px-4 py-2 text-sm text-foreground/90 hover:bg-[var(--surface-elevated)] hover:text-accent-orange"
                    >
                      {t(key)}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {navRest.map(({ href, key }) => (
              <Link key={href} href={href} className={navLinkClass}>
                {t(key)}
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
            <Link href="/" onClick={closeMobile} className={navLinkClass}>
              {t('home')}
            </Link>

            <div className="border-b border-border/60 py-1">
              <button
                type="button"
                onClick={() => setExpertiseOpen(!expertiseOpen)}
                className="flex w-full items-center justify-between py-2 text-left text-sm text-foreground/80"
                aria-expanded={expertiseOpen}
              >
                {t('homePageSections')}
                <span className="text-xs text-foreground/50" aria-hidden>
                  {expertiseOpen ? '−' : '+'}
                </span>
              </button>
              {expertiseOpen && (
                <div className="ml-3 flex max-h-64 flex-col gap-1 overflow-y-auto border-l border-border pl-3">
                  {homeSectionLinks.map(({ href, key }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={closeMobile}
                      className="py-1.5 text-sm text-foreground/85 hover:text-accent-orange"
                    >
                      {t(key)}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navRest.map(({ href, key }) => (
              <Link
                key={href}
                href={href}
                onClick={closeMobile}
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
