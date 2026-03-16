import { NextIntlClientProvider } from 'next-intl';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { getMessages } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Layout } from '@/components/Layout';
import { getContact } from '@/lib/api';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const [messages, contact] = await Promise.all([
    getMessages(),
    getContact().catch(() => null),
  ]);

  return (
    <NextIntlClientProvider messages={messages}>
      <Layout contact={contact}>{children}</Layout>
    </NextIntlClientProvider>
  );
}
