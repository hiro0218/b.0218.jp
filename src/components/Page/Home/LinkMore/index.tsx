import { memo } from 'react';

import { Anchor as _Anchor } from '@/components/UI/Anchor';
import { LinkStyle } from '@/components/UI/LinkMenu';
import { HiOutlineChevronRight } from '@/ui/icons';
import { styled } from '@/ui/styled';

const IconArrow = memo(function IconArrow() {
  return (
    <Icon>
      <HiOutlineChevronRight size={12} />
    </Icon>
  );
});

export const LinkMoreArchive = () => {
  return (
    <Anchor href="/archive">
      archive
      <IconArrow />
    </Anchor>
  );
};

export const LinkMoreTag = () => {
  return (
    <Anchor href="/tags">
      tags
      <IconArrow />
    </Anchor>
  );
};

const Icon = styled.div`
  display: flex;
  align-items: center;
  margin-left: var(--space-half);
  color: var(--text-11);
`;

const Anchor = styled(_Anchor)`
  ${LinkStyle}

  color: var(--text-11);
  font-size: var(--font-size-md);
`;
