'use client';

import { useEffect, useState } from 'react';
import { loadAndInitializeSearch } from '@/components/App/Search/engine/searchDataLoader';
import type { SearchDialog } from '@/components/App/Search/SearchDialog';
import { SearchTrigger } from '@/components/App/Search/SearchTrigger';
import { Container } from '@/components/UI/Layout/Container';
import { Logo } from '@/components/UI/Logo';
import { css, styled } from '@/ui/styled';
import { Layout } from './Header/Layout';
import { HeaderNavigation } from './Header/Navigation';
import { useSearchDialog } from './SearchDialogContext';

const importSearchDialog = () => import('@/components/App/Search/SearchDialog');

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
  const [LoadedSearchDialog, setLoadedSearchDialog] = useState<typeof SearchDialog | null>(null);

  // / キーの経路は SearchDialogContext 内にありここから見えない。click と合わせて 1 か所で扱うため、
  // isOpen を見て、開いた時点で未読み込みなら読み込む。
  // Why not: React.lazy と Suspense。fallback を一度出すと、先読み済みでも React の throttle
  // (FALLBACK_THROTTLE_MS = 300)で表示が約 300 ms 遅れる(実測: click と / キーのどちらも約 315 ms)。
  // Why not: 失敗の放置。isOpen が残ると描画の待機が終わらず、/ キーも「開いている」と判定されて再試行できない。
  // 失敗したら閉じる。閉じる途中は読み込まない(close() の再描画で effect が再実行され、二重に取得するため)。
  useEffect(() => {
    if (!searchDialog.isOpen || searchDialog.isClosing || LoadedSearchDialog) return;

    importSearchDialog()
      .then((m) => setLoadedSearchDialog(() => m.SearchDialog))
      .catch((error) => {
        console.error('Failed to load SearchDialog:', error);
        searchDialog.close();
      });
  }, [LoadedSearchDialog, searchDialog]);

  return (
    <>
      <Layout>
        <Container className={HeaderContainerStyle} size={'large'} space={false}>
          <LogoContainer>
            <Logo />
          </LogoContainer>
          <NavigationGroup>
            <HeaderNavigation />
            <SearchTrigger onPrefetch={prefetchSearchDialog} openDialogAction={searchDialog.open} />
          </NavigationGroup>
        </Container>
      </Layout>

      {LoadedSearchDialog && (searchDialog.isOpen || searchDialog.isClosing) ? (
        <LoadedSearchDialog
          dialogRef={searchDialog.dialogRef}
          isClosing={searchDialog.isClosing}
          onCloseAction={searchDialog.close}
        />
      ) : null}
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

const LogoContainer = styled.div`
  display: flex;
  flex-shrink: 0;
`;

const NavigationGroup = styled.div`
  display: flex;
  gap: var(--spacing-100);
  align-items: center;

  /* デスクトップではナビリンク同士の間隔（Nav の gap-400）と検索ボタンの間隔をそろえる */
  @media (--isDesktop) {
    gap: var(--spacing-400);
  }
`;
