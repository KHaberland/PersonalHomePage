'use client';

import { Link } from '@/i18n/navigation';
import { decisionSystemLayers, supportNavLinks } from '@/lib/ia';
import { LanguageSwitcher } from './LanguageSwitcher';
import type { LabelMap } from '@/lib/common-labels';

const socialLinkIcons = {
  linkedin: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  youtube: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
} as const;

type FooterProps = {
  email?: string;
  linkedinUrl?: string | null;
  youtubeUrl?: string | null;
  footerLabels?: LabelMap;
  navLabels?: LabelMap;
  homeLabels?: LabelMap;
  brandLabels?: LabelMap;
  platformLabels?: LabelMap;
  languageLabels?: LabelMap;
};

export function Footer({
  email,
  linkedinUrl,
  youtubeUrl,
  footerLabels,
  navLabels,
  homeLabels,
  brandLabels,
  platformLabels,
  languageLabels,
}: FooterProps) {
  const footerText = (key: string) => footerLabels?.[key] ?? '';
  const navText = (key: string) => navLabels?.[key] ?? '';
  const homeText = (key: string) =>
    homeLabels?.[key] ?? navLabels?.contact ?? '';
  const brandText = (key: string) => brandLabels?.[key] ?? 'Oleg Suvorov';
  const platformText = (key: string) =>
    platformLabels?.[key] ?? footerText(key);
  const languageText = (key: string) =>
    languageLabels?.[key] ?? footerText('languages');

  const socialLinks = [
    linkedinUrl && { href: linkedinUrl, key: 'linkedin' as const },
    youtubeUrl && { href: youtubeUrl, key: 'youtube' as const },
  ].filter(Boolean) as { href: string; key: 'linkedin' | 'youtube' }[];

  const linkClass =
    'text-sm text-foreground/80 transition-colors hover:text-accent-orange';

  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-wide px-4 py-12 md:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold text-accent-orange">
              {brandText('name')}
            </p>
            <p className="mt-1 text-sm text-foreground/80">
              {footerText('tagline')}
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
            {email && (
              <div>
                <p className="text-sm font-medium text-foreground">
                  {footerText('contact')}
                </p>
                <a href={`mailto:${email}`} className={linkClass}>
                  {email}
                </a>
              </div>
            )}
            {socialLinks.length > 0 && (
              <div className="flex gap-4">
                {socialLinks.map(({ href, key }) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                    aria-label={platformText(key)}
                  >
                    {socialLinkIcons[key]}
                  </a>
                ))}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-foreground">
                {footerText('languages')}
              </p>
              <LanguageSwitcher ariaLabel={languageText('switcherAriaLabel')} />
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8">
          <p className="text-center text-sm font-medium text-foreground">
            {footerText('ctaHint')}
          </p>
          <div className="mt-4 flex justify-center">
            <Link
              href="/contact"
              className="btn-secondary inline-block px-8 py-3"
            >
              {homeText('heroCtaContact')}
            </Link>
          </div>
        </div>

        <nav
          className="mt-8 grid gap-8 border-t border-border pt-8 sm:grid-cols-2 lg:grid-cols-4"
          aria-label={footerText('navigationAriaLabel')}
        >
          {decisionSystemLayers.map((group) => (
            <div key={group.id}>
              <p className="text-sm font-medium text-foreground">
                {footerText(group.titleKey)}
              </p>
              <div className="mt-3 flex flex-col gap-2">
                {group.links.map(({ href, key }) => (
                  <Link key={href} href={href} className={linkClass}>
                    {navText(key)}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div>
            <p className="text-sm font-medium text-foreground">
              {footerText('supportTitle')}
            </p>
            <div className="mt-3 flex flex-col gap-2">
              {supportNavLinks.map(({ href, key }) => (
                <Link key={href} href={href} className={linkClass}>
                  {navText(key)}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <p className="mt-8 text-center text-xs text-foreground/50">
          © {new Date().getFullYear()} {brandText('name')}.{' '}
          {footerText('rights')}
        </p>
      </div>
    </footer>
  );
}
