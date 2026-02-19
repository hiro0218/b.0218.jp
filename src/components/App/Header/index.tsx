'use client';

import { SearchDialog } from '@/components/App/Search/SearchDialog';
import { SearchTrigger } from '@/components/App/Search/SearchTrigger';
import { Container } from '@/components/UI/Layout/Container';
import { Logo } from '@/components/UI/Logo';
import { css } from '@/ui/styled';
import { HeaderLayout } from './HeaderLayout';
import { useSearchDialog } from './SearchDialogContext';

export default function Header() {
  const searchDialog = useSearchDialog();

  return (
    <>
      <HeaderLayout>
        <Container className={HeaderContainerStyle} size={'large'} space={false}>
          <Logo />
          <SearchTrigger openDialogAction={searchDialog.open} />
        </Container>
      </HeaderLayout>

      {(searchDialog.isOpen || searchDialog.isClosing) && (
        <SearchDialog
          dialogRef={searchDialog.dialogRef}
          isClosing={searchDialog.isClosing}
          onCloseAction={searchDialog.close}
        />
      )}
    </>
  );
}

const HeaderContainerStyle = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0;
  margin: 0 auto;
`;
