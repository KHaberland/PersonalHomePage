import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  buildAdminChangelistUrl,
  buildAdminModelUrl,
  getAdminBaseUrl,
  isCmsEditEnabled,
  isLocalhostHostname,
} from './cms-edit';

describe('cms-edit', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('buildAdminChangelistUrl uses NEXT_PUBLIC_ADMIN_URL', () => {
    vi.stubEnv('NEXT_PUBLIC_ADMIN_URL', 'http://localhost:8000');
    expect(
      buildAdminChangelistUrl('home', 'entry_paths', 'entryPathsTitle')
    ).toBe(
      'http://localhost:8000/admin/pages/sitetextblock/?page__exact=home&block__exact=entry_paths&q=entryPathsTitle'
    );
  });

  it('getAdminBaseUrl derives from NEXT_PUBLIC_API_URL', () => {
    vi.stubEnv('NEXT_PUBLIC_ADMIN_URL', '');
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'http://localhost:8000/api');
    expect(getAdminBaseUrl()).toBe('http://localhost:8000');
  });

  it('isCmsEditEnabled respects env flag', () => {
    vi.stubEnv('NEXT_PUBLIC_CMS_EDIT', '1');
    expect(isCmsEditEnabled()).toBe(true);
    vi.stubEnv('NEXT_PUBLIC_CMS_EDIT', '0');
    expect(isCmsEditEnabled()).toBe(false);
  });

  it('buildAdminModelUrl returns changelist for About model', () => {
    vi.stubEnv('NEXT_PUBLIC_ADMIN_URL', 'http://localhost:8000');
    expect(buildAdminModelUrl('about')).toBe(
      'http://localhost:8000/admin/pages/about/'
    );
  });

  it('buildAdminModelUrl returns change URL when objectId is set', () => {
    vi.stubEnv('NEXT_PUBLIC_ADMIN_URL', 'http://localhost:8000');
    expect(buildAdminModelUrl('experience', 42)).toBe(
      'http://localhost:8000/admin/pages/experience/42/change/'
    );
  });

  it('buildAdminModelUrl returns null for unknown model', () => {
    expect(buildAdminModelUrl('missing')).toBeNull();
  });
});
