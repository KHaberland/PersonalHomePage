import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Section } from '@/components/Section';
import { ToolCardLink } from '@/components/ToolCardLink';
import { getTools } from '@/lib/api';
import type { Lang } from '@/lib/api-types';
import { getCmsPage } from '@/lib/cms-content';
import { buildFallbackTools } from '@/lib/fallback-content';
import { createPageMetadata } from '@/lib/metadata';

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
    titleKey: 'toolsTitle',
    descriptionKey: 'toolsDescription',
    path: '/tools',
  });
}

export default async function ToolsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = langFromLocale(locale);

  const [t, apiTools, content] = await Promise.all([
    getTranslations('home'),
    getTools(lang).catch(() => []),
    getCmsPage('tools', locale),
  ]);
  const toolsText = (key: string) => content.list_intro?.[key] || '';

  const tools =
    apiTools.length > 0
      ? apiTools
      : buildFallbackTools(t).map((item) => ({
          ...item,
          created_at: '',
        }));

  return (
    <Section bordered={false} scrollMargin={false}>
      <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-accent-blue">
        {toolsText('toolsEyebrow')}
      </p>
      <h1 className="heading-1 mb-4 text-accent-orange">
        {toolsText('toolsTitle')}
      </h1>
      <p className="mb-12 text-foreground/80">
        {toolsText('toolsDescription')}
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCardLink
            key={tool.id}
            tool={tool}
            ctaText={toolsText('toolsCta')}
            density="comfortable"
          />
        ))}
      </div>
    </Section>
  );
}
