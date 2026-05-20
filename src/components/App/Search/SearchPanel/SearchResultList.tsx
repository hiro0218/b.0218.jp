import { styled } from '@/ui/styled';
import type { SearchResultItem as SearchResultItemType } from '../types';
import { SearchResultItem } from './SearchResultItem';

type SearchResultListProps = {
  results: SearchResultItemType[];
  markedTitles: string[];
  focusedIndex: number;
  setResultRef: (index: number, element: HTMLDivElement | null) => void;
  onLinkClick?: () => void;
};

export function SearchResultList({
  results,
  markedTitles,
  focusedIndex,
  setResultRef,
  onLinkClick,
}: SearchResultListProps) {
  return (
    <Container data-search-results>
      {results.map(({ slug, matchedIn }, index) => (
        <SearchResultItem
          isFocused={focusedIndex === index}
          key={slug}
          matchedIn={matchedIn}
          onLinkClick={onLinkClick}
          ref={(element) => setResultRef(index, element)}
          slug={slug}
          title={markedTitles[index]}
        />
      ))}
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  gap: var(--spacing-1);
  max-height: var(--search-content-max-height);
  padding: 0;
  overflow-x: clip;
  overflow-y: auto;

  &:not(:empty) {
    padding: var(--spacing-½) var(--spacing-1);
  }
`;
