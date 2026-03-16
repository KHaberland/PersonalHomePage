'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './LanguageSwitcher';

const navItems = [
  { href: '/', key: 'home' },
  { href: '/about', key: 'about' },
  { href: '/experience', key: 'experience' },
  { href: '/book', key: 'book' },
  { href: '/tools', key: 'tools' },
  { href: '/blog', key: 'blog' },
  { href: '/contact', key: 'contact' },
] as const;

export function Header() {
  const t = useTranslations('common');

  return (
    <header className="sticky top-0 z-50 border-b border-[#30363d] bg-[#0d1117]/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-[#f97316]">
          Oleg Suvorov
        </Link>
        <div className="flex items-center gap-6">
          {navItems.map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-[#e6edf3]/80 transition-colors hover:text-[#f97316]"
            >
              {t(key)}
            </Link>
          ))}
          <LanguageSwitcher />
        </div>
      </nav>
    </header>
  );
}
