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
  listId: string;
  onResultMouseEnter: (index: number) => void;
  setResultRef: (index: number, element: HTMLDivElement | null) => void;
  onLinkClick?: () => void;
};

export function SearchPanel({
  results,
  searchQuery,
  focusedIndex,
  listId,
  onResultMouseEnter,
  setResultRef,
  onLinkClick,
}: SearchPanelProps) {
  const markedTitles = createMarkedTitles(results, searchQuery);
  const hasResults = results.length > 0;

  return (
    <SearchMain aria-label="サイト内検索">
      <SearchStatus resultsCount={results.length} searchQuery={searchQuery} />

      {hasResults ? (
        <>
          <SearchResultMessage resultsCount={results.length} searchQuery={searchQuery} />
          <SearchResultList
            focusedIndex={focusedIndex}
            listId={listId}
            markedTitles={markedTitles}
            onLinkClick={onLinkClick}
            onResultMouseEnter={onResultMouseEnter}
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

const SearchMain = styled.search`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
