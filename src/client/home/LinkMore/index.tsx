import { memo } from 'react';

import { Anchor as _Anchor } from '@/components/UI/Anchor';
import { LinkStyle } from '@/components/UI/LinkMenu';
import { RxCaretRight } from '@/ui/icons';
import { styled } from '@/ui/styled';

const IconArrow = memo(function IconArrow() {
  return (
    <Icon>
      <RxCaretRight />
    </Icon>
  );
});

export const LinkMore = ({ href, text }: { href: string; text: string }) => {
  return (
    <Anchor href={href}>
      {text}
      <IconArrow />
    </Anchor>
  );
};

const Icon = styled.div`
  display: flex;
  align-items: center;
  margin-left: var(--space-½);
  color: var(--text-11);
`;

const Anchor = styled(_Anchor)`
  ${LinkStyle}

  font-size: var(--font-size-md);
  color: var(--text-11);
`;