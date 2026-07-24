import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CONSENT_STORAGE_KEY, CONSENT_TTL_MS, CONSENT_VERSION } from './types';
import {
  acceptAll,
  getConsent,
  hasConsentChoice,
  parseConsentRecord,
  rejectAll,
  saveConsent,
  subscribeConsent,
} from './storage';

function createMemoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear() {
      map.clear();
    },
    getItem(key: string) {
      return map.has(key) ? (map.get(key) as string) : null;
    },
    key(index: number) {
      return Array.from(map.keys())[index] ?? null;
    },
    removeItem(key: string) {
      map.delete(key);
    },
    setItem(key: string, value: string) {
      map.set(key, value);
    },
  };
}

describe('cookie-consent storage', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', createMemoryStorage());
    // Minimal window for storage event subscription path.
    vi.stubGlobal('window', {
      localStorage: globalThis.localStorage,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('saves acceptAll with analytics and marketing true', () => {
    const now = new Date('2026-07-24T12:00:00.000Z');
    const record = acceptAll(now);

    expect(record).toEqual({
      version: CONSENT_VERSION,
      necessary: true,
      analytics: true,
      marketing: true,
      date: '2026-07-24T12:00:00.000Z',
    });
    expect(getConsent(now.getTime())).toEqual(record);
    expect(hasConsentChoice(now.getTime())).toBe(true);
  });

  it('saves rejectAll with analytics and marketing false', () => {
    const now = new Date('2026-07-24T12:00:00.000Z');
    const record = rejectAll(now);

    expect(record.analytics).toBe(false);
    expect(record.marketing).toBe(false);
    expect(record.necessary).toBe(true);
    expect(
      JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY) as string)
    ).toEqual(record);
  });

  it('returns null and clears storage after TTL of 12 months', () => {
    const savedAt = new Date('2025-07-24T12:00:00.000Z');
    saveConsent({ analytics: true, marketing: false }, savedAt);

    const justExpired = savedAt.getTime() + CONSENT_TTL_MS + 1;
    expect(getConsent(justExpired)).toBeNull();
    expect(localStorage.getItem(CONSENT_STORAGE_KEY)).toBeNull();
    expect(hasConsentChoice(justExpired)).toBe(false);
  });

  it('keeps consent within TTL', () => {
    const savedAt = new Date('2026-01-01T00:00:00.000Z');
    saveConsent({ analytics: false, marketing: true }, savedAt);

    const almostExpired = savedAt.getTime() + CONSENT_TTL_MS - 1;
    expect(getConsent(almostExpired)?.marketing).toBe(true);
  });

  it('invalidates consent on version mismatch', () => {
    localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({
        version: CONSENT_VERSION + 1,
        necessary: true,
        analytics: true,
        marketing: true,
        date: '2026-07-24T12:00:00.000Z',
      })
    );

    expect(getConsent()).toBeNull();
    expect(localStorage.getItem(CONSENT_STORAGE_KEY)).toBeNull();
  });

  it('parseConsentRecord rejects malformed payloads', () => {
    expect(parseConsentRecord(null)).toBeNull();
    expect(parseConsentRecord({ version: 1 })).toBeNull();
    expect(
      parseConsentRecord({
        version: CONSENT_VERSION,
        necessary: false,
        analytics: false,
        marketing: false,
        date: '2026-07-24T12:00:00.000Z',
      })
    ).toBeNull();
  });

  it('subscribeConsent notifies on save', () => {
    const seen: Array<ReturnType<typeof getConsent>> = [];
    const unsubscribe = subscribeConsent((consent) => {
      seen.push(consent);
    });

    expect(seen).toHaveLength(0);
    acceptAll(new Date('2026-07-24T12:00:00.000Z'));
    expect(seen).toHaveLength(1);
    expect(seen[0]?.analytics).toBe(true);

    unsubscribe();
  });

  it('saveConsent partial defaults missing flags to false (opt-in)', () => {
    const now = new Date('2026-07-24T12:00:00.000Z');
    const record = saveConsent({ analytics: true }, now);

    expect(record.analytics).toBe(true);
    expect(record.marketing).toBe(false);
    expect(record.necessary).toBe(true);
  });
});
