import { memo, useCallback, useMemo } from 'react';

import { useRouteChangeComplete } from '@/hooks/useRouteChangeComplete';
import { styled } from '@/ui/styled';
import type { SearchProps } from '../../types';
import { createMarkedTitles } from './libs/markEscapedHTML';
import { SearchExternalLink, SearchStatus } from './Meta';
import { Result } from './Result';

type SearchPanelProps = {
  results: SearchProps[];
  searchQuery: string;
  focusedIndex: number;
  closeDialog: () => void;
  setResultRef: (index: number, element: HTMLDivElement | null) => void;
  closeOnRouteChange?: boolean;
};

export const SearchPanel = memo(function SearchPanel({
  results,
  searchQuery,
  focusedIndex,
  closeDialog,
  setResultRef,
  closeOnRouteChange = false,
}: SearchPanelProps) {
  const markedTitles = useMemo(() => createMarkedTitles(results, searchQuery), [results, searchQuery]);

  // 画面遷移時にダイアログを閉じるかどうかをオプションで制御
  // closeOnRouteChangeがfalseの場合は何もしない関数を渡す
  const handleRouteChange = useCallback(() => {
    if (closeOnRouteChange) {
      closeDialog();
    }
  }, [closeOnRouteChange, closeDialog]);

  useRouteChangeComplete(handleRouteChange);

  return (
    <SearchMain aria-atomic="true" aria-label="サイト内検索" aria-live="polite" data-search-results role="search">
      <SearchStatus resultsCount={results.length} searchQuery={searchQuery} />
      <Result
        focusedIndex={focusedIndex}
        keyword={searchQuery}
        markedTitles={markedTitles}
        setResultRef={setResultRef}
        suggestions={results}
      />
      <SearchExternalLink searchQuery={searchQuery} />
    </SearchMain>
  );
});

const SearchMain = styled.main`
  width: min(90vw, 640px);
  max-height: calc(60vh - var(--header-height));
  overflow-y: auto;
`;
