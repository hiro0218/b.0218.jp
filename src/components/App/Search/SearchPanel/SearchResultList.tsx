import { useEffect, useRef } from 'react';
import { styled } from '@/ui/styled';
import type { SearchResultItem as SearchResultItemType } from '../types';
import { createSearchResultId } from '../utils/resultId';
import { SearchResultItem } from './SearchResultItem';
import type { TitleSegment } from './utils/markEscapedHTML';

type SearchResultListProps = {
  results: SearchResultItemType[];
  markedTitles: TitleSegment[][];
  focusedIndex: number;
  listId: string;
  onResultMouseEnter: (index: number) => void;
  setResultRef: (index: number, element: HTMLDivElement | null) => void;
  onLinkClick?: () => void;
};

export function SearchResultList({
  results,
  markedTitles,
  focusedIndex,
  listId,
  onResultMouseEnter,
  setResultRef,
  onLinkClick,
}: SearchResultListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sizerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const sizer = sizerRef.current;
    if (!container || !sizer || typeof ResizeObserver === 'undefined') return;

    let frameId: number | undefined;
    const updateHeight = () => {
      if (frameId !== undefined) {
        cancelAnimationFrame(frameId);
      }

      frameId = requestAnimationFrame(() => {
        container.style.setProperty('--search-list-height', `${sizer.offsetHeight.toFixed(1)}px`);
      });
    };

    const observer = new ResizeObserver(updateHeight);
    observer.observe(sizer);
    updateHeight();

    return () => {
      if (frameId !== undefined) {
        cancelAnimationFrame(frameId);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <Container aria-label="検索結果" data-search-results id={listId} ref={containerRef} role="listbox">
      <Sizer ref={sizerRef}>
        {results.map(({ slug, matchedIn }, index) => (
          <SearchResultItem
            id={createSearchResultId(slug)}
            index={index}
            isFocused={focusedIndex === index}
            key={slug}
            matchedIn={matchedIn}
            onLinkClick={onLinkClick}
            onMouseEnter={onResultMouseEnter}
            ref={(element) => setResultRef(index, element)}
            slug={slug}
            titleSegments={markedTitles[index]}
          />
        ))}
      </Sizer>
    </Container>
  );
}

const Container = styled.div`
  height: var(--search-list-height, auto);
  max-height: var(--search-content-max-height);
  padding: 0;
  overflow-x: clip;
  overflow-y: auto;
  scroll-padding-block: var(--spacing-1);
  transition: height var(--transition-slow);

  &:not(:empty) {
    padding: var(--spacing-½) var(--spacing-1);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const Sizer = styled.div`
  display: grid;
  gap: var(--spacing-1);
`;
