import { styled } from '@/ui/styled';
import type { SearchResultItem } from '../types';
import { SearchResultMessage } from './Meta';
import { NavigableLink } from './NavigableLink';

export function Result({
  suggestions,
  markedTitles,
  focusedIndex,
  setResultRef,
  keyword = '',
  onLinkClick,
}: {
  suggestions: SearchResultItem[];
  markedTitles: string[];
  focusedIndex: number;
  setResultRef: (index: number, element: HTMLDivElement | null) => void;
  keyword?: string;
  onLinkClick?: () => void;
}) {
  return (
    <Container data-search-results>
      <SearchResultMessage resultsCount={suggestions.length} searchQuery={keyword} />
      {suggestions.length > 0 && (
        <div>
          {suggestions.map(({ slug, matchedIn }, index) => (
            <NavigableLink
              isFocused={focusedIndex === index}
              key={slug}
              matchedIn={matchedIn}
              onLinkClick={onLinkClick}
              ref={(element) => setResultRef(index, element)}
              slug={slug}
              title={markedTitles[index]}
            />
          ))}
        </div>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  gap: var(--spacing-1);
  max-height: 50vh;
  padding: 0;
  margin: 0;
  overflow-x: clip;
  overflow-y: auto;

  &:not(:empty) {
    padding: var(--spacing-½) var(--spacing-1);
  }

  @media (--isMobile) {
    max-height: 60vh;
  }
`;
