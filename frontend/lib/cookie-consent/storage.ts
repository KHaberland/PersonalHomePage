import {
  CONSENT_STORAGE_KEY,
  CONSENT_TTL_MS,
  CONSENT_VERSION,
  type CookieConsentPartial,
  type CookieConsentRecord,
} from './types';

type ConsentListener = (consent: CookieConsentRecord | null) => void;

const listeners = new Set<ConsentListener>();

/** Stable snapshot for useSyncExternalStore — same reference until storage changes. */
let cachedRaw: string | null | undefined;
let cachedConsent: CookieConsentRecord | null | undefined;

function setConsentCache(
  raw: string | null,
  consent: CookieConsentRecord | null
): CookieConsentRecord | null {
  cachedRaw = raw;
  cachedConsent = consent;
  return consent;
}

function canUseLocalStorage(): boolean {
  return (
    typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
  );
}

function notifyListeners(consent: CookieConsentRecord | null): void {
  for (const listener of listeners) {
    listener(consent);
  }
}

function isExpired(consent: CookieConsentRecord, nowMs: number): boolean {
  const savedAt = Date.parse(consent.date);
  if (Number.isNaN(savedAt)) {
    return true;
  }
  return nowMs - savedAt > CONSENT_TTL_MS;
}

function isRecordShape(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Parse and validate a stored JSON value.
 * Rejects wrong version, missing fields, and non-boolean categories.
 * Never returns PII — only category flags + metadata.
 */
export function parseConsentRecord(
  value: unknown,
  nowMs: number = Date.now()
): CookieConsentRecord | null {
  if (!isRecordShape(value)) {
    return null;
  }

  const { version, necessary, analytics, marketing, date } = value;

  if (version !== CONSENT_VERSION) {
    return null;
  }
  if (necessary !== true) {
    return null;
  }
  if (typeof analytics !== 'boolean' || typeof marketing !== 'boolean') {
    return null;
  }
  if (typeof date !== 'string' || date.length === 0) {
    return null;
  }

  const record: CookieConsentRecord = {
    version: CONSENT_VERSION,
    necessary: true,
    analytics,
    marketing,
    date,
  };

  if (isExpired(record, nowMs)) {
    return null;
  }

  return record;
}

function readRaw(): string | null {
  if (!canUseLocalStorage()) {
    return null;
  }
  try {
    return window.localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeRaw(record: CookieConsentRecord): void {
  if (!canUseLocalStorage()) {
    return;
  }
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Quota / private mode — ignore; in-memory listeners still get the update.
  }
}

function clearRaw(): void {
  if (!canUseLocalStorage()) {
    return;
  }
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    // ignore
  }
}

/** Read consent; returns null when missing, expired, or version-mismatched. */
export function getConsent(
  nowMs: number = Date.now()
): CookieConsentRecord | null {
  const raw = readRaw();

  if (cachedRaw !== undefined && raw === cachedRaw) {
    if (cachedConsent == null) {
      return null;
    }
    if (isExpired(cachedConsent, nowMs)) {
      clearRaw();
      return setConsentCache(null, null);
    }
    return cachedConsent;
  }

  if (raw === null) {
    return setConsentCache(null, null);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    clearRaw();
    return setConsentCache(null, null);
  }

  const record = parseConsentRecord(parsed, nowMs);
  if (!record) {
    // Expired or version bump → drop stale data so the banner shows again.
    clearRaw();
    return setConsentCache(null, null);
  }

  return setConsentCache(raw, record);
}

/**
 * Persist a choice. Missing category flags default to `false` (opt-in).
 * `necessary` is always true; no PII is stored.
 */
export function saveConsent(
  partial: CookieConsentPartial = {},
  now: Date = new Date()
): CookieConsentRecord {
  const record: CookieConsentRecord = {
    version: CONSENT_VERSION,
    necessary: true,
    analytics: partial.analytics ?? false,
    marketing: partial.marketing ?? false,
    date: now.toISOString(),
  };

  writeRaw(record);
  setConsentCache(readRaw(), record);
  notifyListeners(record);
  return record;
}

export function acceptAll(now: Date = new Date()): CookieConsentRecord {
  return saveConsent({ analytics: true, marketing: true }, now);
}

export function rejectAll(now: Date = new Date()): CookieConsentRecord {
  return saveConsent({ analytics: false, marketing: false }, now);
}

/** True when a valid (non-expired, current-version) choice exists. */
export function hasConsentChoice(nowMs: number = Date.now()): boolean {
  return getConsent(nowMs) !== null;
}

/**
 * Subscribe to consent changes (same-tab via saveConsent + cross-tab via storage).
 * Does not emit synchronously — read `getConsent()` for the current value
 * (required for `useSyncExternalStore`).
 */
export function subscribeConsent(listener: ConsentListener): () => void {
  listeners.add(listener);

  const onStorage = (event: StorageEvent) => {
    if (event.key !== CONSENT_STORAGE_KEY && event.key !== null) {
      return;
    }
    listener(getConsent());
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', onStorage);
  }

  return () => {
    listeners.delete(listener);
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', onStorage);
    }
  };
}
