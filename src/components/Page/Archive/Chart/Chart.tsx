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
    <Root>
      <Container>
        {years.map((year) => {
          const percent = `${Math.min((archives[year].length / totalPosts) * 100 * CHART_SCALE, 100).toFixed(0)}%`;

          return (
            <ChartItem key={year} style={{ '--percent': percent } as React.CSSProperties}>
              <Anchor
                aria-label={`${year}年の記事一覧（${archives[year].length}件）`}
                className={AnchorStyle}
                href={`#${year}年`}
              >
                <span>{year}</span>
              </Anchor>
            </ChartItem>
          );
        })}
      </Container>
    </Root>
  );
};

const Root = styled.div`
  width: 100%;
  container-type: inline-size;
`;

const Container = styled.div`
  display: grid;
  gap: var(--spacing-½);

  @container (min-width: 600px) {
    grid-auto-columns: 1fr;
    grid-auto-flow: column;
    height: var(--spacing-5);
    overflow-x: auto;
  }
`;

const ChartItem = styled.div`
  @container (min-width: 600px) {
    min-width: 5cap;
  }
`;

const AnchorStyle = css`
  --fill: var(--colors-gray-100);

  display: grid;
  gap: var(--spacing-½);
  width: 100%;
  height: 100%;
  font-size: var(--font-sizes-sm);
  font-variant-numeric: tabular-nums;
  line-height: var(--line-heights-sm);
  color: var(--colors-gray-700);

  & > span,
  &::before {
    grid-area: 1 / 1;
  }

  & > span {
    align-self: end;
    justify-self: center;
  }

  &::before {
    align-self: end;
    width: var(--percent);
    height: 100%;
    content: '';
    background: var(--fill);
    border-radius: var(--radii-4);
    transition: background 0.2s var(--easings-ease-out-expo);

    @container (min-width: 600px) {
      width: 100%;
      height: var(--percent);
    }
  }

  &:hover {
    --fill: var(--colors-gray-200);

    color: var(--colors-gray-900);
  }

  &:active,
  &:focus-visible {
    --fill: var(--colors-gray-300);
  }
`;
