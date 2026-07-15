'use client';

import { usePathname, Link } from '@/i18n/navigation';
import { useLocale } from 'next-intl';

const locales = [
  { code: 'en' as const, label: 'EN' },
  { code: 'ru' as const, label: 'RU' },
  { code: 'lv' as const, label: 'LV' },
];

type LanguageSwitcherProps = {
  ariaLabel?: string;
};

export function LanguageSwitcher({ ariaLabel }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const currentLocale = useLocale();

  return (
    <nav className="flex shrink-0 gap-1.5" aria-label={ariaLabel ?? 'Language'}>
      {locales.map(({ code, label }) => (
        <Link
          key={code}
          href={pathname || '/'}
          locale={code}
          className={`rounded px-2 py-0.5 text-sm font-medium leading-tight transition-colors ${
            currentLocale === code
              ? 'bg-accent-orange text-white'
              : 'bg-surface text-foreground/80 hover:bg-surface/80'
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
