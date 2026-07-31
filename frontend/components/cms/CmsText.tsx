'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import {
  buildAdminChangelistUrl,
  isCmsEditEnabled,
  isLocalhostHostname,
  openSiteTextBlockAdmin,
} from '@/lib/cms-edit';

type CmsTextProps = {
  page: string;
  block: string;
  cmsKey: string;
  children: ReactNode;
  className?: string;
};

function canShowCmsEditBadge(): boolean {
  return isCmsEditEnabled() && isLocalhostHostname(window.location.hostname);
}

export function CmsText({
  page,
  block,
  cmsKey,
  children,
  className = '',
}: CmsTextProps) {
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    setShowBadge(canShowCmsEditBadge());
  }, []);

  if (!showBadge) {
    return <>{children}</>;
  }

  const adminUrl = buildAdminChangelistUrl(page, block, cmsKey);
  const label = `${page}.${block}.${cmsKey}`;

  return (
    <span className={`group/cms relative inline ${className}`.trim()}>
      {children}
      <a
        href={adminUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Редактировать в Django Admin"
        className="ml-1 inline-flex max-w-[12rem] truncate align-middle rounded bg-amber-200/90 px-1 py-0.5 text-[10px] font-mono leading-none text-amber-950 opacity-0 transition-opacity group-hover/cms:opacity-100 group-focus-within/cms:opacity-100 print:hidden"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void openSiteTextBlockAdmin(page, block, cmsKey);
        }}
      >
        {label} ✎
      </a>
    </span>
  );
}
