import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { getAbout } from '@/lib/api';
import type { Lang } from '@/lib/api-types';
import { createPageMetadata } from '@/lib/metadata';

const diplomas = [
  { file: 'Bakalaura_diploms01.pdf', labelKey: 'bachelor' },
  { file: 'RTU_magistra_diploms.pdf', labelKey: 'master' },
  { file: 'MMA_MAG_diploms.pdf', labelKey: 'mma_mag' },
  { file: 'TIG_diploms.pdf', labelKey: 'tig' },
] as const;

const fallbackBio =
  'Welding engineer with extensive experience in MIG/MAG, TIG, and MMA processes. Author of the book "MAG/MIG welding". Expert in shielding gases and welding equipment.';
const fallbackEducation =
  'Bachelor and Master degrees from RTU (Riga Technical University).';
const fallbackQualifications =
  'Certified in MMA/MAG and TIG welding. Welding instructor qualification.';

const defaultPhoto = '/images/photos/DSC_0222_optimized.jpg';

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

  const [t, about] = await Promise.all([
    getTranslations('about'),
    getAbout(lang).catch(() => null),
  ]);

  const photo = about?.photo ?? defaultPhoto;
  const bio = about?.bio ?? fallbackBio;
  const education = about?.education ?? fallbackEducation;
  const qualifications = about?.qualifications ?? fallbackQualifications;

  return (
    <div className="container-narrow section">
      <h1 className="heading-1 mb-12 text-accent-orange">{t('title')}</h1>

      <div className="grid items-start gap-12 md:grid-cols-2">
        {/* Фотография */}
        <div className="w-full overflow-hidden rounded-lg border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo}
            alt={t('photoAlt')}
            className="block w-full h-auto"
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
        </div>
      </div>

      {/* Дипломы и сертификаты */}
      <section className="mt-16">
        <h2 className="heading-2 mb-6 text-foreground">{t('diplomas')}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {diplomas.map(({ file, labelKey }) => (
            <a
              key={file}
              href={`/diplomas/${file}`}
              target="_blank"
              rel="noopener noreferrer"
              className="card flex flex-col items-center gap-2 p-4"
            >
              <svg
                className="h-12 w-12 text-accent-orange"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
              </svg>
              <span className="text-center text-sm text-foreground">
                {t(labelKey)}
              </span>
            </a>
          ))}
        </div>
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
