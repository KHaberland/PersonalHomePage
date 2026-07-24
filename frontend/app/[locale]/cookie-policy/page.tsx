import { Link } from '@/i18n/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Section } from '@/components/Section';
import { CookieSettingsButton } from '@/components/cookie-consent/CookieSettingsButton';
import { getCmsPage } from '@/lib/cms-content';
import { getPageContent } from '@/lib/api';
import type { Lang } from '@/lib/api-types';
import { createPageMetadata } from '@/lib/metadata';
import { sanitizeAboutHtml } from '@/lib/sanitize-html';

type Props = {
  params: Promise<{ locale: string }>;
};

function langFromLocale(locale: string): Lang {
  return locale === 'en' || locale === 'ru' || locale === 'lv'
    ? (locale as Lang)
    : 'en';
}

const proseClassName =
  'prose prose-invert max-w-none space-y-4 text-sm text-foreground/90 [&_a]:link-accent [&_h2]:heading-3 [&_h2]:mt-8 [&_p]:leading-relaxed [&_table]:mt-4 [&_table]:w-full [&_table]:border-collapse [&_th]:border-b [&_th]:border-border [&_th]:pb-2 [&_th]:pr-3 [&_th]:text-left [&_th]:text-xs [&_th]:font-medium [&_td]:border-b [&_td]:border-border/50 [&_td]:py-2 [&_td]:pr-3 [&_td]:align-top [&_td]:text-xs';

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return createPageMetadata({
    locale,
    titleKey: 'cookiePolicyTitle',
    descriptionKey: 'cookiePolicyDescription',
    path: '/cookie-policy',
  });
}

export default async function CookiePolicyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = langFromLocale(locale);

  const [content, commonContent] = await Promise.all([
    getPageContent('legal', lang).catch(
      () => ({}) as Record<string, Record<string, string>>
    ),
    getCmsPage('common', locale),
  ]);
  const privacyLabel = commonContent.nav?.privacyNav || 'Privacy';
  const title = content.cookie_policy?.title || '';
  const body = sanitizeAboutHtml(content.cookie_policy?.body);

  return (
    <Section container="narrow" bordered={false} scrollMargin={false}>
      <h1 className="heading-1 mb-4 text-accent-orange">{title}</h1>

      {body && (
        <div
          className={proseClassName}
          dangerouslySetInnerHTML={{ __html: body }}
        />
      )}

      <p className="caption mt-10">
        <CookieSettingsButton />
        {' · '}
        <Link href="/privacy" className="link-accent hover:underline">
          {privacyLabel}
        </Link>
      </p>
    </Section>
  );
}
