import { memo, useMemo } from 'react';

import { styled } from '@/ui/styled';
import type { SearchResultItem } from '../../types';
import { createMarkedTitles } from './libs/markEscapedHTML';
import { SearchExternalLink, SearchStatus } from './Meta';
import { Result } from './Result';

type SearchPanelProps = {
  results: SearchResultItem[];
  searchQuery: string;
  focusedIndex: number;
  setResultRef: (index: number, element: HTMLDivElement | null) => void;
};

export const SearchPanel = memo(function SearchPanel({
  results,
  searchQuery,
  focusedIndex,
  setResultRef,
}: SearchPanelProps) {
  const markedTitles = useMemo(() => createMarkedTitles(results, searchQuery), [results, searchQuery]);

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
