'use client';

import { memo } from 'react';

import { Container } from '@/components/UI/Layout/Container';
import { Logo } from '@/components/UI/Logo';
import { SearchButton } from '@/components/UI/Search/components/SearchButton';
import { SearchDialog } from '@/components/UI/Search/components/SearchDialog';
import { useSearchDialog } from '@/contexts/SearchDialogContext';
import { css } from '@/ui/styled';
import { HeaderLayout } from './HeaderLayout';

export default memo(function Header() {
  const searchDialog = useSearchDialog();

  return (
    <>
      <HeaderLayout>
        <Container className={HeaderContainerStyle} size={'large'} space={false}>
          <Logo />
          <SearchButton openDialog={searchDialog.open} />
        </Container>
      </HeaderLayout>

      {(searchDialog.isOpen || searchDialog.isClosing) && (
        <SearchDialog
          closeDialog={searchDialog.close}
          isClosing={searchDialog.isClosing}
          ref={searchDialog.dialogRef}
        />
      )}
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
