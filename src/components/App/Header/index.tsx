'use client';

import { memo, useCallback, useRef } from 'react';

import { Container } from '@/components/UI/Layout/Container';
import { Logo } from '@/components/UI/Logo';
import { SearchButton } from '@/components/UI/Search/components/SearchButton';
import { SearchDialog } from '@/components/UI/Search/components/SearchDialog';
import { css } from '@/ui/styled';
import { HeaderLayout } from './HeaderLayout';

export default memo(function Header() {
  const ref = useRef<HTMLDialogElement>(null);

  const openDialog = useCallback(() => {
    ref.current?.show?.();
  }, []);

  const closeDialog = useCallback(() => {
    ref.current?.close?.();
  }, []);

  return (
    <>
      <HeaderLayout>
        <Container className={HeaderContainerStyle} size={'large'} space={false}>
          <Logo />
          <SearchButton openDialog={openDialog} />
        </Container>
      </HeaderLayout>

      <SearchDialog closeDialog={closeDialog} ref={ref} />
    </>
  );
});

const HeaderContainerStyle = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: var(--spacing-4);
  margin: 0 auto;

  @media (--isMobile) {
    padding: 0 var(--spacing-3);
  }
`;
