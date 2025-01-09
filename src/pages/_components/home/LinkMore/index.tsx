import type { ReactNode } from 'react';

import { Anchor as _Anchor } from '@/components/UI/Anchor';
import { CaretRightIcon, ICON_SIZE_XS } from '@/ui/icons';
import { styled } from '@/ui/styled/dynamic';

export function LinkMore({ href, text }: { href: string; text: string | ReactNode }) {
  return (
    <Anchor className="link-style link-style--hover-effect" href={href}>
      {text}
      <CaretRightIcon aria-hidden="true" fill="currentColor" height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
    </Anchor>
  );
}

const Anchor = styled(_Anchor)`
  font-size: var(--font-size-sm);
`;
