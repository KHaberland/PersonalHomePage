import type { ReactNode } from 'react';

import { CmsText } from '@/components/cms/CmsText';

/** Server-page helper: wrap CMS string with optional Site → Admin badge. */
export function cmsText(
  page: string,
  block: string,
  key: string,
  value: string
): ReactNode {
  if (!value) {
    return value;
  }

  return (
    <CmsText page={page} block={block} cmsKey={key}>
      {value}
    </CmsText>
  );
}
