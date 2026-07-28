import { Link } from '@/i18n/navigation';
import { setRequestLocale } from 'next-intl/server';
import { CmsText } from '@/components/cms/CmsText';
import { EngineerIdentityStrip } from '@/components/EngineerIdentityStrip';
import { Hero } from '@/components/Hero';
import type { HeroText } from '@/components/Hero';
import { Section } from '@/components/Section';
import { getCmsPage } from '@/lib/cms-content';
import { createPageMetadata } from '@/lib/metadata';

const userPathItems = [
  {
    href: '/solutions',
    titleKey: 'entryPathSolutionsTitle',
    descriptionKey: 'entryPathSolutionsDescription',
    ctaKey: 'entryPathSolutionsCta',
  },
  {
    href: '/experience',
    titleKey: 'entryPathExperienceTitle',
    descriptionKey: 'entryPathExperienceDescription',
    ctaKey: 'entryPathExperienceCta',
  },
  {
    href: '/knowledge',
    titleKey: 'entryPathKnowledgeTitle',
    descriptionKey: 'entryPathKnowledgeDescription',
    ctaKey: 'entryPathKnowledgeCta',
  },
  {
    href: '/tools',
    titleKey: 'entryPathToolsTitle',
    descriptionKey: 'entryPathToolsDescription',
    ctaKey: 'entryPathToolsCta',
  },
] as const;

const decisionSystemItems = [
  {
    titleKey: 'decisionReasoningTitle',
    descriptionKey: 'decisionReasoningDescription',
    links: [
      { href: '/solutions', labelKey: 'decisionLinkSolutions' },
      { href: '/expertise', labelKey: 'decisionLinkExpertise' },
    ],
  },
  {
    titleKey: 'decisionProofTitle',
    descriptionKey: 'decisionProofDescription',
    links: [
      { href: '/experience', labelKey: 'decisionLinkExperience' },
      { href: '/tools', labelKey: 'decisionLinkTools' },
    ],
  },
  {
    titleKey: 'decisionKnowledgeTitle',
    descriptionKey: 'decisionKnowledgeDescription',
    links: [
      { href: '/knowledge', labelKey: 'decisionLinkKnowledge' },
      { href: '/blog', labelKey: 'decisionLinkBlog' },
      { href: '/book', labelKey: 'decisionLinkBook' },
    ],
  },
] as const;

const proofItems = [
  'proofYears',
  'proofIwe',
  'proofBookAuthor',
  'proofIndustryExperience',
] as const;

