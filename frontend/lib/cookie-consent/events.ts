export const OPEN_PREFERENCES_EVENT = 'cookie-consent:open-preferences';

/** Open the preferences modal from footer / Cookie Policy (no React tree required). */
export function dispatchOpenPreferences(): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT));
}

/** Plan API alias for `dispatchOpenPreferences`. */
export const openPreferences = dispatchOpenPreferences;

export function subscribeOpenPreferences(listener: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const handler = () => {
    listener();
  };

  window.addEventListener(OPEN_PREFERENCES_EVENT, handler);
  return () => {
    window.removeEventListener(OPEN_PREFERENCES_EVENT, handler);
  };
}
