'use client';

import { usePathname, Link } from '@/i18n/navigation';
import { useLocale } from 'next-intl';

const locales = [
  { code: 'en' as const, label: 'EN' },
  { code: 'ru' as const, label: 'RU' },
  { code: 'lv' as const, label: 'LV' },
];

export function LanguageSwitcher() {
  const pathname = usePathname();
  const currentLocale = useLocale();

  return (
    <nav className="flex gap-2">
      {locales.map(({ code, label }) => (
        <Link
          key={code}
          href={pathname || '/'}
          locale={code}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            currentLocale === code
              ? 'bg-[#f97316] text-white'
              : 'bg-[#161b22] text-foreground/80 hover:bg-[#30363d]'
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
