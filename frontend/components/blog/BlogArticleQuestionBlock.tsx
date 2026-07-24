'use client';

import { type FormEvent, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { CalculatorField } from '@/components/calculators/CalculatorField';
import {
  getLeadTrackingFields,
  LEAD_HONEYPOT_FIELD,
} from '@/components/blog/lead-form-utils';
import { ApiError, submitArticleQuestion } from '@/lib/api';
import type { Lang } from '@/lib/api-types';

export type BlogArticleQuestionLabels = {
  title: string;
  nameLabel: string;
  emailLabel: string;
  questionLabel: string;
  subscribeLabel: string;
  submit: string;
  success: string;
  privacyNote: string;
  privacyLinkLabel?: string;
};

type Props = {
  locale: string;
  articleSlug: string;
  articleTitle: string;
  labels: BlogArticleQuestionLabels;
};

export function BlogArticleQuestionBlock({
  locale,
  articleSlug,
  articleTitle,
  labels,
}: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState('');
  const [subscribe, setSubscribe] = useState(false);
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
      const response = await submitArticleQuestion({
        name: name.trim(),
        email: email.trim(),
        question: question.trim(),
        locale: locale as Lang,
        article_slug: articleSlug,
        article_title: articleTitle,
        subscribe_opt_in: subscribe,
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

  return (
    <section
      className="card card-passive mt-8 p-6"
      aria-labelledby="blog-article-question-heading"
    >
      <h2
        id="blog-article-question-heading"
        className="heading-3 text-foreground"
      >
        {labels.title}
      </h2>

      {submitted ? (
        <p className="mt-6 text-sm text-foreground/80" role="status">
          {successMessage}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <CalculatorField label={labels.nameLabel}>
            {({ inputId, hintId }) => (
              <input
                id={inputId}
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-industrial w-full"
                autoComplete="name"
                aria-describedby={hintId}
                disabled={submitting}
              />
            )}
          </CalculatorField>

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

          <CalculatorField label={labels.questionLabel}>
            {({ inputId, hintId }) => (
              <textarea
                id={inputId}
                name="question"
                required
                rows={4}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="input-industrial w-full resize-y"
                aria-describedby={hintId}
                disabled={submitting}
              />
            )}
          </CalculatorField>

          {labels.subscribeLabel && (
            <label className="flex cursor-pointer items-start gap-3 text-sm text-foreground">
              <input
                type="checkbox"
                name="subscribe"
                checked={subscribe}
                onChange={(e) => setSubscribe(e.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 rounded border border-border accent-[var(--accent-orange)]"
                disabled={submitting}
              />
              <span>{labels.subscribeLabel}</span>
            </label>
          )}

          <div className="sr-only" aria-hidden="true">
            <label htmlFor="question-website">Website</label>
            <input
              id="question-website"
              name={LEAD_HONEYPOT_FIELD}
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          {labels.privacyNote && (
            <p className="caption">
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
            className="btn-primary w-full sm:w-auto"
            disabled={submitting}
          >
            {submitting ? '…' : labels.submit}
          </button>
        </form>
      )}
    </section>
  );
}
