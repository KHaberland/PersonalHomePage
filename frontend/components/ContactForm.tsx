'use client';

import { useTranslations } from 'next-intl';
import { type FormEvent, useState } from 'react';

type Props = {
  contactEmail: string;
};

export function ContactForm({ contactEmail }: Props) {
  const t = useTranslations('contact');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(t('formSubjectPrefix'));
    const body = encodeURIComponent(
      `${t('formBodyName')}: ${name}\n${t('formBodyEmail')}: ${email}\n\n${message}`
    );
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 p-6">
      <h2 className="heading-3 text-foreground">{t('formTitle')}</h2>
      <div>
        <label
          htmlFor="contact-name"
          className="mb-1 block text-sm text-foreground/80"
        >
          {t('formName')}
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
          {t('formEmail')}
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
          htmlFor="contact-message"
          className="mb-1 block text-sm text-foreground/80"
        >
          {t('formMessage')}
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
      <p className="text-xs text-foreground/60">{t('formHint')}</p>
      <button type="submit" className="btn-primary w-full sm:w-auto">
        {t('formSubmit')}
      </button>
    </form>
  );
}
