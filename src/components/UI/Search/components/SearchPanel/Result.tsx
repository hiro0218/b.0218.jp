import { useMemo } from 'react';
import { css, styled } from '@/ui/styled';
import type { SearchResultItem } from '../../types';
import { SearchResultMessage } from './Meta';
import { NavigableLink } from './NavigableLink';

export function Result({
  suggestions,
  markedTitles,
  focusedIndex,
  setResultRef,
  keyword = '',
}: {
  suggestions: SearchResultItem[];
  markedTitles: string[];
  focusedIndex: number;
  setResultRef: (index: number, element: HTMLDivElement | null) => void;
  keyword?: string;
}) {
  const resultRefCallbacks = useMemo(
    () =>
      suggestions.map((_, refIndex) => {
        return (element: HTMLDivElement | null) => {
          setResultRef(refIndex, element);
        };
      }),
    [suggestions, setResultRef],
  );

  const ResultList = useMemo(() => {
    return suggestions.map(({ slug, matchedIn }, index) => {
      const isFocused = focusedIndex === index;

      return (
        <NavigableLink
          isFocused={isFocused}
          key={slug}
          matchedIn={matchedIn}
          ref={resultRefCallbacks[index]}
          slug={slug}
          title={markedTitles[index]}
        />
      );
    });
  }, [suggestions, markedTitles, focusedIndex, resultRefCallbacks]);

  return (
    <Container data-search-results>
      <SearchResultMessage resultsCount={suggestions.length} searchQuery={keyword} />
      {ResultList.length > 0 && <div>{ResultList}</div>}
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

export const LinkContainerStyle = css`
  cursor: pointer;
  user-select: none;
  border-radius: var(--radii-8);

  &:not([tabindex='-1']):hover {
    background-color: var(--colors-gray-a-3);
  }
`;

export const FocusedContainerStyle = css`
  background-color: var(--colors-gray-3);
  box-shadow: inset 0 0 0 2px var(--colors-blue-9);
`;

export const AnchorStyle = css`
  display: flex;
  gap: var(--spacing-2);
  align-items: center;
  padding: var(--spacing-1) var(--spacing-2);
  font-size: var(--font-sizes-sm);
  border-radius: var(--radii-8);

  &:hover {
    background-color: var(--colors-gray-a-3);
  }

  &:active {
    background-color: var(--colors-gray-a-4);
  }

  &:focus {
    outline: none;
    background-color: transparent;
  }

  svg {
    flex-shrink: 0;
    fill: var(--colors-gray-11);
  }
`;
