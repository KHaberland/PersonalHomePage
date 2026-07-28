'use client';

import type { ReactNode } from 'react';
import { useSyncExternalStore } from 'react';

import {
  buildAdminModelUrl,
  isCmsEditEnabled,
  isLocalhostHostname,
} from '@/lib/cms-edit';

type CmsModelTextProps = {
  model: string;
  field: string;
  objectId?: number;
  children: ReactNode;
  className?: string;
};

function subscribeToHostname() {
  return () => {};
}

function getCmsEditSnapshot(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return isCmsEditEnabled() && isLocalhostHostname(window.location.hostname);
}

function getCmsEditServerSnapshot(): boolean {
  return false;
}

export function CmsModelText({
  model,
  field,
  objectId,
  children,
  className = '',
}: CmsModelTextProps) {
  const enabled = useSyncExternalStore(
    subscribeToHostname,
    getCmsEditSnapshot,
    getCmsEditServerSnapshot
  );

  if (!enabled) {
    return <>{children}</>;
  }

  const adminUrl = buildAdminModelUrl(model, objectId);
  const label = `${model}:${field}`;

  if (!adminUrl) {
    return <>{children}</>;
  }

  return (
    <div className={`group/cms relative ${className}`.trim()}>
      {children}
      <a
        href={adminUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Редактировать модель в Django Admin"
        className="ml-1 inline-flex max-w-[12rem] truncate align-middle rounded bg-sky-200/90 px-1 py-0.5 text-[10px] font-mono leading-none text-sky-950 opacity-0 transition-opacity group-hover/cms:opacity-100 group-focus-within/cms:opacity-100 print:hidden"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          window.open(adminUrl, '_blank', 'noopener,noreferrer');
        }}
      >
        {label} ✎
      </a>
    </div>
  );
}
