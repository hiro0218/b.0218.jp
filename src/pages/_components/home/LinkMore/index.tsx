import type { ReactNode } from 'react';

import { Anchor } from '@/components/UI/Anchor';
import { CaretRightIcon, ICON_SIZE_XS } from '@/ui/icons';

export function LinkMore({ href, text }: { href: string; text: string | ReactNode }) {
  return (
    <Anchor className="link-style link-style--hover-effect font-size_var(--font-size-sm)" href={href}>
      {text}
      <CaretRightIcon aria-hidden="true" fill="currentColor" height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
    </Anchor>
  );
}
