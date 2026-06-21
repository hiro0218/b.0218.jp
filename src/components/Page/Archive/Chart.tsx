import { Anchor } from '@/components/UI/Anchor';
import type { ArchivesByYear } from '@/types/source';
import { css, styled } from '@/ui/styled';

type Props = {
  totalPosts: number;
  archives: ArchivesByYear;
};

export const Chart = ({ archives, totalPosts }: Props) => {
  const years = Object.keys(archives).toReversed();

  if (years.length === 0) {
    return null;
  }

  return (
    <Root aria-label={`年別アーカイブ（全${totalPosts}件）`}>
      <Container>
        {years.map((year) => {
          const postCount = archives[year].length;
          const percent = `${((postCount / totalPosts) * 100).toFixed(2)}%`;

          return (
            <ChartItem key={year} style={{ '--percent': percent } as React.CSSProperties}>
              <Anchor aria-label={`${year}年の記事一覧（${postCount}件）`} className={AnchorStyle} href={`#${year}年`}>
                <span data-part="year">{year}</span>
                <span data-part="count">{postCount} posts</span>
              </Anchor>
            </ChartItem>
          );
        })}
      </Container>
    </Root>
  );
};

const Root = styled.nav`
  width: 100%;
`;

const Container = styled.ol`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
  gap: var(--spacing-1);
  padding: 0;
  margin: 0;
  list-style: none;
`;

const ChartItem = styled.li`
  min-width: 0;
`;

const AnchorStyle = css`
  --fill: var(--colors-gray-100);

  position: relative;
  display: grid;
  grid-template-columns: max-content 1fr;
  column-gap: var(--spacing-1);
  align-items: center;
  width: 100%;
  min-height: var(--sizes-touch-target);
  padding: var(--spacing-1) var(--spacing-2);
  overflow: hidden;
  font-size: var(--font-sizes-sm);
  font-variant-numeric: tabular-nums;
  line-height: var(--line-heights-sm);
  color: var(--colors-gray-700);
  touch-action: manipulation;
  background-color: var(--colors-gray-a-50);
  border-radius: var(--radii-sm);
  isolation: isolate;
  transition:
    color var(--transition-normal),
    background-color var(--transition-normal),
    transform var(--transition-normal);

  &::before {
    position: absolute;
    inset: 0 auto 0 0;
    z-index: -1;
    width: var(--percent);
    content: '';
    background-color: var(--fill);
    transition: background-color var(--transition-normal);
  }

  & > [data-part='year'] {
    grid-column: 1;
    color: var(--colors-gray-900);
  }

  & > [data-part='count'] {
    grid-column: 2;
    justify-self: end;
    color: var(--colors-gray-600);
    white-space: nowrap;
  }

  &:hover {
    --fill: var(--colors-gray-200);

    color: var(--colors-gray-900);
    background-color: var(--colors-gray-a-75);
  }

  &:active {
    --fill: var(--colors-gray-300);

    color: var(--colors-gray-1000);
    background-color: var(--colors-gray-a-100);
    transform: scale(0.98);
  }

  &:focus-visible {
    --fill: var(--colors-gray-300);

    color: var(--colors-gray-1000);
    background-color: var(--colors-gray-a-100);
    transition: none;
  }

  &:focus-visible::before {
    transition: none;
  }
`;
