import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { CompetencyCard } from '@/components/CompetencyCard';
import { Link } from '@/i18n/navigation';
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
    groupKey: 'expertiseGroupProcesses',
    titleKey: 'competencyIconMigMag',
    descKey: 'competencyCard1',
  },
  {
    Icon: IconCompetencyTig,
    anchorId: 'expertise-tig',
    groupKey: 'expertiseGroupProcesses',
    titleKey: 'competencyIconTigAl',
    descKey: 'competencyCard2',
  },
  {
    Icon: IconCompetencyGas,
    anchorId: 'expertise-gases',
    groupKey: 'expertiseGroupGases',
    titleKey: 'competencyIconGas',
    descKey: 'competencyCard3',
  },
  {
    Icon: IconCompetencyMetallurgy,
    anchorId: 'expertise-metallurgy',
    groupKey: 'expertiseGroupMetallurgy',
    titleKey: 'competencyIconMetallurgy',
    descKey: 'competencyCard5',
  },
  {
    Icon: IconCompetencyCutting,
    anchorId: 'expertise-quality',
    groupKey: 'expertiseGroupMaterials',
    titleKey: 'competencyIconCuttingGases',
    descKey: 'competencyCard6',
  },
  {
    Icon: IconCompetencyGasSafety,
    anchorId: 'expertise-safety',
    groupKey: 'expertiseGroupSafety',
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
          {t('expertiseDecisionEyebrow')}
        </p>
        <h1 className="heading-1 text-accent-orange">
          {t('competenciesTitle')}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-foreground/85">
          {t('expertisePageIntro')}
        </p>
      </div>

      <ul className="mt-12 grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {expertiseItems.map(
          ({ Icon, anchorId, groupKey, titleKey, descKey }) => (
            <li key={anchorId} id={anchorId} className="scroll-mt-24">
              <div className="flex h-full flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-accent-blue">
                  {t(groupKey)}
                </p>
                <CompetencyCard
                  variant="technical"
                  title={t(titleKey)}
                  description={t(descKey)}
                  icon={
                    <Icon className="h-6 w-6" aria-hidden title={undefined} />
                  }
                />
              </div>
            </li>
          )
        )}
      </ul>

      <section className="mt-12 grid gap-4 md:grid-cols-2">
        <Link
          href="/solutions"
          className="card block p-6 transition-colors hover:border-accent-orange/60 hover:bg-[var(--surface-elevated)]"
        >
          <h2 className="heading-3 text-foreground">
            {t('expertiseSolutionsCtaTitle')}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/80">
            {t('expertiseSolutionsCtaText')}
          </p>
          <span className="mt-4 inline-flex text-sm font-semibold text-accent-orange">
            {t('expertiseSolutionsCta')} →
          </span>
        </Link>
        <Link
          href="/experience"
          className="card block p-6 transition-colors hover:border-accent-orange/60 hover:bg-[var(--surface-elevated)]"
        >
          <h2 className="heading-3 text-foreground">
            {t('expertiseExperienceCtaTitle')}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/80">
            {t('expertiseExperienceCtaText')}
          </p>
          <span className="mt-4 inline-flex text-sm font-semibold text-accent-orange">
            {t('expertiseExperienceCta')} →
          </span>
        </Link>
      </section>
    </div>
  );
}
