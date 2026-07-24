'use client';

import { type FormEvent, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { CalculatorField } from '@/components/calculators/CalculatorField';
import {
  getLeadTrackingFields,
  LEAD_HONEYPOT_FIELD,
} from '@/components/blog/lead-form-utils';
import { ApiError, subscribeToNewsletter } from '@/lib/api';
import type { Lang } from '@/lib/api-types';

export type BlogNewsletterLabels = {
  title: string;
  lead: string;
  emailLabel: string;
  nameLabel: string;
  submit: string;
  success: string;
  privacyNote: string;
  privacyLinkLabel?: string;
};

type Props = {
  locale: string;
  articleSlug: string;
  articleTitle: string;
  labels: BlogNewsletterLabels;
  variant?: 'default' | 'compact';
};

export function BlogNewsletterBlock({
  locale,
  articleSlug,
  articleTitle,
  labels,
  variant = 'default',
}: Props) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await subscribeToNewsletter({
        email: email.trim(),
        name: name.trim() || undefined,
        locale: locale as Lang,
        article_slug: articleSlug,
        article_title: articleTitle,
        ...getLeadTrackingFields(honeypot),
      });
      setSuccessMessage(response.message || labels.success);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error');
    } finally {
      setSubmitting(false);
    }
  }

  const isCompact = variant === 'compact';

  return (
    <section
      className={
        isCompact
          ? 'card mt-12 border border-border p-6'
          : 'card-cta mt-12 border-t border-border pt-8'
      }
      aria-labelledby="blog-newsletter-heading"
    >
      <h2
        id="blog-newsletter-heading"
        className={
          isCompact ? 'heading-3 text-foreground' : 'heading-3 text-foreground'
        }
      >
        {labels.title}
      </h2>
      {!isCompact && labels.lead && (
        <p className="mt-3 max-w-3xl text-sm text-foreground/80">
          {labels.lead}
        </p>
      )}

      {submitted ? (
        <p className="mt-6 text-sm text-foreground/80" role="status">
          {successMessage}
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className={
            isCompact
              ? 'mt-4 flex flex-col gap-3 sm:flex-row sm:items-end'
              : 'mt-6 space-y-4'
          }
        >
          <div className={isCompact ? 'flex-1' : undefined}>
            <CalculatorField label={labels.emailLabel}>
              {({ inputId, hintId }) => (
                <input
                  id={inputId}
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-industrial w-full"
                  autoComplete="email"
                  aria-describedby={hintId}
                  disabled={submitting}
                />
              )}
            </CalculatorField>
          </div>

          {!isCompact && labels.nameLabel && (
            <CalculatorField label={labels.nameLabel}>
              {({ inputId, hintId }) => (
                <input
                  id={inputId}
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-industrial w-full"
                  autoComplete="name"
                  aria-describedby={hintId}
                  disabled={submitting}
                />
              )}
            </CalculatorField>
          )}

          <div className="sr-only" aria-hidden="true">
            <label htmlFor="newsletter-website">Website</label>
            <input
              id="newsletter-website"
              name={LEAD_HONEYPOT_FIELD}
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          {labels.privacyNote && (
            <p className={`caption ${isCompact ? 'sm:basis-full' : ''}`}>
              {labels.privacyNote}
              {labels.privacyLinkLabel && (
                <>
                  {' '}
                  <Link href="/privacy" className="link-accent hover:underline">
                    {labels.privacyLinkLabel}
                  </Link>
                </>
              )}
            </p>
          )}

          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className={`btn-primary ${isCompact ? 'sm:shrink-0' : 'w-full sm:w-auto'}`}
            disabled={submitting}
          >
            {submitting ? '…' : labels.submit}
          </button>
        </form>
      )}
    </section>
  );
}
