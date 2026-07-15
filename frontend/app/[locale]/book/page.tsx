import Image from 'next/image';
import { BookSpreadPreview } from '@/components/BookSpreadPreview';
import { Section } from '@/components/Section';
import { Link } from '@/i18n/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getBook, getContact } from '@/lib/api';
import { getCmsPage } from '@/lib/cms-content';
import { createPageMetadata } from '@/lib/metadata';

const localizedBookCovers = {
  en: '/images/book/welding_en.jpg',
  ru: '/images/book/MIG_MAG_welding_ru.jpg',
  lv: '/images/book/MIG_MAG_metinasana.jpg',
} as const;

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

  const [book, contact] = await Promise.all([
    getBook(lang).catch(() => null),
    getContact().catch(() => null),
  ]);

  const content = await getCmsPage('book', locale);
  const bookText = (section: string, key: string) =>
    content[section]?.[key] || '';
  const bookUiText = (section: string, key: string) =>
    content[section]?.[key] || '';

  const title = book?.title ?? '';
  const description = book?.description || '';
  const year = book?.year ?? '';
  const coverImage = localizedBookCovers[lang];
  const purchaseUrl = process.env.NEXT_PUBLIC_BOOK_PURCHASE_URL?.trim();
  const downloadUrl = process.env.NEXT_PUBLIC_BOOK_DOWNLOAD_URL?.trim();
  const mailtoBook =
    contact?.email != null
      ? `mailto:${contact.email}?subject=${encodeURIComponent(
          bookUiText('cta', 'emailSubjectBook')
        )}`
      : null;

  return (
    <Section container="narrow" bordered={false} scrollMargin={false}>
      <h1 className="heading-1 mb-8 text-accent-orange">{title}</h1>

      <div className="flex flex-col gap-12 md:flex-row md:items-start md:gap-16">
        {/* Обложка */}
        <div className="shrink-0">
          <div className="relative aspect-[2/3] w-56 overflow-hidden rounded-lg border border-border shadow-xl">
            <Image
              src={coverImage}
              alt={bookUiText('cover', 'coverAlt')}
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
              {bookText('hero', 'subtitle')}
            </p>
            <p className="mt-1 text-sm text-foreground/60">{year}</p>
          </div>

          <div
            className="lead [&_p]:mt-2 [&_p:first-child]:mt-0"
            dangerouslySetInnerHTML={{ __html: description }}
          />

          <div className="grid gap-10 border-t border-border pt-8 lg:grid-cols-2 lg:items-start lg:gap-12">
            <BookSpreadPreview
              title={bookUiText('preview', 'previewTitle')}
              caption={bookUiText('preview', 'previewCaption')}
            />
            <figure className="card border-l-4 border-l-accent-orange p-6">
              <h2 className="heading-3 mb-3 text-foreground">
                {bookText('authority', 'authorityTitle')}
              </h2>
              <blockquote>
                <p className="leading-relaxed text-foreground/80">
                  {bookText('authority', 'authorityQuote')}
                </p>
                <footer className="caption mt-4">
                  {bookText('authority', 'authorityAttribution')}
                </footer>
              </blockquote>
            </figure>
          </div>

          <div className="space-y-4 border-t border-border pt-6">
            <h2 className="heading-3 text-foreground">
              {bookText('purchase', 'purchaseTitle')}
            </h2>
            <p className="text-sm text-foreground/80">
              {bookText('purchase', 'purchaseIntro')}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/contact" className="btn-primary">
                {bookText('cta', 'cta')}
              </Link>
              {mailtoBook && (
                <a href={mailtoBook} className="btn-secondary">
                  {bookText('cta', 'ctaEmail')}
                </a>
              )}
              {purchaseUrl && (
                <a
                  href={purchaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  {bookText('cta', 'buyOnline')}
                </a>
              )}
              {downloadUrl && (
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  {bookText('cta', 'downloadSample')}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
