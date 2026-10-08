const LOCALHOST_HOSTNAMES = new Set(['localhost', '127.0.0.1']);

/** Env flag only — client components also require localhost (see CmsText). */
export function isCmsEditEnabled(): boolean {
  return process.env.NEXT_PUBLIC_CMS_EDIT === '1';
}

export function isLocalhostHostname(hostname: string): boolean {
  return LOCALHOST_HOSTNAMES.has(hostname);
}

export function getAdminBaseUrl(): string {
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL?.trim();
  if (adminUrl) {
    return adminUrl.replace(/\/$/, '');
  }

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL?.trim() || 'http://localhost:8000/api';
  return apiUrl.replace(/\/api\/?$/, '');
}

export function buildAdminChangelistUrl(
  page: string,
  block: string,
  key: string
): string {
  const params = new URLSearchParams({
    page__exact: page,
    block__exact: block,
    q: key,
  });

  return `${getAdminBaseUrl()}/admin/pages/sitetextblock/?${params.toString()}`;
}

/** Changelist for About, Book, etc. (see backend/apps/pages/cms_edit_targets.py). */
export function buildAdminModelUrl(
  modelKey: string,
  objectId?: number
): string | null {
  const paths: Record<string, string> = {
    about: '/admin/pages/about/',
    aboutmain: '/admin/pages/aboutmain/',
    book: '/admin/pages/book/',
    contact: '/admin/pages/contact/',
    experience: '/admin/pages/experience/',
    post: '/admin/blog/post/',
    solutionsection: '/admin/pages/solutionsection/',
    solutioncolumngroup: '/admin/pages/solutioncolumngroup/',
  };

  const path = paths[modelKey];
  if (!path) {
    return null;
  }

  const base = `${getAdminBaseUrl()}${path.replace(/\/$/, '')}`;
  if (objectId != null) {
    return `${base}/${objectId}/change/`;
  }

  return `${getAdminBaseUrl()}${path}`;
}

export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL?.trim() || 'http://localhost:8000/api';
}

/** Dev-only: resolve direct /change/{id}/ via backend admin-link API. */
export async function openSiteTextBlockAdmin(
  page: string,
  block: string,
  key: string
): Promise<void> {
  const fallbackUrl = buildAdminChangelistUrl(page, block, key);

  if (process.env.NODE_ENV !== 'development') {
    window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
    return;
  }

  try {
    const params = new URLSearchParams({ page, block, key });
    const response = await fetch(
      `${getApiBaseUrl()}/content/admin-link/?${params.toString()}`
    );
    if (response.ok) {
      const data = (await response.json()) as { url?: string };
      if (data.url) {
        window.open(data.url, '_blank', 'noopener,noreferrer');
        return;
      }
    }
  } catch {
    // fallback to changelist
  }

  window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
}
