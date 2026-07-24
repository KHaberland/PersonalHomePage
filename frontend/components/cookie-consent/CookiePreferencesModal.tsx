'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type {
  CookieConsentLabels,
  CookieConsentRecord,
} from '@/lib/cookie-consent';
import { useCookieConsent } from '@/lib/cookie-consent/context';

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

const CHECKBOX_CLASS =
  'input-industrial mt-1 size-4 shrink-0 p-0 accent-accent-orange disabled:cursor-not-allowed disabled:opacity-70';

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  ).filter((element) => element.tabIndex !== -1);
}

type ModalInnerProps = {
  labels: CookieConsentLabels;
  consent: CookieConsentRecord | null;
  onClose: () => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onSave: (analytics: boolean, marketing: boolean) => void;
};

function CookiePreferencesModalInner({
  labels,
  consent,
  onClose,
  onAcceptAll,
  onRejectAll,
  onSave,
}: ModalInnerProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [analytics, setAnalytics] = useState(consent?.analytics ?? false);
  const [marketing, setMarketing] = useState(consent?.marketing ?? false);

  useEffect(() => {
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    closeButtonRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) {
        return;
      }

      const focusable = getFocusableElements(dialogRef.current);
      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || !dialogRef.current.contains(active)) {
          event.preventDefault();
          last.focus();
        }
        return;
      }

      if (active === last || !dialogRef.current.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center md:p-6"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label={labels.closeLabel}
        tabIndex={-1}
        onClick={onClose}
      />

      <div
        ref={dialogRef}
        className="card relative z-10 w-full max-w-lg border border-border"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border p-4 md:p-6">
          <h2 id={titleId} className="heading-3 text-foreground">
            {labels.modalTitle}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            className="btn-secondary shrink-0 px-3 py-1.5 text-sm"
            onClick={onClose}
          >
            {labels.closeLabel}
          </button>
        </div>

        <div className="space-y-4 p-4 md:p-6">
          <section
            className="card-subtle p-4"
            aria-labelledby={`${titleId}-necessary`}
          >
            <div className="flex items-start gap-3">
              <input
                id={`${titleId}-necessary-input`}
                type="checkbox"
                className={CHECKBOX_CLASS}
                checked
                disabled
                aria-disabled="true"
                readOnly
                tabIndex={-1}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3
                      id={`${titleId}-necessary`}
                      className="text-sm font-medium text-foreground"
                    >
                      {labels.necessaryTitle}
                    </h3>
                    <p className="mt-1 text-sm text-foreground/80">
                      {labels.necessaryDesc}
                    </p>
                  </div>
                  <span className="caption shrink-0 text-accent-orange">
                    {labels.necessaryAlwaysActive}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="card-subtle p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                className={CHECKBOX_CLASS}
                checked={analytics}
                onChange={(event) => setAnalytics(event.target.checked)}
              />
              <span>
                <span className="block text-sm font-medium text-foreground">
                  {labels.analyticsTitle}
                </span>
                <span className="mt-1 block text-sm text-foreground/80">
                  {labels.analyticsDesc}
                </span>
              </span>
            </label>
          </section>

          <section className="card-subtle p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                className={CHECKBOX_CLASS}
                checked={marketing}
                onChange={(event) => setMarketing(event.target.checked)}
              />
              <span>
                <span className="block text-sm font-medium text-foreground">
                  {labels.marketingTitle}
                </span>
                <span className="mt-1 block text-sm text-foreground/80">
                  {labels.marketingDesc}
                </span>
              </span>
            </label>
          </section>
        </div>

        <div className="flex flex-col gap-2 border-t border-border p-4 sm:flex-row sm:flex-wrap md:p-6">
          <button
            type="button"
            className="btn-primary"
            onClick={() => onSave(analytics, marketing)}
          >
            {labels.savePreferences}
          </button>
          <button type="button" className="btn-secondary" onClick={onAcceptAll}>
            {labels.acceptAll}
          </button>
          <button type="button" className="btn-secondary" onClick={onRejectAll}>
            {labels.rejectAll}
          </button>
        </div>
      </div>
    </div>
  );
}

export function CookiePreferencesModal() {
  const {
    labels,
    showModal,
    consent,
    closeModal,
    acceptAll,
    rejectAll,
    savePreferences,
  } = useCookieConsent();

  if (!showModal) {
    return null;
  }

  return (
    <CookiePreferencesModalInner
      key={consent?.date ?? 'new'}
      labels={labels}
      consent={consent}
      onClose={closeModal}
      onAcceptAll={acceptAll}
      onRejectAll={rejectAll}
      onSave={savePreferences}
    />
  );
}
