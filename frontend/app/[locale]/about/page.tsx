import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { DiplomaCertificates } from '@/components/DiplomaCertificates';
import { Section } from '@/components/Section';
import { getAbout, getContact } from '@/lib/api';
import type { Lang } from '@/lib/api-types';
import { getCmsPage } from '@/lib/cms-content';
import { createPageMetadata } from '@/lib/metadata';
import { sanitizeAboutHtml } from '@/lib/sanitize-html';
import { createAboutJsonLd } from '@/lib/seo';

/** PDF в `public/diplomas/` или снимок в `public/images/photos/small/`. Для фото `preview` по умолчанию совпадает с документом. */
const diplomas: ReadonlyArray<{
  file: string;
  mediaFolder?: 'diplomas' | 'images/photos/small';
  labelKey: 'bachelor' | 'master' | 'iwe' | 'mma_mag' | 'tig';
  summaryKey:
    | 'bachelorSummary'
    | 'masterSummary'
    | 'iweSummary'
    | 'mma_magSummary'
    | 'tigSummary';
  preview?: string;
}> = [
  {
    file: 'IMG_bakalv_165628.jpg',
    mediaFolder: 'images/photos/small',
    labelKey: 'bachelor',
    summaryKey: 'bachelorSummary',
  },
  {
    file: 'magist1.jpg',
    mediaFolder: 'images/photos/small',
    labelKey: 'master',
    summaryKey: 'masterSummary',
  },
  {
    file: 'IWE_diploma.jpg',
    mediaFolder: 'images/photos/small',
    labelKey: 'iwe',
    summaryKey: 'iweSummary',
  },
  {
    file: 'MMA_dipl.jpg',
    mediaFolder: 'images/photos/small',
    labelKey: 'mma_mag',
    summaryKey: 'mma_magSummary',
  },
  {
    file: 'BUTS1_dipl.jpg',
    mediaFolder: 'images/photos/small',
    labelKey: 'tig',
    summaryKey: 'tigSummary',
  },
];

const defaultPhoto = '/images/photos/small/author01_small.jpg';
const defaultLinkedinUrl =
  'https://www.linkedin.com/in/oleg-suvorov-125639216/';

type Props = {
  params: Promise<{ locale: string }>;
};

function langFromLocale(locale: string): Lang {
  return locale === 'en' || locale === 'ru' || locale === 'lv'
    ? (locale as Lang)
    : 'en';
}

function htmlHasVisibleText(html: string): boolean {
  return (
    html
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .trim().length > 0
  );
}

