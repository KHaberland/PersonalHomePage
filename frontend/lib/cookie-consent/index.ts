export {
  CONSENT_STORAGE_KEY,
  CONSENT_TTL_MS,
  CONSENT_VERSION,
  type CookieConsentInput,
  type CookieConsentLabels,
  type CookieConsentPartial,
  type CookieConsentRecord,
} from './types';

export { DEFAULT_COOKIE_CONSENT_LABELS } from './default-labels';

export {
  acceptAll,
  getConsent,
  hasConsentChoice,
  parseConsentRecord,
  rejectAll,
  saveConsent,
  subscribeConsent,
} from './storage';

export {
  dispatchOpenPreferences,
  openPreferences,
  OPEN_PREFERENCES_EVENT,
  subscribeOpenPreferences,
} from './events';
