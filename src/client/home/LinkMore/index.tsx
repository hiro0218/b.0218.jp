import { memo } from 'react';

import { Anchor as _Anchor } from '@/components/UI/Anchor';
import { LinkStyle } from '@/components/UI/LinkMenu';
import { ICON_SIZE_XS, RxCaretRight } from '@/ui/icons';
import { styled } from '@/ui/styled';

const IconArrow = memo(function IconArrow() {
  return (
    <Icon>
      <RxCaretRight size={ICON_SIZE_XS} />
    </Icon>
  );
});

export function LinkMore({ href, text }: { href: string; text: string }) {
  return (
    <Anchor href={href}>
      {text}
      <IconArrow />
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
