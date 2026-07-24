'use client';

import { useEffect } from 'react';
import { useCookieConsent } from '@/lib/cookie-consent/context';

/**
 * Loads third-party scripts only after consent.
 * GA / marketing pixels are no-ops until env IDs are configured (Phase C).
 */
export function ConsentScriptLoader() {
  const { mounted, consent } = useCookieConsent();

  useEffect(() => {
    if (!mounted || !consent) {
      return;
    }

    const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
    if (consent.analytics && gaId) {
      // Phase C: loadGoogleAnalytics(gaId)
    }

    if (consent.marketing) {
      // Phase C: loadMarketingScripts()
    }
  }, [mounted, consent]);

  return null;
}
