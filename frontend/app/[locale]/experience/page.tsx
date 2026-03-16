import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { createPageMetadata } from '@/lib/metadata';

const experiences = [
  { key: 'elme', order: 1 },
  { key: 'buts', order: 2 },
  { key: 'production', order: 3 },
] as const;

const experiencePhotos = [
  'DSC_2992.jpg',
  'DSC_3010.jpg',
  'IMG20250618100959.jpg',
];

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return createPageMetadata({
    locale,
    titleKey: 'experienceTitle',
    descriptionKey: 'experienceDescription',
    path: '/experience',
  });
}

export default async function ExperiencePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('experience');

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-12 text-3xl font-bold text-[#f97316]">{t('title')}</h1>

      <div className="relative">
        <div className="absolute left-4 top-0 h-full w-0.5 bg-[#30363d] md:left-1/2 md:-translate-x-px" />

        {experiences.map(({ key }, i) => (
          <div
            key={key}
            className={`relative flex flex-col gap-4 py-8 md:flex-row md:gap-8 ${
              i % 2 === 1 ? 'md:flex-row-reverse' : ''
            }`}
          >
            <div className="relative z-10 ml-8 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f97316] md:ml-0 md:left-1/2 md:-translate-x-1/2">
              <span className="text-sm font-bold text-white">{i + 1}</span>
            </div>

            <div
              className={`ml-14 flex-1 md:ml-0 md:px-8 ${
                i % 2 === 1 ? 'md:text-right' : 'md:pl-16'
              }`}
            >
              <h2 className="text-xl font-semibold text-[#e6edf3]">
                {t(`${key}.role`)}
              </h2>
              <p className="text-[#f97316]">{t(`${key}.company`)}</p>
              <p className="text-sm text-[#e6edf3]/70">{t(`${key}.period`)}</p>
            </div>

            <div className="ml-14 md:ml-0 md:w-1/2" />
          </div>
        ))}
      </div>

      <section className="mt-16">
        <h2 className="mb-6 text-xl font-semibold text-[#e6edf3]">
          {t('photosTitle')}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {experiencePhotos.map((name) => (
            <div
              key={name}
              className="relative aspect-video overflow-hidden rounded-lg border border-[#30363d]"
            >
              <Image
                src={`/images/photos/${name}`}
                alt={t('photosTitle')}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
