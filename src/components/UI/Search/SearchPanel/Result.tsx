import { memo, useMemo } from 'react';
import { Anchor } from '@/components/UI/Anchor';
import type { SearchProps } from '@/components/UI/Search/type';
import { convertPostSlugToPath } from '@/lib/url';
import { css, styled } from '@/ui/styled/static';

export const Result = memo(function Result({
  suggestions,
  markedTitles,
}: {
  suggestions: SearchProps[];
  markedTitles: string[];
}) {
  const ResultList = useMemo(() => {
    return suggestions.map(({ slug }, index) => {
      const link = convertPostSlugToPath(slug);
      return (
        <Anchor
          className={AnchorStyle}
          dangerouslySetInnerHTML={{ __html: markedTitles[index] }}
          href={link}
          key={slug}
          prefetch={false}
        />
      );
    });
  }, [suggestions, markedTitles]);

  return <Container>{ResultList}</Container>;
});

const Container = styled.div`
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

const AnchorStyle = css`
  display: block;
  padding: var(--space-1) var(--space-2);
  font-size: var(--font-size-sm);
  border-radius: var(--border-radius-8);

  &:hover {
    background-color: var(--color-gray-3);
  }

  &:active {
    background-color: var(--color-gray-4);
  }
`;
