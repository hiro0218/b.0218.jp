import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Cluster } from './Cluster';

const DemoBox = ({ children, color = 'var(--colors-blue-200)' }: { children: React.ReactNode; color?: string }) => (
  <div style={{ background: color, padding: '0.5rem 1rem', borderRadius: '4px' }}>{children}</div>
);

const defaultChildren = (
  <>
    <DemoBox>タグ 1</DemoBox>
    <DemoBox color="var(--colors-green-200)">タグ 2</DemoBox>
    <DemoBox color="var(--colors-red-200)">タグ 3</DemoBox>
    <DemoBox color="var(--colors-blue-300)">タグ 4</DemoBox>
    <DemoBox color="var(--colors-green-300)">タグ 5</DemoBox>
  </>
);

const meta = {
  title: 'UI/Layout/Cluster',
  component: Cluster,
  tags: ['autodocs'],
  args: {
    children: defaultChildren,
  },
} satisfies Meta<typeof Cluster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: '基本' };

export const WideGap: Story = {
  name: '広い gap',
  args: {
    gap: 5,
  },
};

export const Wide: Story = {
  name: '均等配分',
  args: {
    isWide: true,
    children: (
      <>
        <DemoBox>均等配分</DemoBox>
        <DemoBox color="var(--colors-green-200)">均等配分</DemoBox>
        <DemoBox color="var(--colors-red-200)">均等配分</DemoBox>
      </>
    ),
  },
};

export const AsNav: Story = {
  name: 'nav 要素',
  args: {
    as: 'nav',
    gap: 2,
    children: (
      <>
        <DemoBox>ホーム</DemoBox>
        <DemoBox color="var(--colors-green-200)">概要</DemoBox>
        <DemoBox color="var(--colors-red-200)">お問い合わせ</DemoBox>
      </>
    ),
  },
};
