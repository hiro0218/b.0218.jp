import { memo, useId, useMemo } from 'react';
import { css, styled } from '@/ui/styled';
import type { SearchProps } from '../../types';
import { NavigableLink } from './NavigableLink';

export const Result = memo(function Result({
  suggestions,
  markedTitles,
  focusedIndex,
  setResultRef,
  keyword = '',
}: {
  suggestions: SearchProps[];
  markedTitles: string[];
  focusedIndex: number;
  setResultRef: (index: number, element: HTMLDivElement | null) => void;
  keyword?: string;
}) {
  const headingId = useId();
  const ResultList = useMemo(() => {
    return suggestions.map(({ slug }, index) => {
      const isFocused = focusedIndex === index;

      return (
        <NavigableLink
          isFocused={isFocused}
          key={slug}
          ref={(el) => setResultRef(index, el)}
          slug={slug}
          title={markedTitles[index]}
        />
      );
    });
  }, [suggestions, markedTitles, focusedIndex, setResultRef]);

  return (
    <Container aria-labelledby={headingId} data-search-results>
      <Message id={headingId}>
        {suggestions.length > 0
          ? keyword
            ? `「${keyword}」の検索結果: ${suggestions.length}件`
            : `検索結果: ${suggestions.length}件`
          : keyword
            ? `「${keyword}」に一致する記事は見つかりませんでした。`
            : '検索キーワードを入力してください。'}
      </Message>
      {ResultList.length > 0 && <div>{ResultList}</div>}
    </Container>
  );
});

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
  outline: 2px solid var(--colors-blue-9);
  outline-offset: -2px;
  background-color: var(--colors-gray-3);
`;

export const AnchorStyle = css`
  display: block;
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
`;

const Message = styled.div`
  padding: var(--spacing-½);
  font-size: var(--font-sizes-xs);
  font-weight: var(--font-weights-bold);
  line-height: var(--line-heights-xs);
  color: var(--colors-gray-9);
`;
