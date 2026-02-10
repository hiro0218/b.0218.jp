import type { ArchiveListProps } from '@/app/(ArchivePage)/archive/_lib';
import { Anchor } from '@/components/UI/Anchor';
import { css, styled } from '@/ui/styled';

type Props = {
  totalPosts: number;
  archives: ArchiveListProps;
};

/** 小さな割合でもバーが視認できるよう、パーセント値を拡大するスケール係数。100%を超えると全面塗りつぶしになる */
const CHART_SCALE = 10;

export const Chart = ({ archives, totalPosts }: Props) => {
  const years = Object.keys(archives);

  return (
    <Wrapper>
      <Container>
        {years.map((year) => {
          const percent = `${((archives[year].length / totalPosts) * 100 * CHART_SCALE).toFixed(0)}%`;

          return (
            <ChartItem key={year} style={{ '--percent': percent } as React.CSSProperties}>
              <Anchor className={AnchorStyle} href={`#${year}年`}>
                {year}
              </Anchor>
            </ChartItem>
          );
        })}
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  container-type: inline-size;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-½);

  @container (min-width: 600px) {
    flex-direction: row;
    height: var(--spacing-5);
    overflow-x: auto;
  }
`;

const ChartItem = styled.div`
  flex: none;

  @container (min-width: 600px) {
    flex: 1;
    min-width: 5cap;
  }
`;

const AnchorStyle = css`
  --fill: var(--colors-gray-100);
  --direction: to right;

  display: flex;
  align-items: end;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: var(--spacing-½);
  font-size: var(--font-sizes-sm);
  font-variant-numeric: tabular-nums;
  line-height: var(--line-heights-sm);
  color: var(--colors-gray-900);
  background: linear-gradient(var(--direction), var(--fill) var(--percent), transparent var(--percent));

  @container (min-width: 600px) {
    --direction: to top;
  }

  &:hover {
    --fill: var(--colors-gray-200);
  }

  &:active,
  &:focus-visible {
    --fill: var(--colors-gray-300);
  }
`;
