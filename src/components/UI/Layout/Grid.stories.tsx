import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Grid } from './Grid';

const DemoBox = ({ children, color = 'var(--colors-blue-200)' }: { children: React.ReactNode; color?: string }) => (
  <div style={{ background: color, padding: '1rem', borderRadius: '4px', minHeight: '50px' }}>{children}</div>
);

const defaultChildren = (
  <>
    <DemoBox>セル 1</DemoBox>
    <DemoBox color="var(--colors-green-200)">セル 2</DemoBox>
    <DemoBox color="var(--colors-red-200)">セル 3</DemoBox>
    <DemoBox color="var(--colors-blue-300)">セル 4</DemoBox>
  </>
);

const meta = {
  title: 'UI/Layout/Grid',
  component: Grid,
  tags: ['autodocs'],
  args: {
    children: defaultChildren,
  },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: '基本' };

export const ThreeColumns: Story = {
  name: '3カラム',
  args: {
    columns: 3,
    gap: 2,
    children: (
      <>
        <DemoBox>セル 1</DemoBox>
        <DemoBox color="var(--colors-green-200)">セル 2</DemoBox>
        <DemoBox color="var(--colors-red-200)">セル 3</DemoBox>
        <DemoBox color="var(--colors-blue-300)">セル 4</DemoBox>
        <DemoBox color="var(--colors-green-300)">セル 5</DemoBox>
        <DemoBox color="var(--colors-red-300)">セル 6</DemoBox>
      </>
    ),
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
        <DemoBox>自動 1</DemoBox>
        <DemoBox color="var(--colors-green-200)">自動 2</DemoBox>
        <DemoBox color="var(--colors-red-200)">自動 3</DemoBox>
        <DemoBox color="var(--colors-blue-300)">自動 4</DemoBox>
        <DemoBox color="var(--colors-green-300)">自動 5</DemoBox>
      </>
    ),
  },
};

export const WithGap: Story = {
  name: '広い gap',
  args: {
    gap: 5,
  },
};
