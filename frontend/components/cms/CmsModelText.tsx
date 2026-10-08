'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

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

function canShowCmsEditBadge(): boolean {
  return isCmsEditEnabled() && isLocalhostHostname(window.location.hostname);
}

export function CmsModelText({
  model,
  field,
  objectId,
  children,
  className = '',
}: CmsModelTextProps) {
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    setShowBadge(canShowCmsEditBadge());
  }, []);

  const adminUrl = buildAdminModelUrl(model, objectId);
  const label = `${model}:${field}`;
  const badgeClassName =
    'absolute top-0 right-0 z-10 inline-flex max-w-full truncate rounded bg-sky-200/90 px-1 py-0.5 text-[10px] font-mono leading-none text-sky-950 opacity-0 transition-opacity group-hover/cms:opacity-100 group-focus-within/cms:opacity-100 print:hidden';
  const wrapperClass = [
    className,
    showBadge && adminUrl ? 'group/cms relative' : '',
  ]
    .filter(Boolean)
    .join(' ');

  if (wrapperClass) {
    return (
      <div className={wrapperClass}>
        {children}
        {showBadge && adminUrl ? (
          <button
            type="button"
            title="Редактировать модель в Django Admin"
            className={badgeClassName}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              window.open(adminUrl, '_blank', 'noopener,noreferrer');
            }}
          >
            {label} ✎
          </button>
        ) : null}
      </div>
    );
  }

  if (!showBadge || !adminUrl) {
    return <>{children}</>;
  }

  return (
    <div className="group/cms relative">
      {children}
      <button
        type="button"
        title="Редактировать модель в Django Admin"
        className={badgeClassName}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          window.open(adminUrl, '_blank', 'noopener,noreferrer');
        }}
      >
        {label} ✎
      </button>
    </div>
  );
}
