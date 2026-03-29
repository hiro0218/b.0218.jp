import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Stack } from './Stack';

const DemoBox = ({ children, color = 'var(--colors-blue-200)' }: { children: React.ReactNode; color?: string }) => (
  <div style={{ background: color, padding: '1rem', borderRadius: '4px' }}>{children}</div>
);

const defaultChildren = (
  <>
    <DemoBox>要素 1</DemoBox>
    <DemoBox color="var(--colors-green-200)">要素 2</DemoBox>
    <DemoBox color="var(--colors-red-200)">要素 3</DemoBox>
  </>
);

const meta = {
  title: 'UI/Layout/Stack',
  component: Stack,
  tags: ['autodocs'],
  args: {
    children: defaultChildren,
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: '基本' };

export const Horizontal: Story = {
  name: '横方向',
  args: {
    direction: 'horizontal',
  },
};

export const CustomGap: Story = {
  name: 'カスタム gap',
  args: {
    gap: 5,
  },
};

export const WithAlignment: Story = {
  name: '配置指定',
  args: {
    direction: 'horizontal',
    align: 'center',
    justify: 'space-between',
  },
};

export const WithWrap: Story = {
  name: '折り返し',
  args: {
    direction: 'horizontal',
    wrap: 'wrap',
    gap: 2,
    children: (
      <>
        <DemoBox>折り返し 1</DemoBox>
        <DemoBox color="var(--colors-green-200)">折り返し 2</DemoBox>
        <DemoBox color="var(--colors-red-200)">折り返し 3</DemoBox>
        <DemoBox color="var(--colors-blue-300)">折り返し 4</DemoBox>
        <DemoBox color="var(--colors-green-300)">折り返し 5</DemoBox>
        <DemoBox color="var(--colors-red-300)">折り返し 6</DemoBox>
      </>
    ),
  },
};

export const AsList: Story = {
  name: 'ul 要素',
  args: {
    as: 'ul',
    gap: 1,
    children: (
      <>
        <li>
          <DemoBox>リスト項目 1</DemoBox>
        </li>
        <li>
          <DemoBox color="var(--colors-green-200)">リスト項目 2</DemoBox>
        </li>
        <li>
          <DemoBox color="var(--colors-red-200)">リスト項目 3</DemoBox>
        </li>
      </>
    ),
  },
};

export const AlignCenter: Story = {
  name: '中央揃え',
  args: {
    direction: 'horizontal',
    align: 'center',
    children: (
      <>
        <DemoBox>小さい</DemoBox>
        <DemoBox color="var(--colors-green-200)">
          <div style={{ paddingBlock: '2rem' }}>大きい要素</div>
        </DemoBox>
        <DemoBox color="var(--colors-red-200)">中くらい</DemoBox>
      </>
    ),
  },
};

export const JustifyEnd: Story = {
  name: '右寄せ',
  args: {
    direction: 'horizontal',
    justify: 'flex-end',
  },
};

export const NoGap: Story = {
  name: 'gap なし',
  args: {
    gap: 0,
  },
};
