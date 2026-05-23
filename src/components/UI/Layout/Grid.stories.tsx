import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { DemoBox } from '@/stories/_internal/DemoBox';

import { Grid } from './Grid';

const defaultChildren = (
  <>
    <DemoBox minHeight="50px">記事 — 01</DemoBox>
    <DemoBox color="var(--colors-green-200)" minHeight="50px">
      記事 — 02
    </DemoBox>
    <DemoBox color="var(--colors-red-200)" minHeight="50px">
      記事 — 03
    </DemoBox>
    <DemoBox color="var(--colors-blue-300)" minHeight="50px">
      記事 — 04
    </DemoBox>
  </>
);

const meta = {
  title: 'UI/Layout/Grid',
  component: Grid,
  args: {
    children: defaultChildren,
  },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 列数を固定して整列させる基本形。サイドバー付き 2 カラムや、要素数が偶数で揃うダッシュボードに使う。
 *
 * @summary 固定列数
 */
export const Default: Story = {
  name: '基本',
};

/**
 * 記事カードを列数固定で整列させる派生。要素数が列数の倍数になる前提で構造を作るときに選ぶ。
 *
 * @summary 3 カラム固定
 */
export const ThreeColumns: Story = {
  name: '3カラム',
  args: {
    columns: 3,
    gap: 2,
    children: (
      <>
        <DemoBox minHeight="50px">記事 — 01</DemoBox>
        <DemoBox color="var(--colors-green-200)" minHeight="50px">
          記事 — 02
        </DemoBox>
        <DemoBox color="var(--colors-red-200)" minHeight="50px">
          記事 — 03
        </DemoBox>
        <DemoBox color="var(--colors-blue-300)" minHeight="50px">
          記事 — 04
        </DemoBox>
        <DemoBox color="var(--colors-green-300)" minHeight="50px">
          記事 — 05
        </DemoBox>
        <DemoBox color="var(--colors-red-300)" minHeight="50px">
          記事 — 06
        </DemoBox>
      </>
    ),
  },
};

/**
 * `auto-fit + minmax` で要素の最小幅だけ決めるレスポンシブ派生。breakpoint を切らずに列数が自然に増減する。
 *
 * @summary auto-fit による可変列
 */
export const AutoFit: Story = {
  name: 'auto-fit',
  args: {
    columns: 'auto-fit',
    minItemWidth: '12rem',
    gap: 2,
    children: (
      <>
        <DemoBox minHeight="50px">記事 — 01</DemoBox>
        <DemoBox color="var(--colors-green-200)" minHeight="50px">
          記事 — 02
        </DemoBox>
        <DemoBox color="var(--colors-red-200)" minHeight="50px">
          記事 — 03
        </DemoBox>
        <DemoBox color="var(--colors-blue-300)" minHeight="50px">
          記事 — 04
        </DemoBox>
        <DemoBox color="var(--colors-green-300)" minHeight="50px">
          記事 — 05
        </DemoBox>
      </>
    ),
  },
};

/**
 * `gap` を広く取って、カード同士を独立した塊として読ませる派生。情報密度を下げて呼吸感を作りたい一覧で使う。
 *
 * @summary 広い gap
 */
export const WithGap: Story = {
  name: '広い gap',
  args: { gap: 5 },
};
