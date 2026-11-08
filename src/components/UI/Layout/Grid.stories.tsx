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
 * アイテムの最小幅だけを決め、幅に応じて列数が自然に増減する基本形。breakpoint を切らずに記事カードなどを並べたいときに使う。
 *
 * @summary 幅に応じて列数が変わる
 */
export const Default: Story = {
  name: '基本',
};

/**
 * 最小幅を狭めて、同じ幅でも列数を増やす派生。カードより小さい要素（タグ・サムネイル）を並べるときに使う。
 *
 * @summary 最小幅の指定
 */
export const AutoFit: Story = {
  name: '最小幅の指定',
  args: {
    minItemWidth: '12rem',
    gap: 300,
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
