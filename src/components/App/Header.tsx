'use client';

import { lazy, Suspense } from 'react';
import { loadAndInitializeSearch } from '@/components/App/Search/engine/searchDataLoader';
import { SearchTrigger } from '@/components/App/Search/SearchTrigger';
import { Container } from '@/components/UI/Layout/Container';
import { Logo } from '@/components/UI/Logo';
import { css } from '@/ui/styled';
import { Layout } from './Header/Layout';
import { useSearchDialog } from './SearchDialogContext';

const importSearchDialog = () => import('@/components/App/Search/SearchDialog');

const LazySearchDialog = lazy(() => importSearchDialog().then((m) => ({ default: m.SearchDialog })));

let prefetchStarted = false;
const prefetchSearchDialog = () => {
  if (prefetchStarted) return;
  prefetchStarted = true;
  Promise.all([importSearchDialog(), loadAndInitializeSearch()]).catch(() => {
    prefetchStarted = false;
  });
};

export function Header() {
  const searchDialog = useSearchDialog();

  return (
    <>
      <Layout>
        <Container className={HeaderContainerStyle} size={'large'} space={false}>
          <Logo />
          <SearchTrigger onPrefetch={prefetchSearchDialog} openDialogAction={searchDialog.open} />
        </Container>
      </Layout>

      {(searchDialog.isOpen || searchDialog.isClosing) && (
        <Suspense fallback={null}>
          <LazySearchDialog
            dialogRef={searchDialog.dialogRef}
            isClosing={searchDialog.isClosing}
            onCloseAction={searchDialog.close}
          />
        </Suspense>
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
