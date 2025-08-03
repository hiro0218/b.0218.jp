import { forwardRef, memo, useMemo } from 'react';
import { Anchor } from '@/components/UI/Anchor';
import type { SearchProps } from '@/components/UI/Search/type';
import { convertPostSlugToPath } from '@/lib/url';
import { css, cx, styled } from '@/ui/styled/static';

const NavigableLink = forwardRef<
  HTMLDivElement,
  {
    slug: string;
    title: string;
    isFocused: boolean;
    onClick: () => void;
  }
>(({ slug, title, isFocused, onClick }, ref) => {
  const link = convertPostSlugToPath(slug);

  return (
    <div
      className={isFocused ? cx(LinkContainerStyle, FocusedContainerStyle) : LinkContainerStyle}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      ref={ref}
      tabIndex={isFocused ? 0 : -1}
    >
      <Anchor className={AnchorStyle} dangerouslySetInnerHTML={{ __html: title }} href={link} prefetch={false} />
    </div>
  );
});

NavigableLink.displayName = 'NavigableLink';

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
  const ResultList = useMemo(() => {
    return suggestions.map(({ slug }, index) => {
      const isFocused = focusedIndex === index;

      return (
        <NavigableLink
          isFocused={isFocused}
          key={slug}
          onClick={() => {
            const link = convertPostSlugToPath(slug);
            window.location.href = link;
          }}
          ref={(el) => setResultRef(index, el)}
          slug={slug}
          title={markedTitles[index]}
        />
      );
    });
  }, [suggestions, markedTitles, focusedIndex, setResultRef]);

  return (
    <Container aria-labelledby="search-results-heading" data-search-results>
      <Message id="search-results-heading">
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
  gap: var(--space-1);
  max-height: 50vh;
  padding: 0;
  margin: 0;
  overflow-x: clip;
  overflow-y: auto;

  &:not(:empty) {
    padding: var(--space-½) var(--space-1);
  }

  @media (--isMobile) {
    max-height: 60vh;
  }
`;

const LinkContainerStyle = css`
  cursor: pointer;
  border-radius: var(--radii-8);

  &:hover {
    background-color: var(--colors-gray-3);
  }

  &:focus {
    outline: none;
  }
`;

const FocusedContainerStyle = css`
  outline: 2px solid var(--colors-blue-9);
  outline-offset: -2px;
  background-color: var(--colors-gray-3);
`;

const AnchorStyle = css`
  display: block;
  padding: var(--space-1) var(--space-2);
  font-size: var(--font-size-sm);
  pointer-events: none;
  border-radius: var(--radii-8);

  &:active {
    background-color: var(--colors-gray-4);
  }

  &:focus {
    outline: none;
    background-color: transparent;
  }
`;

const Message = styled.div`
  padding: var(--space-½);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weights-bold);
  line-height: var(--line-heights-xs);
  color: var(--colors-gray-9);
`;
