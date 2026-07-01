import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { DiplomaCertificates } from '@/components/DiplomaCertificates';
import { getAbout, getContact } from '@/lib/api';
import type { Lang } from '@/lib/api-types';
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
const defaultLinkedinUrl = 'https://linkedin.com/in/olegsuvorov';

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

  const [t, about, contact] = await Promise.all([
    getTranslations('about'),
    getAbout(lang).catch(() => null),
    getContact().catch(() => null),
  ]);

  const photo = about?.photo ?? defaultPhoto;
  const bio = sanitizeAboutHtml(about?.bio ?? String(t.raw('fallbackBio')));
  const education = sanitizeAboutHtml(
    about?.education ?? String(t.raw('fallbackEducation'))
  );
  const qualifications = sanitizeAboutHtml(
    about?.qualifications ?? String(t.raw('fallbackQualifications'))
  );

  const diplomaItems = diplomas.map((d) => {
    const title = t(d.labelKey);
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
      summary: t(d.summaryKey),
      previewAlt: t('diplomaPreviewAlt', { title }),
      previewSrc,
    };
  });
  const profileProofs = t.raw('profileProofs') as string[];
  const cvUrl = process.env.NEXT_PUBLIC_CV_URL?.trim();
  const linkedinUrl = contact?.linkedin_url ?? defaultLinkedinUrl;
  const sameAs = [linkedinUrl, contact?.youtube_url].filter(
    Boolean
  ) as string[];
  const jsonLd = createAboutJsonLd({
    locale,
    description: t('profileSummaryLead'),
    image: photo,
    sameAs,
  });

  const diplomaLabels = {
    openInModal: t('diplomaOpenInModal'),
    openNewTab: t('diplomaOpenNewTab'),
    closeModal: t('diplomaCloseModal'),
    pdfViewerTitle: t('diplomaPdfViewerTitle'),
  };

  return (
    <div className="container-wide section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="heading-2 mb-6 text-accent-orange">{t('title')}</h1>

      <section className="card mb-10 grid gap-6 p-6 md:grid-cols-[1.5fr_1fr] md:p-8">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-accent-orange">
            {t('profileSummaryEyebrow')}
          </p>
          <h2 className="heading-3 mb-3 text-foreground">
            {t('profileSummaryTitle')}
          </h2>
          <p className="max-w-3xl text-foreground/80">
            {t('profileSummaryLead')}
          </p>
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
                {t('linkedinCta')}
              </a>
            ) : null}
            {cvUrl ? (
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                {t('cvCta')}
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <div className="grid w-full items-start gap-8 md:grid-cols-2 md:gap-12">
        {/* Фотография — те же пропорции ширины, что блок «Обо мне» на главной */}
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[26.88rem] overflow-hidden rounded-lg border border-border md:mx-0">
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
                {t('education')}
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
                {t('qualifications')}
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
        <h2 className="heading-2 mb-6 text-foreground">{t('diplomas')}</h2>
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
    </div>
  );
}
