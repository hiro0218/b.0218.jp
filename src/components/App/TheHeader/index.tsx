import { memo } from 'react';

import { Anchor as _Anchor } from '@/components/UI/Anchor';
import { Logo } from '@/components/UI/Logo';
import { useDialog, useSearch } from '@/components/UI/Search';
import { isMobile } from '@/ui/lib/mediaQuery';
import { showHoverBackground } from '@/ui/mixin';
import { styled } from '@/ui/styled';

import { HeaderLayout } from './HeaderLayout';

type Props = {
  containerWidth?: number;
};

const TheHeader = memo(function TheHeader(props: Props) {
  const { ref, locked, openDialog, closeDialog } = useDialog();
  const { SearchButton, SearchDialog } = useSearch({ refModal: ref, isActive: locked, openDialog, closeDialog });

  return (
    <>
      <HeaderLayout>
        <Container containerWidth={props.containerWidth}>
          <Anchor href="/" prefetch={false} passHref>
            <Logo width="80" height="25" />
          </Anchor>
          {SearchButton}
        </Container>
      </HeaderLayout>

      {SearchDialog}
    </>
  );
});

export default TheHeader;

const Container = styled.div<{ containerWidth: number }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: ${(props) => `${props.containerWidth}px`};
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
