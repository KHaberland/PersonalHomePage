import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { DiplomaCertificates } from '@/components/DiplomaCertificates';
import { getAbout } from '@/lib/api';
import type { Lang } from '@/lib/api-types';
import { createPageMetadata } from '@/lib/metadata';

/** PDF в `public/diplomas/`. Опционально `preview`: миниатюра в `public/diplomas/previews/`. */
const diplomas: ReadonlyArray<{
  file: string;
  labelKey: 'bachelor' | 'master' | 'mma_mag' | 'tig';
  summaryKey:
    | 'bachelorSummary'
    | 'masterSummary'
    | 'mma_magSummary'
    | 'tigSummary';
  preview?: string;
}> = [
  {
    file: 'Bakalaura_diploms01.pdf',
    labelKey: 'bachelor',
    summaryKey: 'bachelorSummary',
  },
  {
    file: 'RTU_magistra_diploms.pdf',
    labelKey: 'master',
    summaryKey: 'masterSummary',
  },
  {
    file: 'MMA_MAG_diploms.pdf',
    labelKey: 'mma_mag',
    summaryKey: 'mma_magSummary',
  },
  { file: 'TIG_diploms.pdf', labelKey: 'tig', summaryKey: 'tigSummary' },
];

const defaultPhoto = '/images/photos/small/Author_small.jpg';

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
    titleKey: 'aboutTitle',
    descriptionKey: 'aboutDescription',
    path: '/about',
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = langFromLocale(locale);

  const [t, tHome, about] = await Promise.all([
    getTranslations('about'),
    getTranslations('home'),
    getAbout(lang).catch(() => null),
  ]);

  const photo = about?.photo ?? defaultPhoto;
  const bio = about?.bio ?? t.raw('fallbackBio');
  const education = about?.education ?? t.raw('fallbackEducation');
  const qualifications =
    about?.qualifications ?? t.raw('fallbackQualifications');

  const diplomaItems = diplomas.map((d) => {
    const title = t(d.labelKey);
    return {
      id: d.file,
      pdfUrl: `/diplomas/${d.file}`,
      fileName: d.file,
      title,
      summary: t(d.summaryKey),
      previewAlt: t('diplomaPreviewAlt', { title }),
      previewSrc: d.preview,
    };
  });

  const diplomaLabels = {
    openInModal: t('diplomaOpenInModal'),
    download: t('diplomaDownload'),
    openNewTab: t('diplomaOpenNewTab'),
    closeModal: t('diplomaCloseModal'),
    pdfViewerTitle: t('diplomaPdfViewerTitle'),
  };

  return (
    <div className="container-narrow section">
      <h1 className="heading-1 mb-6 text-accent-orange">{t('title')}</h1>

      <section
        className="mb-12 rounded-xl border border-border/80 bg-surface/50 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:p-8"
        aria-labelledby="about-why-heading"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-foreground/55">
          {t('whyChooseSectionLabel')}
        </p>
        <h2
          id="about-why-heading"
          className="heading-3 mt-2 text-accent-orange"
        >
          {tHome('whyChooseTitle')}
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-foreground/90 marker:text-accent-orange md:pl-6">
          <li>{tHome('whyChoose1')}</li>
          <li>{tHome('whyChoose2')}</li>
          <li>{tHome('whyChoose3')}</li>
          <li>{tHome('whyChoose4')}</li>
        </ul>
      </section>

      <div className="grid items-start gap-12 md:grid-cols-2">
        {/* Фотография */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg border border-border">
          <Image
            src={photo}
            alt={t('photoAlt')}
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            unoptimized={photo.startsWith('http')}
          />
        </div>

        <div className="space-y-6">
          {/* Биография */}
          <section>
            <h2 className="heading-3 mb-3 text-foreground">{t('bio')}</h2>
            <div
              className="about-content text-foreground/80 [&_p]:mt-2 [&_p]:leading-relaxed [&_p:first-child]:mt-0"
              dangerouslySetInnerHTML={{ __html: bio }}
            />
          </section>

          {/* Образование */}
          <section>
            <h2 className="heading-3 mb-3 text-foreground">{t('education')}</h2>
            <div
              className="about-content text-foreground/80 [&_p]:mt-2 [&_p]:leading-relaxed [&_p:first-child]:mt-0"
              dangerouslySetInnerHTML={{ __html: education }}
            />
          </section>

          {/* Профессиональные квалификации */}
          <section>
            <h2 className="heading-3 mb-3 text-foreground">
              {t('qualifications')}
            </h2>
            <div
              className="about-content text-foreground/80 [&_p]:mt-2 [&_p]:leading-relaxed [&_p:first-child]:mt-0"
              dangerouslySetInnerHTML={{ __html: qualifications }}
            />
          </section>

          <section>
            <h2 className="heading-3 mb-3 text-foreground">
              {t('achievements')}
            </h2>
            <ul className="list-disc space-y-2 pl-5 text-foreground/80 [&_li]:leading-relaxed">
              <li>{t('achievement1')}</li>
              <li>{t('achievement2')}</li>
              <li>{t('achievement3')}</li>
              <li>{t('achievement4')}</li>
            </ul>
          </section>
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
          'IMG20230830105750.jpg',
          'IMG20240828143738.jpg',
          'IMG20250404114114.jpg',
          'IMG20250518152029.jpg',
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
