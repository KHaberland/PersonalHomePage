'use client';

import type { CookieConsentLabels } from '@/lib/cookie-consent';
import { CookieConsentProvider } from '@/lib/cookie-consent/context';
import { CookieBanner } from './CookieBanner';
import { CookiePreferencesModal } from './CookiePreferencesModal';
import { ConsentScriptLoader } from './ConsentScriptLoader';

type Props = {
  labels: CookieConsentLabels;
  children: React.ReactNode;
};

export function CookieConsentRoot({ labels, children }: Props) {
  return (
    <CookieConsentProvider labels={labels}>
      {children}
      <CookieBanner />
      <CookiePreferencesModal />
      <ConsentScriptLoader />
    </CookieConsentProvider>
  );
}
