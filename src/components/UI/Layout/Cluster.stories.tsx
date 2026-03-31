import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { DemoBox } from '@/stories/_internal/DemoBox';

import { Cluster } from './Cluster';

const defaultChildren = (
  <>
    <DemoBox compact>タグ 1</DemoBox>
    <DemoBox color="var(--colors-green-200)">タグ 2</DemoBox>
    <DemoBox color="var(--colors-red-200)">タグ 3</DemoBox>
    <DemoBox color="var(--colors-blue-300)">タグ 4</DemoBox>
    <DemoBox color="var(--colors-green-300)">タグ 5</DemoBox>
  </>
);

const meta = {
  title: 'UI/Layout/Cluster',
  component: Cluster,
  args: {
    children: defaultChildren,
  },
} satisfies Meta<typeof Cluster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '基本',
  parameters: {
    docs: {
      description: {
        story: '横方向に折り返す要素の集まり。タグやバッジの一覧に使用する。',
      },
    },
  },
};

export const WideGap: Story = {
  name: '広い gap',
  args: {
    gap: 5,
  },
  parameters: {
    docs: {
      description: {
        story: 'gap を広げて要素間の余白を増やす。',
      },
    },
  },
};

export const Wide: Story = {
  name: '均等配分',
  args: {
    isWide: true,
    children: (
      <>
        <DemoBox compact>均等配分</DemoBox>
        <DemoBox color="var(--colors-green-200)">均等配分</DemoBox>
        <DemoBox color="var(--colors-red-200)">均等配分</DemoBox>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '子要素を均等幅に配分する。ナビゲーション等に使用する。',
      },
    },
  },
};

export const AsNav: Story = {
  name: 'nav 要素',
  args: {
    as: 'nav',
    gap: 2,
    children: (
      <>
        <DemoBox compact>ホーム</DemoBox>
        <DemoBox color="var(--colors-green-200)">概要</DemoBox>
        <DemoBox color="var(--colors-red-200)">お問い合わせ</DemoBox>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'nav 要素として描画する。ナビゲーションのセマンティクスが必要な場合に使用する。',
      },
    },
  },
};
