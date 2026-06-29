import { Link } from '@/i18n/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { CompetencyCard } from '@/components/CompetencyCard';
import {
  IconCompetencyCutting,
  IconCompetencyGas,
  IconCompetencyGasSafety,
  IconCompetencyMetallurgy,
  IconCompetencyMigMag,
  IconCompetencyTig,
} from '@/components/icons';
import { createPageMetadata } from '@/lib/metadata';

const expertiseItems = [
  {
    Icon: IconCompetencyMigMag,
    anchorId: 'expertise-mig-mag',
    titleKey: 'competencyIconMigMag',
    descKey: 'competencyCard1',
  },
  {
    Icon: IconCompetencyTig,
    anchorId: 'expertise-tig',
    titleKey: 'competencyIconTigAl',
    descKey: 'competencyCard2',
  },
  {
    Icon: IconCompetencyGas,
    anchorId: 'expertise-gases',
    titleKey: 'competencyIconGas',
    descKey: 'competencyCard3',
  },
  {
    Icon: IconCompetencyMetallurgy,
    anchorId: 'expertise-metallurgy',
    titleKey: 'competencyIconMetallurgy',
    descKey: 'competencyCard5',
  },
  {
    Icon: IconCompetencyCutting,
    anchorId: 'expertise-quality',
    titleKey: 'competencyIconCuttingGases',
    descKey: 'competencyCard6',
  },
  {
    Icon: IconCompetencyGasSafety,
    anchorId: 'expertise-safety',
    titleKey: 'competencyIconEquipment',
    descKey: 'competencyCard4',
  },
] as const;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return createPageMetadata({
    locale,
    titleKey: 'expertiseTitle',
    descriptionKey: 'expertiseDescription',
    path: '/expertise',
  });
}

export default async function ExpertisePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');

  return (
    <div className="container-wide section">
      <div className="max-w-4xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-accent-blue">
          {t('competenciesTechnicalSubtitle')}
        </p>
        <h1 className="heading-1 text-accent-orange">
          {t('competenciesTitle')}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-foreground/85">
          {t('expertisePageIntro')}
        </p>
      </div>

      <ul className="mt-12 grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {expertiseItems.map(({ Icon, anchorId, titleKey, descKey }) => (
          <li key={anchorId} id={anchorId} className="scroll-mt-24">
            <CompetencyCard
              variant="technical"
              title={t(titleKey)}
              description={t(descKey)}
              icon={<Icon className="h-6 w-6" aria-hidden title={undefined} />}
            />
          </li>
        ))}
      </ul>

      <div className="mt-12 rounded-2xl border border-border bg-surface/70 p-6">
        <h2 className="heading-3 text-foreground">{t('expertiseCtaTitle')}</h2>
        <p className="mt-3 max-w-3xl text-foreground/80">
          {t('expertiseCtaText')}
        </p>
        <Link href="/contact" className="btn-primary mt-6 inline-block">
          {t('ctaBannerContact')}
        </Link>
      </div>
    </div>
  );
}
