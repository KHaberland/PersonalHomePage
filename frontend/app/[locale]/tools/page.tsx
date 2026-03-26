import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Section } from '@/components/Section';
import { ToolCardLink } from '@/components/ToolCardLink';
import { getTools } from '@/lib/api';
import { buildFallbackTools } from '@/lib/fallback-content';
import { createPageMetadata } from '@/lib/metadata';

type Props = {
  params: Promise<{ locale: string }>;
};

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

  const [t, apiTools] = await Promise.all([
    getTranslations('home'),
    getTools().catch(() => []),
  ]);

  const tools =
    apiTools.length > 0
      ? apiTools
      : buildFallbackTools(t).map((item) => ({
          ...item,
          created_at: '',
        }));

  return (
    <Section bordered={false} scrollMargin={false}>
      <h1 className="heading-1 mb-4 text-accent-orange">{t('toolsTitle')}</h1>
      <p className="mb-12 text-foreground/80">{t('toolsDescription')}</p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCardLink
            key={tool.id}
            tool={tool}
            ctaText={t('toolsCta')}
            density="comfortable"
          />
        ))}
      </div>
    </Section>
  );
}
