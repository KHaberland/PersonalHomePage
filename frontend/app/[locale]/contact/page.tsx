import { setRequestLocale } from 'next-intl/server';
import { ContactForm } from '@/components/ContactForm';
import type { ContactFormLabels } from '@/components/ContactForm';
import { Section } from '@/components/Section';
import { getContact } from '@/lib/api';
import { getCmsPage } from '@/lib/cms-content';
import { cmsText } from '@/lib/cms-page-text';
import { createPageMetadata } from '@/lib/metadata';

const DEFAULT_MAP_EMBED =
  'https://www.openstreetmap.org/export/embed.html?bbox=23.95%2C56.82%2C24.35%2C57.05&layer=mapnik&marker=24.1052%2C56.9496';

const CMS_PAGE = 'contact';

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

  const [content, contact] = await Promise.all([
    getCmsPage('contact', locale),
    getContact().catch(() => null),
  ]);

  const contactText = (section: string, key: string) =>
    content[section]?.[key] || '';
  const contactCms = (block: string, key: string) =>
    cmsText(CMS_PAGE, block, key, contactText(block, key));
  const contactLabel = (block: string, key: string, fallback: string) =>
    cmsText(CMS_PAGE, block, key, contactText(block, key) || fallback);

  const formLabels: ContactFormLabels = {
    formTitle: contactCms('form', 'formTitle'),
    formName: contactCms('form', 'formName'),
    formEmail: contactCms('form', 'formEmail'),
    formRequestType: contactCms('form', 'formRequestType'),
    formRequestTypePlaceholder: contactCms(
      'form',
      'formRequestTypePlaceholder'
    ),
    requestTypeDefects: contactCms('request_types', 'requestTypeDefects'),
    requestTypeProcess: contactCms('request_types', 'requestTypeProcess'),
    requestTypeTraining: contactCms('request_types', 'requestTypeTraining'),
    requestTypeCooperation: contactCms(
      'request_types',
      'requestTypeCooperation'
    ),
    requestTypeCommercial: contactCms('request_types', 'requestTypeCommercial'),
    formMessage: contactCms('form', 'formMessage'),
    formHint: contactCms('form', 'formHint'),
    formSuccess: contactText('form', 'formSuccess'),
    requestConsultation: contactCms('form', 'requestConsultation'),
  };

  const mapSrc =
    process.env.NEXT_PUBLIC_MAP_EMBED_URL?.trim() || DEFAULT_MAP_EMBED;

  return (
    <Section container="narrow" bordered={false} scrollMargin={false}>
      <h1 className="heading-1 mb-4 text-accent-orange">
        {contactCms('hero', 'title')}
      </h1>

      <p className="lead mb-12 max-w-2xl">
        {contactCms('hero', 'description')}
      </p>

      {contactText('form', 'formTitle') && (
        <div className="mb-12">
          <ContactForm locale={locale} labels={formLabels} />
        </div>
      )}

      <div className="flex flex-col gap-6">
        {contact?.email && (
          <a
            href={`mailto:${contact.email}`}
            className="card card-interactive flex items-center gap-4 p-6"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent-orange/20 text-accent-orange">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </span>
            <div>
              <p className="font-medium text-foreground">
                {contactCms('contact_methods', 'email')}
              </p>
              <p className="text-accent-orange">{contact.email}</p>
            </div>
          </a>
        )}

        {contact?.linkedin_url && (
          <a
            href={contact.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="card card-interactive flex items-center gap-4 p-6"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent-orange/20 text-accent-orange">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H4.5v8.37h3.77z" />
              </svg>
            </span>
            <div>
              <p className="font-medium text-foreground">
                {contactLabel(
                  'contact_methods',
                  'linkedinPlatform',
                  'LinkedIn'
                )}
              </p>
              <p className="text-sm text-foreground/80">
                {contactCms('contact_methods', 'linkedin')}
              </p>
            </div>
          </a>
        )}

        {contact?.youtube_url && (
          <a
            href={contact.youtube_url}
            target="_blank"
            rel="noopener noreferrer"
            className="card card-interactive flex items-center gap-4 p-6"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent-orange/20 text-accent-orange">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 15l5.19-3L10 9v6m11-7H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2z" />
              </svg>
            </span>
            <div>
              <p className="font-medium text-foreground">
                {contactLabel('contact_methods', 'youtubePlatform', 'YouTube')}
              </p>
              <p className="text-sm text-foreground/80">
                {contactCms('contact_methods', 'youtube')}
              </p>
            </div>
          </a>
        )}
      </div>

      {!contact && (
        <p className="mt-8 text-foreground/80">
          {contactCms('empty', 'noContact')}
        </p>
      )}

      <section className="mt-16" aria-labelledby="contact-map-heading">
        <h2 id="contact-map-heading" className="heading-2 mb-2 text-foreground">
          {contactCms('map', 'mapTitle')}
        </h2>
        <p className="mb-4 max-w-2xl text-sm text-foreground/80">
          {contactCms('map', 'mapDescription')}
        </p>
        <div className="overflow-hidden rounded-lg border border-border">
          <iframe
            title={contactText('map', 'mapTitle')}
            src={mapSrc}
            className="aspect-[16/9] h-[min(22rem,50vh)] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </Section>
  );
}
