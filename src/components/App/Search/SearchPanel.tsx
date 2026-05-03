import { useMemo } from 'react';

import { styled } from '@/ui/styled';
import { SearchEmptyState } from './SearchPanel/SearchEmptyState';
import { SearchFooter } from './SearchPanel/SearchFooter';
import { SearchResultList } from './SearchPanel/SearchResultList';
import { SearchResultMessage } from './SearchPanel/SearchResultMessage';
import { SearchStatus } from './SearchPanel/SearchStatus';
import { createMarkedTitles } from './SearchPanel/utils/markEscapedHTML';
import type { SearchResultItem } from './types';

type SearchPanelProps = {
  results: SearchResultItem[];
  searchQuery: string;
  focusedIndex: number;
  setResultRef: (index: number, element: HTMLDivElement | null) => void;
  onLinkClick?: () => void;
};

/**
 * 検索パネル
 *
 * @description
 * 検索結果の表示を統括するコンポーネント。
 * - 空状態の管理
 * - 検索結果のサマリー表示
 * - 検索結果リストの表示
 * - フッター表示
 */
export function SearchPanel({ results, searchQuery, focusedIndex, setResultRef, onLinkClick }: SearchPanelProps) {
  const markedTitles = useMemo(() => createMarkedTitles(results, searchQuery), [results, searchQuery]);
  const hasResults = results.length > 0;

  return (
    <SearchMain aria-atomic="true" aria-label="サイト内検索" aria-live="polite" role="search">
      <SearchStatus resultsCount={results.length} searchQuery={searchQuery} />

      {hasResults ? (
        <>
          <SearchResultMessage resultsCount={results.length} searchQuery={searchQuery} />
          <SearchResultList
            focusedIndex={focusedIndex}
            markedTitles={markedTitles}
            onLinkClick={onLinkClick}
            results={results}
            setResultRef={setResultRef}
          />
        </>
      ) : (
        <SearchEmptyState searchQuery={searchQuery} />
      )}

      <SearchFooter searchQuery={searchQuery} />
    </SearchMain>
  );
}

const SearchMain = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
