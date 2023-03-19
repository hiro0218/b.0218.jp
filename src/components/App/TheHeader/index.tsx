import { memo } from 'react';

import { Anchor as _Anchor } from '@/components/UI/Anchor';
import { Logo } from '@/components/UI/Logo';
import { useDialog, useSearch } from '@/components/UI/Search';
import { isMobile } from '@/ui/lib/mediaQuery';
import { showHoverBackground } from '@/ui/mixin';
import { styled } from '@/ui/styled';

import { HeaderLayout } from './HeaderLayout';

export default memo(function TheHeader() {
  const { ref, isLocked, openDialog, closeDialog } = useDialog();
  const { SearchButton, SearchDialog } = useSearch({ refModal: ref, isActive: isLocked, openDialog, closeDialog });

  return (
    <>
      <HeaderLayout>
        <Container>
          <Anchor href="/" passHref prefetch={false}>
            <Logo height="25" width="80" />
          </Anchor>
          {SearchButton}
        </Container>
      </HeaderLayout>

      {SearchDialog}
    </>
  );
});

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: var(--container-width);
  height: 100%;
  margin: 0 auto;

  ${isMobile} {
    padding: 0 5vw;
  }
`;

const Anchor = styled(_Anchor)`
  display: flex;
  align-items: center;
  height: 100%;
  pointer-events: auto;

  ${showHoverBackground}

  &::after {
    left: 50%;
  }

  &:hover,
  &:focus,
  &:focus-within {
    &::after {
      width: 125%;
      height: 70%;
      translate: -50% 0;
    }
  }
  &:focus-visible {
    &::after {
      opacity: 0;
    }
  }
`;
