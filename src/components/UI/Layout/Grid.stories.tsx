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

export const Default: Story = {
  name: '基本',
  parameters: {
    docs: {
      description: {
        story: '2 カラムグリッドの基本形。',
      },
    },
  },
};

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
  parameters: {
    docs: {
      description: {
        story: '3 カラムグリッド。カード一覧等に使用する。',
      },
    },
  },
};

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
  parameters: {
    docs: {
      description: {
        story: '幅に応じてカラム数が自動調整される。レスポンシブなカード一覧に最適。',
      },
    },
  },
};

export const WithGap: Story = {
  name: '広い gap',
  args: {
    gap: 5,
  },
  parameters: {
    docs: {
      description: {
        story: '広い gap を指定したグリッド。',
      },
    },
  },
};
