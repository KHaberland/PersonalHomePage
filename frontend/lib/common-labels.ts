import type { PageContent } from './api-types';
import {
  DEFAULT_COOKIE_CONSENT_LABELS,
  type CookieConsentLabels,
} from './cookie-consent';

export type LabelMap = Record<string, string>;

export type CommonUiLabels = {
  header: LabelMap;
  footer: LabelMap;
  nav: LabelMap;
  progress: LabelMap;
  home: LabelMap;
  brand: LabelMap;
  platforms: LabelMap;
  language: LabelMap;
  cookieConsent: CookieConsentLabels;
};

type FallbackMessages = {
  header?: unknown;
  footer?: unknown;
  common?: unknown;
  home?: unknown;
};

function toLabelMap(value: unknown): LabelMap {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).filter((entry): entry is [string, string] => {
      const [, label] = entry;
      return typeof label === 'string';
    })
  );
}

function mergeLabels(fallback: unknown, cms?: LabelMap): LabelMap {
  return {
    ...toLabelMap(fallback),
    ...(cms ?? {}),
  };
}

function mergeCookieConsentLabels(cms?: LabelMap): CookieConsentLabels {
  const merged = {
    ...DEFAULT_COOKIE_CONSENT_LABELS,
    ...(cms ?? {}),
  };
  return merged as CookieConsentLabels;
}

export function buildCommonUiLabels(
  messages: FallbackMessages,
  cmsContent?: PageContent | null
): CommonUiLabels {
  return {
    header: mergeLabels(messages.header, cmsContent?.header),
    footer: mergeLabels(messages.footer, cmsContent?.footer),
    nav: mergeLabels(messages.common, cmsContent?.nav),
    progress: mergeLabels(messages.common, cmsContent?.progress),
    home: toLabelMap(messages.home),
    brand: mergeLabels(undefined, cmsContent?.brand),
    platforms: mergeLabels(messages.footer, cmsContent?.platforms),
    language: mergeLabels(messages.footer, cmsContent?.language),
    cookieConsent: mergeCookieConsentLabels(cmsContent?.cookie_consent),
  };
}
