import Link from 'next/link';
import { css, styled } from '@/ui/styled';

/** Chart は並べ替えない。渡された順で出すので、新しい年を先に渡す */
export type YearPostCount = { year: string; postCount: number };

type Props = {
  totalPosts: number;
  years: YearPostCount[];
};

/** ページ内の他セクションから年別一覧へ戻るためのアンカー ID。href 側と id 側で共有する。 */
export const YEAR_INDEX_ANCHOR_ID = '年別一覧';

/** 年別セクションの見出しの id と、チャートのリンクの行き先を、別々に組み立てない。ずれるとリンクが切れるため、この関数に集める */
export function yearAnchorId(year: string) {
  return `${year}年`;
}

export const Chart = ({ years, totalPosts }: Props) => {
  if (years.length === 0) {
    return null;
  }

  // バー幅は最多の年を基準に正規化する。
  const maxPostCount = Math.max(...years.map(({ postCount }) => postCount));

  return (
    // tabIndex=-1: Next.js のハッシュ遷移は着地要素へ scrollIntoView 後に focus() を呼ぶが、
    // <nav> は tabindex なしでは focus 不能で no-op になる。それを可能にし、キーボード操作でも
    // 年見出し横の戻るリンク（↑）を押した後の次の Tab がこの一覧内から続くようにする。
    <Root aria-label={`年別アーカイブ（全${totalPosts}件）`} id={YEAR_INDEX_ANCHOR_ID} tabIndex={-1}>
      <Container>
        {years.map(({ year, postCount }) => {
          const percent = `${((postCount / maxPostCount) * 100).toFixed(2)}%`;

          return (
            <ChartItem key={year} style={{ '--percent': percent } as React.CSSProperties}>
              <Link
                aria-label={`${year}年の記事一覧（${postCount}件）`}
                className={AnchorStyle}
                href={`#${yearAnchorId(year)}`}
              >
                <span data-part="year">{year}</span>
                <span data-part="count">{postCount} posts</span>
              </Link>
            </ChartItem>
          );
        })}
      </Container>
    </Root>
  );
};

const Root = styled.nav`
  width: 100%;
  /* 年のマスの列数と中の並びの切り替えを、timelineGrid（PostTimeline・Hero の格子）と別の幅にしない。
     コンテナ幅 40rem の切り替えがずれると、年別チャートと記事の行で、列の変わる位置が食い違うため */
  container-type: inline-size;
  /* 固定ヘッダーの高さ分だけジャンプ先をずらし、先頭行がヘッダーに隠れないようにする */
  scroll-margin-top: var(--sizes-header);
`;

const Container = styled.ol`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--spacing-100);
  padding: 0;
  margin: 0;
  list-style: none;

  @container (min-width: 40rem) {
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: var(--spacing-200);
  }
`;

const ChartItem = styled.li`
  min-width: 0;

  @container (min-width: 40rem) {
    grid-column: span 3;
  }
`;

const AnchorStyle = css`
  --fill: var(--colors-gray-a-100);

  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  /* 余った高さは上下に分けず、下に空ける。年の位置を行でそろえるため */
  align-content: start;
  align-items: center;
  width: 100%;
  height: 100%;
  min-height: var(--sizes-touch-target);
  /* 狭い幅は右の余白を取らない。取ると、4 列の細いマスで 2 桁の件数（約 54px）が折り返すため */
  padding: var(--spacing-100) 0 var(--spacing-100) var(--spacing-100);
  overflow: hidden;
  font-size: var(--font-sizes-sm);
  font-variant-numeric: tabular-nums;
  line-height: var(--grid-line-height-sm);
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

  /* 件数は white-space: nowrap にしない。文字の間隔を広げて幅に収まらなくなっても、「26」「posts」の 2 行に折り返してマスの中に収まる。
     nowrap のまま overflow: hidden を外さない。件数が隣のマスに重なるため */
  & > [data-part='count'] {
    grid-column: 1;
    line-height: var(--grid-line-height-body);
    color: var(--colors-gray-900);
  }

  @container (min-width: 40rem) {
    grid-template-columns: max-content 1fr;
    column-gap: var(--spacing-75);
    padding: var(--spacing-100) var(--spacing-300);

    & > [data-part='count'] {
      grid-column: 2;
      justify-self: end;
    }
  }

  &:hover {
    --fill: var(--colors-gray-a-200);

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
