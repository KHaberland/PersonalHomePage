'use client';

import { Link } from '@/i18n/navigation';
import { useCookieConsent } from '@/lib/cookie-consent/context';

export function CookieBanner() {
  const { labels, showBanner, acceptAll, rejectAll, openPreferences } =
    useCookieConsent();

  if (!showBanner) {
    return null;
  }

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-50 p-4 md:p-6"
      role="dialog"
      aria-label={labels.modalTitle}
      aria-describedby="cookie-banner-desc"
    >
      <div className="card mx-auto max-w-4xl border border-border">
        <div className="p-4 md:p-6">
          <p
            id="cookie-banner-desc"
            className="text-sm leading-relaxed text-foreground/90"
          >
            {labels.bannerText}{' '}
            <Link href="/cookie-policy" className="link-accent hover:underline">
              {labels.cookiePolicyLink}
            </Link>
          </p>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <button type="button" className="btn-primary" onClick={acceptAll}>
              {labels.acceptAll}
            </button>
            <button type="button" className="btn-secondary" onClick={rejectAll}>
              {labels.rejectAll}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={openPreferences}
            >
              {labels.managePreferences}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
