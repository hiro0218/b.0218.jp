import { css } from '@/ui/styled';

// postLayoutFrame と postLayoutFooter の、幅・格子・列間・中央寄せの宣言を、一方だけ変えない。
// 記事ページでは本文とフッターが同じ枠に載り、ロゴと記事の左端がそろうため
/** 目次の列を padding-inline-end で空けない。目次を格子の列として置けない。列の幅・位置を二重に持つため。 */
export const postLayoutFrame = css`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  width: var(--sizes-container-lg);
  margin-inline: auto;

  @media (--isPostTwoColumn) {
    grid-template-columns: var(--post-layout-columns);
    column-gap: var(--post-layout-gap);
    justify-content: center;
  }
`;

/**
 * display: grid の Container に重ねて使う。
 * AppLayout に記事ページかを渡さない。フッターの配置を AppLayout と Footer で二重に持ち、全ページの Layout の分岐が増えるため。
 */
export const postLayoutFooter = css`
  :root:has([data-post-layout]) & {
    width: var(--sizes-container-lg);
    max-width: none;

    @media (--isPostTwoColumn) {
      grid-template-columns: var(--post-layout-columns);
      column-gap: var(--post-layout-gap);
      justify-content: center;
    }

    & > * {
      grid-column: 1;
    }
  }
`;
