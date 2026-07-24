import type { CookieConsentLabels } from './types';

/** EN fallbacks when CMS / messages labels are missing. */
export const DEFAULT_COOKIE_CONSENT_LABELS: CookieConsentLabels = {
  bannerText:
    'We use cookies to improve your experience, analyse website traffic and provide personalised content. You can accept all cookies, reject non-essential cookies or manage your preferences.',
  acceptAll: 'Accept all',
  rejectAll: 'Reject all',
  managePreferences: 'Manage preferences',
  cookiePolicyLink: 'Read our Cookie Policy.',
  necessaryTitle: 'Necessary cookies',
  necessaryDesc:
    'Required for the site to work: session, security and language preferences.',
  necessaryAlwaysActive: 'Always active',
  analyticsTitle: 'Analytics cookies',
  analyticsDesc:
    'Help us understand how visitors use the site (e.g. Google Analytics). Disabled until you opt in.',
  marketingTitle: 'Marketing cookies',
  marketingDesc:
    'Used for email tracking pixels and advertising if enabled later. Currently not in use.',
  savePreferences: 'Save preferences',
  modalTitle: 'Cookie preferences',
  closeLabel: 'Close',
  cookieSettings: 'Cookie settings',
};
