import { setRequestLocale } from 'next-intl/server';
import { CompetencyCard } from '@/components/CompetencyCard';
import { Section } from '@/components/Section';
import { Link } from '@/i18n/navigation';
import {
  IconCompetencyCutting,
  IconCompetencyGas,
  IconCompetencyGasSafety,
  IconCompetencyMetallurgy,
  IconCompetencyMigMag,
  IconCompetencyTig,
} from '@/components/icons';
import { getCmsPage } from '@/lib/cms-content';
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
  const content = await getCmsPage('expertise', locale);
  const expertiseText = (section: string, key: string) =>
    content[section]?.[key] || '';

  return (
    <Section bordered={false} scrollMargin={false}>
      <div className="max-w-4xl">
        <p className="eyebrow-blue mb-3">
          {expertiseText('hero', 'expertiseDecisionEyebrow')}
        </p>
        <h1 className="heading-1 text-accent-orange">
          {expertiseText('hero', 'competenciesTitle')}
        </h1>
        <p className="lead mt-6 max-w-3xl">
          {expertiseText('hero', 'expertisePageIntro')}
        </p>
      </div>

      <ul className="mt-12 grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {expertiseItems.map(({ Icon, anchorId }) => {
          const competencyBlock = `competency_${anchorId
            .replace('expertise-', '')
            .replaceAll('-', '_')}`;

          return (
            <li key={anchorId} id={anchorId} className="scroll-mt-24">
              <div className="flex h-full flex-col gap-3">
                <p className="eyebrow-blue-sm">
                  {expertiseText(competencyBlock, 'group')}
                </p>
                <CompetencyCard
                  variant="technical"
                  title={expertiseText(competencyBlock, 'title')}
                  description={expertiseText(competencyBlock, 'description')}
                  icon={
                    <Icon className="h-6 w-6" aria-hidden title={undefined} />
                  }
                />
              </div>
            </li>
          );
        })}
      </ul>

      <section className="mt-12 grid gap-4 md:grid-cols-2">
        <Link href="/solutions" className="card card-interactive block p-6">
          <h2 className="heading-3 text-foreground">
            {expertiseText('cta_solutions', 'expertiseSolutionsCtaTitle')}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/80">
            {expertiseText('cta_solutions', 'expertiseSolutionsCtaText')}
          </p>
          <span className="mt-4 inline-flex text-sm font-semibold text-accent-orange">
            {expertiseText('cta_solutions', 'expertiseSolutionsCta')} →
          </span>
        </Link>
        <Link href="/experience" className="card card-interactive block p-6">
          <h2 className="heading-3 text-foreground">
            {expertiseText('cta_experience', 'expertiseExperienceCtaTitle')}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/80">
            {expertiseText('cta_experience', 'expertiseExperienceCtaText')}
          </p>
          <span className="mt-4 inline-flex text-sm font-semibold text-accent-orange">
            {expertiseText('cta_experience', 'expertiseExperienceCta')} →
          </span>
        </Link>
      </section>
    </Section>
  );
}
