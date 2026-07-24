/** LocalStorage key for the consent record (MVP: no cookie mirror). */
export const CONSENT_STORAGE_KEY = 'cookie_consent_v1';

/** Bump when consent categories change — invalidates stored choices. */
export const CONSENT_VERSION = 1;

/** Consent TTL: 12 months from `date`. */
export const CONSENT_TTL_MS = 365 * 24 * 60 * 60 * 1000;

export type CookieConsentRecord = {
  version: number;
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  /** ISO-8601 timestamp when the choice was saved. */
  date: string;
};

export type CookieConsentInput = {
  analytics: boolean;
  marketing: boolean;
};

/** Partial update for `saveConsent` — missing flags default to `false` (opt-in). */
export type CookieConsentPartial = Partial<CookieConsentInput>;

export type CookieConsentLabels = {
  bannerText: string;
  acceptAll: string;
  rejectAll: string;
  managePreferences: string;
  cookiePolicyLink: string;
  necessaryTitle: string;
  necessaryDesc: string;
  necessaryAlwaysActive: string;
  analyticsTitle: string;
  analyticsDesc: string;
  marketingTitle: string;
  marketingDesc: string;
  savePreferences: string;
  modalTitle: string;
  closeLabel: string;
  cookieSettings: string;
};
