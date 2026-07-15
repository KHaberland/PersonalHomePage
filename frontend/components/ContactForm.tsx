'use client';

import { type FormEvent, useState } from 'react';
import { CalculatorField } from '@/components/calculators/CalculatorField';

export type ContactFormLabels = {
  formTitle: string;
  formName: string;
  formEmail: string;
  formRequestType: string;
  formRequestTypePlaceholder: string;
  requestTypeDefects: string;
  requestTypeProcess: string;
  requestTypeTraining: string;
  formMessage: string;
  formHint: string;
  formSubjectPrefix: string;
  formBodyName: string;
  formBodyEmail: string;
  formBodyRequestType: string;
  requestConsultation: string;
};

type Props = {
  contactEmail: string;
  labels: ContactFormLabels;
};

export function ContactForm({ contactEmail, labels }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [requestType, setRequestType] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(labels.formSubjectPrefix);
    const body = encodeURIComponent(
      `${labels.formBodyName}: ${name}\n${labels.formBodyEmail}: ${email}\n${labels.formBodyRequestType}: ${requestType}\n\n${message}`
    );
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
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
            onChange={(e) => setRequestType(e.target.value)}
            className="input-industrial w-full"
            aria-describedby={hintId}
          >
            <option value="">{labels.formRequestTypePlaceholder}</option>
            <option value={labels.requestTypeDefects}>
              {labels.requestTypeDefects}
            </option>
            <option value={labels.requestTypeProcess}>
              {labels.requestTypeProcess}
            </option>
            <option value={labels.requestTypeTraining}>
              {labels.requestTypeTraining}
            </option>
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
          />
        )}
      </CalculatorField>
      <p className="caption">{labels.formHint}</p>
      <button type="submit" className="btn-primary w-full sm:w-auto">
        {labels.requestConsultation}
      </button>
    </form>
  );
}
