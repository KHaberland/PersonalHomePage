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
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-12 text-3xl font-bold text-[#f97316]">{t('title')}</h1>

      <div className="grid gap-12 md:grid-cols-2">
        {/* Фотография */}
        <div className="relative aspect-square overflow-hidden rounded-lg border border-[#30363d]">
          <Image
            src={photo}
            alt={t('photoAlt')}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized={photo.startsWith('http')}
          />
        </div>

        <div className="space-y-6">
          {/* Биография */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#e6edf3]">
              {t('bio')}
            </h2>
            <p className="text-[#e6edf3]/80 whitespace-pre-line">{bio}</p>
          </section>

          {/* Образование */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#e6edf3]">
              {t('education')}
            </h2>
            <p className="text-[#e6edf3]/80 whitespace-pre-line">{education}</p>
          </section>

          {/* Профессиональные квалификации */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#e6edf3]">
              {t('qualifications')}
            </h2>
            <p className="text-[#e6edf3]/80 whitespace-pre-line">
              {qualifications}
            </p>
          </section>
        </div>
      </div>

      {/* Дипломы и сертификаты */}
      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-semibold text-[#e6edf3]">
          {t('diplomas')}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {diplomas.map(({ file, labelKey }) => (
            <a
              key={file}
              href={`/diplomas/${file}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 rounded-lg border border-[#30363d] bg-[#161b22] p-4 transition-colors hover:border-[#f97316] hover:bg-[#161b22]/80"
            >
              <svg
                className="h-12 w-12 text-[#f97316]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
              </svg>
              <span className="text-center text-sm text-[#e6edf3]">
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
            className="relative aspect-square overflow-hidden rounded-lg border border-[#30363d]"
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
