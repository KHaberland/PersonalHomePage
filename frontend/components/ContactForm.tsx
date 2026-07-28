'use client';

import { type FormEvent, type ReactNode, useState } from 'react';
import {
  getLeadTrackingFields,
  LEAD_HONEYPOT_FIELD,
} from '@/components/blog/lead-form-utils';
import { CalculatorField } from '@/components/calculators/CalculatorField';
import { ApiError, submitContactInquiry } from '@/lib/api';
import type { ContactRequestType, Lang } from '@/lib/api-types';

export type ContactFormLabels = {
  formTitle: ReactNode;
  formName: ReactNode;
  formEmail: ReactNode;
  formRequestType: ReactNode;
  formRequestTypePlaceholder: ReactNode;
  requestTypeDefects: ReactNode;
  requestTypeProcess: ReactNode;
  requestTypeTraining: ReactNode;
  requestTypeCooperation?: ReactNode;
  requestTypeCommercial?: ReactNode;
  formMessage: ReactNode;
  formHint: ReactNode;
  formSuccess: string;
  requestConsultation: ReactNode;
};

type Props = {
  locale: string;
  labels: ContactFormLabels;
};

export function ContactForm({ locale, labels }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [requestType, setRequestType] = useState<ContactRequestType | ''>('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!requestType) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await submitContactInquiry({
        name: name.trim(),
        email: email.trim(),
        request_type: requestType,
        message: message.trim(),
        locale: locale as Lang,
        ...getLeadTrackingFields(honeypot),
      });
      setSuccessMessage(response.message || labels.formSuccess);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="card space-y-4 p-6">
        <h2 className="heading-3 text-foreground">{labels.formTitle}</h2>
        <p className="text-sm text-foreground/80" role="status">
          {successMessage}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-6 p-6">
      <h2 className="heading-3 text-foreground">{labels.formTitle}</h2>
      <CalculatorField label={labels.formName}>
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
      <CalculatorField label={labels.formEmail}>
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
      <CalculatorField label={labels.formRequestType}>
        {({ inputId, hintId }) => (
          <select
            id={inputId}
            name="requestType"
            required
            value={requestType}
            onChange={(e) =>
              setRequestType(e.target.value as ContactRequestType | '')
            }
            className="input-industrial w-full"
            aria-describedby={hintId}
            disabled={submitting}
          >
            <option value="">{labels.formRequestTypePlaceholder}</option>
            <option value="defects">{labels.requestTypeDefects}</option>
            <option value="process">{labels.requestTypeProcess}</option>
            <option value="training">{labels.requestTypeTraining}</option>
            {labels.requestTypeCooperation && (
              <option value="cooperation">
                {labels.requestTypeCooperation}
              </option>
            )}
            {labels.requestTypeCommercial && (
              <option value="commercial">{labels.requestTypeCommercial}</option>
            )}
          </select>
        )}
      </CalculatorField>
      <CalculatorField label={labels.formMessage}>
        {({ inputId, hintId }) => (
          <textarea
            id={inputId}
            name="message"
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="input-industrial w-full resize-y"
            aria-describedby={hintId}
            disabled={submitting}
          />
        )}
      </CalculatorField>

      <div className="sr-only" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name={LEAD_HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {labels.formHint && <p className="caption">{labels.formHint}</p>}

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
        {submitting ? '…' : labels.requestConsultation}
      </button>
    </form>
  );
}
