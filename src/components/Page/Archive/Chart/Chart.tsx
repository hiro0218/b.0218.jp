import type { ArchiveListProps } from '@/app/(ArchivePage)/archive/libs';
import { Anchor } from '@/components/UI/Anchor';
import { css, styled } from '@/ui/styled';

type Props = {
  totalPosts: number;
  archives: ArchiveListProps;
};

export const Chart = ({ archives, totalPosts }: Props) => {
  const yearPercentages: Record<string, string> = {};
  for (const year of Object.keys(archives)) {
    const thisPosts = archives[year].length;
    yearPercentages[year] = `${(Math.round((thisPosts / totalPosts) * 100000) / 100).toFixed(2)}%`;
  }

  return (
    <Container>
      {Object.keys(archives).map((year) => {
        const percentage = yearPercentages[year];

        return (
          <ChartItem key={year} style={{ '--percent': percentage } as React.CSSProperties}>
            <Anchor className={AnchorStyle} href={`#${year}年`}>
              {year}
            </Anchor>
          </ChartItem>
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  gap: var(--spacing-½);
  height: var(--spacing-5);
  overflow-x: scroll;

  @media (--isMobile) {
    flex-direction: column;
    align-items: start;
    width: 100%;
    height: auto;
  }
`;

const ChartItem = styled.div`
  /* V8最適化: CSS変数を保持するラッパー要素 */
  display: contents;
`;

const AnchorStyle = css`
  --fill: var(--colors-gray-100);
  --direction: to top;

  position: relative;
  display: flex;
  align-items: end;
  justify-content: center;
  min-width: 5cap;
  height: 100%;
  font-size: var(--font-sizes-xs);
  font-variant-numeric: tabular-nums;
  line-height: var(--line-heights-sm);
  color: var(--colors-gray-900);
  background: linear-gradient(var(--direction), var(--fill) var(--percent), transparent var(--percent));

  @media (--isMobile) {
    --direction: to right;

    width: 100%;
    padding: var(--spacing-1) var(--spacing-½);
    font-size: var(--font-sizes-sm);
  }

  &:hover {
    --fill: var(--colors-gray-200);
  }

  &:active,
  &:focus-visible {
    --fill: var(--colors-gray-300);
  }
`;
