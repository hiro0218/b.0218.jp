import type { ReactNode } from 'react';

import { Anchor as _Anchor } from '@/components/UI/Anchor';
import { LinkStyle } from '@/components/UI/LinkMenu';
import { CaretRightIcon, ICON_SIZE_XS } from '@/ui/icons';
import { styled } from '@/ui/styled';

export function LinkMore({ href, text }: { href: string; text: string | ReactNode }) {
  return (
    <Anchor href={href}>
      {text}
      <Icon aria-hidden="true">
        <CaretRightIcon height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
      </Icon>
    </Anchor>
  );
}

const Icon = styled.div`
  display: flex;
  align-items: center;
  margin-left: var(--space-½);
  color: var(--text-11);
`;

const Anchor = styled(_Anchor)`
  ${LinkStyle}

  font-size: var(--font-size-md);
`;
