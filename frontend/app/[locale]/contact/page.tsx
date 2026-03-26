import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { ContactForm } from '@/components/ContactForm';
import { getContact } from '@/lib/api';
import { createPageMetadata } from '@/lib/metadata';

const DEFAULT_MAP_EMBED =
  'https://www.openstreetmap.org/export/embed.html?bbox=23.95%2C56.82%2C24.35%2C57.05&layer=mapnik&marker=24.1052%2C56.9496';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return createPageMetadata({
    locale,
    titleKey: 'contactTitle',
    descriptionKey: 'contactDescription',
    path: '/contact',
  });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, contact] = await Promise.all([
    getTranslations('contact'),
    getContact().catch(() => null),
  ]);

  const mapSrc =
    process.env.NEXT_PUBLIC_MAP_EMBED_URL?.trim() || DEFAULT_MAP_EMBED;

  return (
    <div className="container-narrow section">
      <h1 className="heading-1 mb-12 text-accent-orange">{t('title')}</h1>

      <p className="mb-12 max-w-2xl text-foreground/90">{t('description')}</p>

      {contact?.email && (
        <div className="mb-12">
          <ContactForm contactEmail={contact.email} />
        </div>
      )}

      <div className="flex flex-col gap-6">
        {contact?.email && (
          <a
            href={`mailto:${contact.email}`}
            className="card flex items-center gap-4 p-6 transition-colors hover:border-accent-orange"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent-orange/20 text-accent-orange">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </span>
            <div>
              <p className="font-medium text-foreground">{t('email')}</p>
              <p className="text-accent-orange">{contact.email}</p>
            </div>
          </a>
        )}

        {contact?.linkedin_url && (
          <a
            href={contact.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="card flex items-center gap-4 p-6 transition-colors hover:border-accent-orange"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent-orange/20 text-accent-orange">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H4.5v8.37h3.77z" />
              </svg>
            </span>
            <div>
              <p className="font-medium text-foreground">LinkedIn</p>
              <p className="text-sm text-foreground/70">{t('linkedin')}</p>
            </div>
          </a>
        )}

        {contact?.youtube_url && (
          <a
            href={contact.youtube_url}
            target="_blank"
            rel="noopener noreferrer"
            className="card flex items-center gap-4 p-6 transition-colors hover:border-accent-orange"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent-orange/20 text-accent-orange">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 15l5.19-3L10 9v6m11-7H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2z" />
              </svg>
            </span>
            <div>
              <p className="font-medium text-foreground">YouTube</p>
              <p className="text-sm text-foreground/70">{t('youtube')}</p>
            </div>
          </a>
        )}
      </div>

      {!contact && <p className="mt-8 text-foreground/70">{t('noContact')}</p>}

      <section className="mt-16" aria-labelledby="contact-map-heading">
        <h2 id="contact-map-heading" className="heading-2 mb-2 text-foreground">
          {t('mapTitle')}
        </h2>
        <p className="mb-4 max-w-2xl text-sm text-foreground/70">
          {t('mapDescription')}
        </p>
        <div className="overflow-hidden rounded-lg border border-border">
          <iframe
            title={t('mapTitle')}
            src={mapSrc}
            className="aspect-[16/9] h-[min(22rem,50vh)] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
}
