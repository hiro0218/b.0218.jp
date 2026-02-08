import type { ArchiveListProps } from '@/app/(ArchivePage)/archive/_lib';
import { Anchor } from '@/components/UI/Anchor';
import { css, styled } from '@/ui/styled';

type Props = {
  totalPosts: number;
  archives: ArchiveListProps;
};

export const Chart = ({ archives, totalPosts }: Props) => {
  const years = Object.keys(archives);
  const yearPercentages: Record<string, string> = {};

  for (const year of years) {
    const thisPosts = archives[year].length;
    yearPercentages[year] = `${(Math.round((thisPosts / totalPosts) * 100000) / 100).toFixed(2)}%`;
  }

  return (
    <Container>
      {years.map((year) => {
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
  flex-direction: column;
  gap: var(--spacing-½);
  align-items: start;
  width: 100%;
  container-type: inline-size;

  @container (min-width: 600px) {
    flex-direction: row;
    align-items: stretch;
    width: auto;
    height: var(--spacing-5);
    overflow-x: scroll;
  }
`;

const ChartItem = styled.div`
  /* V8最適化: CSS変数を保持するラッパー要素 */
  display: contents;
`;

const AnchorStyle = css`
  --fill: var(--colors-gray-100);
  --direction: to right;

  position: relative;
  display: flex;
  align-items: end;
  justify-content: center;
  width: 100%;
  min-width: 5cap;
  height: 100%;
  padding: clamp(0px, 0.5vw, var(--spacing-1)) clamp(0px, 0.5vw, var(--spacing-½));
  font-size: clamp(var(--font-sizes-xs), 1.2vw, var(--font-sizes-sm));
  font-variant-numeric: tabular-nums;
  line-height: var(--line-heights-sm);
  color: var(--colors-gray-900);
  background: linear-gradient(var(--direction), var(--fill) var(--percent), transparent var(--percent));

  @container (min-width: 600px) {
    --direction: to top;

    width: auto;
  }

  &:hover {
    --fill: var(--colors-gray-200);
  }

  &:active,
  &:focus-visible {
    --fill: var(--colors-gray-300);
  }
`;
