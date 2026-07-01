'use client';

import { type FormEvent, useState } from 'react';

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
    <form onSubmit={handleSubmit} className="card space-y-4 p-6">
      <h2 className="heading-3 text-foreground">{labels.formTitle}</h2>
      <div>
        <label
          htmlFor="contact-name"
          className="mb-1 block text-sm text-foreground/80"
        >
          {labels.formName}
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none ring-accent-orange focus:ring-2"
          autoComplete="name"
        />
      </div>
      <div>
        <label
          htmlFor="contact-email"
          className="mb-1 block text-sm text-foreground/80"
        >
          {labels.formEmail}
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none ring-accent-orange focus:ring-2"
          autoComplete="email"
        />
      </div>
      <div>
        <label
          htmlFor="contact-request-type"
          className="mb-1 block text-sm text-foreground/80"
        >
          {labels.formRequestType}
        </label>
        <select
          id="contact-request-type"
          name="requestType"
          required
          value={requestType}
          onChange={(e) => setRequestType(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none ring-accent-orange focus:ring-2"
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
      </div>
      <div>
        <label
          htmlFor="contact-message"
          className="mb-1 block text-sm text-foreground/80"
        >
          {labels.formMessage}
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none ring-accent-orange focus:ring-2"
        />
      </div>
      <p className="text-xs text-foreground/60">{labels.formHint}</p>
      <button type="submit" className="btn-primary w-full sm:w-auto">
        {labels.requestConsultation}
      </button>
    </form>
  );
}
