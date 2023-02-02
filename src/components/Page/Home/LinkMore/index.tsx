import { memo } from 'react';
import { HiOutlineChevronRight } from 'react-icons/hi';

import { Anchor as _Anchor } from '@/components/UI/Anchor';
import { LinkStyle } from '@/components/UI/LinkMenu';
import { styled } from '@/ui/styled';

const IconArrow = memo(function IconArrow() {
  return (
    <Icon>
      <HiOutlineChevronRight size={16} />
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
  color: var(--text-11);

  svg {
    width: 1em;
    height: 1em;
  }
`;

const Anchor = styled(_Anchor)`
  ${LinkStyle}

  color: var(--text-11);
`;
