export const LEAD_HONEYPOT_FIELD = 'website';

export type LeadTrackingFields = {
  page_path: string;
  referrer: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  website: string;
};

export function getLeadTrackingFields(honeypotValue = ''): LeadTrackingFields {
  if (typeof window === 'undefined') {
    return {
      page_path: '',
      referrer: '',
      utm_source: '',
      utm_medium: '',
      utm_campaign: '',
      website: honeypotValue,
    };
  }

  const params = new URLSearchParams(window.location.search);

  return {
    page_path: window.location.pathname,
    referrer: document.referrer || '',
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    website: honeypotValue,
  };
}
