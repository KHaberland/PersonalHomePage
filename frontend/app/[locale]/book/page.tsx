import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { getBook } from '@/lib/api';
import { createPageMetadata } from '@/lib/metadata';

const defaultCover = '/images/photos/DSC_0222_optimized.jpg';

type Props = {
  params: Promise<{ locale: string }>;
};

function langFromLocale(locale: string): 'en' | 'ru' | 'lv' {
  return locale === 'en' || locale === 'ru' || locale === 'lv' ? locale : 'en';
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return createPageMetadata({
    locale,
    titleKey: 'bookTitle',
    descriptionKey: 'bookDescription',
    path: '/book',
  });
}

export default async function BookPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = langFromLocale(locale);

  const [t, book] = await Promise.all([
    getTranslations('book'),
    getBook(lang).catch(() => null),
  ]);

  const title = book?.title ?? t('title');
  const description = book?.description || t('description');
  const year = book?.year ?? 2024;
  const coverImage = book?.cover_image ?? defaultCover;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-12 text-3xl font-bold text-[#f97316]">{t('title')}</h1>

      <div className="flex flex-col gap-12 md:flex-row md:items-start md:gap-16">
        {/* Обложка */}
        <div className="shrink-0">
          <div className="relative aspect-[2/3] w-56 overflow-hidden rounded-lg border border-[#30363d] shadow-xl">
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover"
              sizes="224px"
              unoptimized={coverImage.startsWith('http')}
            />
          </div>
        </div>

        {/* Описание и CTA */}
        <div className="flex-1 space-y-6">
          <div>
            <p className="text-lg font-medium text-[#f97316]">
              {t('subtitle')}
            </p>
            <p className="mt-1 text-sm text-[#e6edf3]/70">{year}</p>
          </div>

          <p className="whitespace-pre-line text-[#e6edf3]/90">{description}</p>

          <Link
            href="/contact"
            className="inline-block rounded bg-[#f97316] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#ea580c]"
          >
            {t('cta')}
          </Link>
        </div>
      </div>
    </div>
  );
}
