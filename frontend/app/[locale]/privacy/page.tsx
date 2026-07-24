import { Link } from '@/i18n/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Section } from '@/components/Section';
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

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return createPageMetadata({
    locale,
    titleKey: 'privacyTitle',
    descriptionKey: 'privacyDescription',
    path: '/privacy',
  });
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = langFromLocale(locale);

  const [content, commonContent] = await Promise.all([
    getPageContent('legal', lang).catch(
      () => ({}) as Record<string, Record<string, string>>
    ),
    getCmsPage('common', locale),
  ]);
  const contactLabel = commonContent.nav?.contact || 'Contact';
  const title = content.privacy?.title || '';
  const body = sanitizeAboutHtml(content.privacy?.body);
  const newsletterSection = sanitizeAboutHtml(
    content.privacy?.newsletterSection
  );

  return (
    <Section container="narrow" bordered={false} scrollMargin={false}>
      <h1 className="heading-1 mb-4 text-accent-orange">{title}</h1>

      {body && (
        <div
          className="prose prose-invert max-w-none space-y-4 text-sm text-foreground/90 [&_a]:link-accent [&_h2]:heading-3 [&_h2]:mt-8 [&_p]:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: body }}
        />
      )}

      {newsletterSection && (
        <div
          className="card-subtle mt-10 border-t border-border pt-8 prose prose-invert max-w-none space-y-4 text-sm text-foreground/90 [&_a]:link-accent [&_h2]:heading-3 [&_p]:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: newsletterSection }}
        />
      )}

      <p className="caption mt-10">
        <Link href="/contact" className="link-accent hover:underline">
          {contactLabel}
        </Link>
      </p>
    </Section>
  );
}