function formatTemplate(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '');
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return createPageMetadata({
    locale,
    titleKey: 'aboutTitle',
    descriptionKey: 'aboutDescription',
    path: '/about',
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = langFromLocale(locale);

  const [t, about, contact, content, commonContent] = await Promise.all([
    getTranslations('about'),
    getAbout(lang).catch(() => null),
    getContact().catch(() => null),
    getCmsPage('about', locale),
    getCmsPage('common', locale),
  ]);
  const aboutUiText = (key: string) => content.ui?.[key] || '';
  const profileRecordText = (key: string) =>
    content.profile_record?.[key] || '';
  const personName = commonContent.brand?.name || 'Oleg Suvorov';

  const photo = about?.photo ?? defaultPhoto;
  const bio = sanitizeAboutHtml(about?.bio ?? String(t.raw('fallbackBio')));
  const education = sanitizeAboutHtml(
    about?.education ?? String(t.raw('fallbackEducation'))
  );
  const qualifications = sanitizeAboutHtml(
    about?.qualifications ?? String(t.raw('fallbackQualifications'))
  );

  const diplomaItems = diplomas.map((d) => {
    const title = aboutUiText(d.labelKey);
    const folder = d.mediaFolder ?? 'diplomas';
    const docPath =
      folder === 'diplomas'
        ? `/diplomas/${d.file}`
        : `/images/photos/small/${d.file}`;
    const previewSrc =
      d.preview ?? (folder === 'images/photos/small' ? docPath : undefined);
    return {
      id: d.labelKey,
      pdfUrl: docPath,
      title,
      summary: aboutUiText(d.summaryKey),
      previewAlt: formatTemplate(aboutUiText('diplomaPreviewAlt'), { title }),
      previewSrc,
    };
  });
  const cmsProfileProofs = [
    'profileProofs_1',
    'profileProofs_2',
    'profileProofs_3',
  ]
    .map((key) => content.ui?.[key])
    .filter(Boolean);
  const profileProofs = cmsProfileProofs;
  const cvUrl = process.env.NEXT_PUBLIC_CV_URL?.trim();
  const linkedinUrl = contact?.linkedin_url ?? defaultLinkedinUrl;
  const sameAs = [linkedinUrl, contact?.youtube_url].filter(
    Boolean
  ) as string[];
  const showProfileRecord = Boolean(
    profileRecordText('title') || profileRecordText('footerUpdated')
  );
  const jsonLd = createAboutJsonLd({
    locale,
    description: aboutUiText('profileSummaryLead'),
    image: photo,
    sameAs,
    personName,
  });

  const diplomaLabels = {
    openInModal: aboutUiText('diplomaOpenInModal'),
    openNewTab: aboutUiText('diplomaOpenNewTab'),
    closeModal: aboutUiText('diplomaCloseModal'),
    pdfViewerTitle: aboutUiText('diplomaPdfViewerTitle'),
  };

  return (
    <Section bordered={false} scrollMargin={false}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="heading-1 mb-6 text-accent-orange">
        {aboutUiText('title')}
      </h1>

      <section className="card card-passive card-passive-accent mb-10 grid gap-6 p-6 md:grid-cols-[1.5fr_1fr] md:p-8">
        <div>
          <p className="eyebrow mb-2">{aboutUiText('profileSummaryEyebrow')}</p>
          <h2 className="heading-3 mb-3 text-foreground">
            {aboutUiText('profileSummaryTitle')}
          </h2>
          <p className="lead max-w-3xl">{aboutUiText('profileSummaryLead')}</p>
        </div>

        <div className="space-y-4">
          <ul className="space-y-2 text-sm text-foreground/80">
            {profileProofs.map((proof) => (
              <li key={proof} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-orange" />
                <span>{proof}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            {linkedinUrl ? (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                {aboutUiText('linkedinCta')}
              </a>
            ) : null}
            {cvUrl ? (
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                {aboutUiText('cvCta')}
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <div className="grid w-full items-start gap-8 md:grid-cols-2 md:gap-12">
        {/* Фотография — те же пропорции ширины, что блок «Обо мне» на главной */}
        <div className="about-photo-glow-wrap relative mx-auto aspect-[4/5] w-full max-w-[26.88rem] overflow-hidden rounded-lg border border-border md:mx-0">
          <Image
            src={photo}
            alt={t('photoAlt')}
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 26.88rem"
            priority
            unoptimized={photo.startsWith('http')}
          />
        </div>

        <div className="w-full min-w-0 space-y-6">
          {htmlHasVisibleText(bio) ? (
            <section>
              <div
                className="about-content about-bio-narrative text-foreground/80 [&_p]:mt-2 [&_p]:leading-relaxed [&_p:first-child]:mt-0"
                dangerouslySetInnerHTML={{ __html: bio }}
              />
            </section>
          ) : null}

          {/* Образование */}
          {htmlHasVisibleText(education) ? (
            <section>
              <h2 className="about-block-title heading-3 mb-3 text-foreground">
                {aboutUiText('education')}
              </h2>
              <div
                className="about-content text-foreground/80 [&_p]:mt-2 [&_p]:leading-relaxed [&_p:first-child]:mt-0"
                dangerouslySetInnerHTML={{ __html: education }}
              />
            </section>
          ) : null}

          {/* Профессиональные квалификации */}
          {htmlHasVisibleText(qualifications) ? (
            <section>
              <h2 className="about-block-title heading-3 mb-3 text-foreground">
                {aboutUiText('qualifications')}
              </h2>
              <div
                className="about-content text-foreground/80 [&_p]:mt-2 [&_p]:leading-relaxed [&_p:first-child]:mt-0"
                dangerouslySetInnerHTML={{ __html: qualifications }}
              />
            </section>
          ) : null}
        </div>
      </div>

      {/* Дипломы и сертификаты */}
      <section className="mt-16">
        <h2 className="heading-2 mb-6 text-foreground">
          {aboutUiText('diplomas')}
        </h2>
        <DiplomaCertificates items={diplomaItems} labels={diplomaLabels} />
      </section>

      {/* Фотографии */}
      <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {[
          'small/FB_IMG_gas.jpg',
          'small/IMG_20250714_MAG.jpg',
          'small/mag_weld2.jpg',
          'small/tig_weld.jpg',
        ].map((name) => (
          <div
            key={name}
            className="relative aspect-square overflow-hidden rounded-lg border border-border"
          >
            <Image
              src={`/images/photos/${name}`}
              alt={t('workPhotoAlt')}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, 25vw"
            />
          </div>
        ))}
      </div>

      {showProfileRecord ? (
        <section className="card card-passive card-passive-accent mt-16 p-6 md:p-8">
          {profileRecordText('title') ? (
            <h2 className="heading-3 mb-4 text-foreground">
              {profileRecordText('title')}
            </h2>
          ) : null}

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-foreground/60">
            {profileRecordText('versionLabel') ||
            profileRecordText('version') ? (
              <p>
                <span className="font-semibold text-foreground">
                  {profileRecordText('versionLabel')}
                </span>{' '}
                {profileRecordText('version')}
              </p>
            ) : null}
            {profileRecordText('lastReviewedLabel') ||
            profileRecordText('lastReviewed') ? (
              <p>
                <span className="font-semibold text-foreground">
                  {profileRecordText('lastReviewedLabel')}
                </span>{' '}
                {profileRecordText('lastReviewed')}
              </p>
            ) : null}
          </div>

          {profileRecordText('description') ? (
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-foreground/80">
              {profileRecordText('description')}
            </p>
          ) : null}
          {profileRecordText('footerUpdated') ? (
            <p className="caption mt-5 font-medium uppercase tracking-wide">
              {profileRecordText('footerUpdated')}
            </p>
          ) : null}
        </section>
      ) : null}
    </Section>
  );
}