const aboutTeaserBullets = [
  'aboutTeaserBulletProduction',
  'aboutTeaserBulletTroubleshooting',
  'aboutTeaserBulletTeams',
  'aboutTeaserBulletRequirements',
] as const;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return createPageMetadata({
    locale,
    titleKey: 'homeTitle',
    descriptionKey: 'homeDescription',
    path: '',
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const content = await getCmsPage('home', locale);
  const homeText = (section: string, key: string) =>
    content[section]?.[key] || '';
  const aboutTeaserText = (key: string) => homeText('about_teaser', key);
  const homeCms = (block: string, key: string, value: string) => (
    <CmsText page="home" block={block} cmsKey={key}>
      {value}
    </CmsText>
  );
  const heroText: HeroText = {
    videoDescription: homeText('hero', 'heroVideoDescription'),
    titleLine1: homeText('hero', 'heroTitleLine1'),
    titleLine2: homeText('hero', 'heroTitleLine2'),
    titleLineHighlight: homeText('hero', 'heroTitleLineHighlight'),
    titleLine3: homeText('hero', 'heroTitleLine3'),
    ctaSolutions: homeText('hero', 'heroCtaSolutions'),
    ctaTools: homeText('hero', 'heroCtaTools'),
  };

  return (
    <>
      <Hero text={heroText} />
      <EngineerIdentityStrip
        ariaLabel={aboutTeaserText('aboutTeaserAriaLabel')}
        photoAlt={aboutTeaserText('aboutTeaserPhotoAlt')}
        title={aboutTeaserText('aboutTeaserTitle')}
        lead={[
          {
            key: 'aboutTeaserLead1',
            text: aboutTeaserText('aboutTeaserLead1'),
          },
          {
            key: 'aboutTeaserLead2',
            text: aboutTeaserText('aboutTeaserLead2'),
          },
        ]}
        bullets={aboutTeaserBullets.map((key) => ({
          key,
          text: aboutTeaserText(key),
        }))}
        aboutCta={aboutTeaserText('aboutTeaserAboutCta')}
        experienceCta={aboutTeaserText('aboutTeaserExperienceCta')}
      />

      <Section
        id="decision-system"
        variant="surface"
        aria-labelledby="home-decision-system-heading"
      >
        <p className="eyebrow-blue mb-3">
          {homeCms(
            'decision_system',
            'decisionSystemEyebrow',
            homeText('decision_system', 'decisionSystemEyebrow')
          )}
        </p>
        <h2
          id="home-decision-system-heading"
          className="heading-2 heading-2-home max-w-4xl"
        >
          {homeCms(
            'decision_system',
            'decisionSystemTitle',
            homeText('decision_system', 'decisionSystemTitle')
          )}
        </h2>
        <p className="mt-4 max-w-3xl text-foreground/80">
          {homeCms(
            'decision_system',
            'decisionSystemLead',
            homeText('decision_system', 'decisionSystemLead')
          )}
        </p>

        <ol className="mt-8 grid list-none gap-4 md:grid-cols-3">
          {decisionSystemItems.map(
            ({ titleKey, descriptionKey, links }, index) => (
              <li
                key={titleKey}
                className="card card-passive flex h-full flex-col gap-4 p-5"
              >
                <p className="eyebrow-blue-sm">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <div>
                  <h3 className="heading-3 text-foreground">
                    {homeCms(
                      'decision_system',
                      titleKey,
                      homeText('decision_system', titleKey)
                    )}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                    {homeCms(
                      'decision_system',
                      descriptionKey,
                      homeText('decision_system', descriptionKey)
                    )}
                  </p>
                </div>
                <div className="mt-auto flex flex-wrap gap-2">
                  {links.map(({ href, labelKey }) => (
                    <Link
                      key={href}
                      href={href}
                      className="btn-pill btn-pill-sm"
                    >
                      {homeCms(
                        'decision_system',
                        labelKey,
                        homeText('decision_system', labelKey)
                      )}
                    </Link>
                  ))}
                </div>
              </li>
            )
          )}
        </ol>
      </Section>

      <Section id="user-paths" aria-labelledby="home-user-paths-heading">
        <p className="eyebrow-blue mb-3">
          {homeCms(
            'entry_paths',
            'entryPathsEyebrow',
            homeText('entry_paths', 'entryPathsEyebrow')
          )}
        </p>
        <h2
          id="home-user-paths-heading"
          className="heading-2 heading-2-home max-w-4xl"
        >
          {homeCms(
            'entry_paths',
            'entryPathsTitle',
            homeText('entry_paths', 'entryPathsTitle')
          )}
        </h2>
        <p className="mt-4 max-w-3xl text-foreground/80">
          {homeCms(
            'entry_paths',
            'entryPathsLead',
            homeText('entry_paths', 'entryPathsLead')
          )}
        </p>

        <ul className="mt-8 grid list-none gap-4 md:grid-cols-2 xl:grid-cols-4">
          {userPathItems.map(({ href, titleKey, descriptionKey, ctaKey }) => (
            <li key={href} className="h-full min-h-0">
              <Link
                href={href}
                className="card card-interactive flex h-full min-h-0 flex-col gap-4 p-5"
              >
                <h3 className="heading-3 text-foreground">
                  {homeCms(
                    'entry_paths',
                    titleKey,
                    homeText('entry_paths', titleKey)
                  )}
                </h3>
                <p className="text-sm leading-relaxed text-foreground/80">
                  {homeCms(
                    'entry_paths',
                    descriptionKey,
                    homeText('entry_paths', descriptionKey)
                  )}
                </p>
                <span className="link-accent mt-auto text-sm">
                  {homeCms(
                    'entry_paths',
                    ctaKey,
                    homeText('entry_paths', ctaKey)
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="proof"
        variant="surface"
        aria-labelledby="home-proof-heading"
      >
        <h2 id="home-proof-heading" className="sr-only">
          {homeCms('proof', 'proofTitle', homeText('proof', 'proofTitle'))}
        </h2>
        <ul className="grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {proofItems.map((key) => (
            <li key={key} className="card-stat card-passive">
              {homeCms('proof', key, homeText('proof', key))}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="contact" aria-labelledby="home-contact-heading">
        <div className="card-cta">
          <h2 id="home-contact-heading" className="heading-3 text-foreground">
            {homeCms(
              'contact_cta',
              'contactCtaTitle',
              homeText('contact_cta', 'contactCtaTitle')
            )}
          </h2>
          <p className="mt-3 max-w-3xl text-foreground/80">
            {homeCms(
              'contact_cta',
              'contactCtaText',
              homeText('contact_cta', 'contactCtaText')
            )}
          </p>
          <Link href="/contact" className="btn-primary mt-6">
            {homeCms(
              'contact_cta',
              'contactCta',
              homeText('contact_cta', 'contactCta')
            )}
          </Link>
        </div>
      </Section>
    </>
  );
}
