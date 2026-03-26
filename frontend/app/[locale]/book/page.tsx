import Image from 'next/image';
import { BookSpreadPreview } from '@/components/BookSpreadPreview';
import { Link } from '@/i18n/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { getBook, getContact } from '@/lib/api';
import { createPageMetadata } from '@/lib/metadata';

/** Локальная заглушка, если в API нет обложки (файл из `public/`) */
const defaultCover = '/images/photos/author01.jpg';

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

  const [t, book, contact] = await Promise.all([
    getTranslations('book'),
    getBook(lang).catch(() => null),
    getContact().catch(() => null),
  ]);

  const title = book?.title ?? t('title');
  const description = book?.description || t('description');
  const year = book?.year ?? 2024;
  const coverImage = book?.cover_image ?? defaultCover;
  const purchaseUrl = process.env.NEXT_PUBLIC_BOOK_PURCHASE_URL?.trim();
  const downloadUrl = process.env.NEXT_PUBLIC_BOOK_DOWNLOAD_URL?.trim();
  const mailtoBook =
    contact?.email != null
      ? `mailto:${contact.email}?subject=${encodeURIComponent(t('emailSubjectBook'))}`
      : null;

  return (
    <div className="container-narrow section">
      <h1 className="heading-1 mb-12 text-accent-orange">{title}</h1>

      <div className="flex flex-col gap-12 md:flex-row md:items-start md:gap-16">
        {/* Обложка */}
        <div className="shrink-0">
          <div className="relative aspect-[2/3] w-56 overflow-hidden rounded-lg border border-border shadow-xl">
            <Image
              src={coverImage}
              alt={t('coverAlt')}
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
            <p className="text-lg font-medium text-accent-orange">
              {t('subtitle')}
            </p>
            <p className="mt-1 text-sm text-foreground/70">{year}</p>
          </div>

          <div
            className="text-foreground/90 [&_p]:mt-2 [&_p:first-child]:mt-0 [&_p]:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: description }}
          />

          <div className="grid gap-10 border-t border-border pt-8 lg:grid-cols-2 lg:items-start lg:gap-12">
            <BookSpreadPreview
              title={t('previewTitle')}
              caption={t('previewCaption')}
            />
            <figure className="card border-l-4 border-l-accent-orange p-6">
              <h2 className="heading-3 mb-3 text-foreground">
                {t('authorityTitle')}
              </h2>
              <blockquote>
                <p className="text-foreground/90 leading-relaxed">
                  {t('authorityQuote')}
                </p>
                <footer className="mt-4 text-sm text-foreground/65">
                  {t('authorityAttribution')}
                </footer>
              </blockquote>
            </figure>
          </div>

          <div className="space-y-4 border-t border-border pt-6">
            <h2 className="heading-3 text-foreground">{t('purchaseTitle')}</h2>
            <p className="text-sm text-foreground/80">{t('purchaseIntro')}</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/contact"
                className="btn-primary inline-block px-6 py-3"
              >
                {t('cta')}
              </Link>
              {mailtoBook && (
                <a
                  href={mailtoBook}
                  className="btn-secondary inline-block px-6 py-3 text-center"
                >
                  {t('ctaEmail')}
                </a>
              )}
              {purchaseUrl && (
                <a
                  href={purchaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary inline-block px-6 py-3 text-center"
                >
                  {t('buyOnline')}
                </a>
              )}
              {downloadUrl && (
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary inline-block px-6 py-3 text-center"
                >
                  {t('downloadSample')}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
