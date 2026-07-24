'use client';

import { dispatchOpenPreferences } from '@/lib/cookie-consent';
import { useCookieConsent } from '@/lib/cookie-consent/context';

type Props = {
  label?: string;
};

export function CookieSettingsButton({ label }: Props) {
  const { labels } = useCookieConsent();

  return (
    <button
      type="button"
      className="link-accent hover:underline"
      onClick={() => dispatchOpenPreferences()}
    >
      {label ?? labels.cookieSettings}
    </button>
  );
}
