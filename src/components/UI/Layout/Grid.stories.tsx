import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { DemoBox } from '@/stories/_internal/DemoBox';

import { Grid } from './Grid';

const defaultChildren = (
  <>
    <DemoBox minHeight="50px">セル 1</DemoBox>
    <DemoBox color="var(--colors-green-200)" minHeight="50px">
      セル 2
    </DemoBox>
    <DemoBox color="var(--colors-red-200)" minHeight="50px">
      セル 3
    </DemoBox>
    <DemoBox color="var(--colors-blue-300)" minHeight="50px">
      セル 4
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
 * カラム数を固定して要素を整列させたいときの最小構成。サイドバー付き 2 カラムや、構造が安定したダッシュボードの分割表示で使う。
 *
 * @summary カラム数を固定して要素を整列させたいときの最小構成
 */
export const Default: Story = {
  name: '基本',
};

/**
 * 記事カードや製品カードなど、固定の列数で整然と並べたいときに使用する。要素数が列数の倍数になることが想定できるレイアウトで使う。
 *
 * @summary 記事カードや製品カードなど、固定の列数で整然と並べたいときに使用する
 */
export const ThreeColumns: Story = {
  name: '3カラム',
  args: {
    columns: 3,
    gap: 2,
    children: (
      <>
        <DemoBox minHeight="50px">セル 1</DemoBox>
        <DemoBox color="var(--colors-green-200)" minHeight="50px">
          セル 2
        </DemoBox>
        <DemoBox color="var(--colors-red-200)" minHeight="50px">
          セル 3
        </DemoBox>
        <DemoBox color="var(--colors-blue-300)" minHeight="50px">
          セル 4
        </DemoBox>
        <DemoBox color="var(--colors-green-300)" minHeight="50px">
          セル 5
        </DemoBox>
        <DemoBox color="var(--colors-red-300)" minHeight="50px">
          セル 6
        </DemoBox>
      </>
    ),
  },
};

/**
 * breakpoint を切らずに、要素の最小幅だけ決めてレスポンシブ対応したいときに使用する。要素数が可変で、画面幅に応じて自然に列数を増減させたい一覧で使う。
 *
 * @summary breakpoint を切らずに、要素の最小幅だけ決めてレスポンシブ対応したいときに使用する
 */
export const AutoFit: Story = {
  name: 'auto-fit',
  args: {
    columns: 'auto-fit',
    minItemWidth: '12rem',
    gap: 2,
    children: (
      <>
        <DemoBox minHeight="50px">自動 1</DemoBox>
        <DemoBox color="var(--colors-green-200)" minHeight="50px">
          自動 2
        </DemoBox>
        <DemoBox color="var(--colors-red-200)" minHeight="50px">
          自動 3
        </DemoBox>
        <DemoBox color="var(--colors-blue-300)" minHeight="50px">
          自動 4
        </DemoBox>
        <DemoBox color="var(--colors-green-300)" minHeight="50px">
          自動 5
        </DemoBox>
      </>
    ),
  },
};

/**
 * カード同士を視覚的に独立した塊として読ませたいときに使用する。情報密度を下げて要素間に呼吸感を持たせたい一覧で使う。
 *
 * @summary カード同士を視覚的に独立した塊として読ませたいときに使用する
 */
export const WithGap: Story = {
  name: '広い gap',
  args: {
    gap: 5,
  },
};
