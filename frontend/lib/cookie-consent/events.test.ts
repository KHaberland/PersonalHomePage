import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  dispatchOpenPreferences,
  openPreferences,
  OPEN_PREFERENCES_EVENT,
  subscribeOpenPreferences,
} from './events';

describe('cookie-consent events', () => {
  beforeEach(() => {
    vi.stubGlobal('window', {
      dispatchEvent: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('dispatchOpenPreferences emits the open-preferences event', () => {
    dispatchOpenPreferences();
    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: OPEN_PREFERENCES_EVENT })
    );
  });

  it('openPreferences is an alias of dispatchOpenPreferences', () => {
    expect(openPreferences).toBe(dispatchOpenPreferences);
  });

  it('subscribeOpenPreferences registers and unregisters the listener', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeOpenPreferences(listener);

    expect(window.addEventListener).toHaveBeenCalledWith(
      OPEN_PREFERENCES_EVENT,
      expect.any(Function)
    );

    unsubscribe();
    expect(window.removeEventListener).toHaveBeenCalledWith(
      OPEN_PREFERENCES_EVENT,
      expect.any(Function)
    );
  });
});
