import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { DemoBox } from '@/stories/_internal/DemoBox';

import { Container } from './Container';

const meta = {
  title: 'UI/Layout/Container',
  component: Container,
  args: {
    children: <DemoBox>コンテナ内のコンテンツ — max-width による幅制限を確認</DemoBox>,
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '基本（一覧）',
  parameters: {
    docs: {
      description: {
        story:
          '記事一覧・トップページなど、情報をスキャンするブラウジング向けレイアウトに使用する。size 省略時のフォールバックでもある。',
      },
    },
  },
};

export const Small: Story = {
  name: '小サイズ（記事本文）',
  args: {
    size: 'small',
  },
  parameters: {
    docs: {
      description: {
        story: '記事本文など、1 行あたりの文字数を絞りたい集中読書向けレイアウトに使用する。',
      },
    },
  },
};

export const Large: Story = {
  name: '大サイズ（サイトchrome）',
  args: {
    size: 'large',
  },
  parameters: {
    docs: {
      description: {
        story: 'サイトヘッダーなど、両端まで要素を配置したい全幅 chrome レイアウトに使用する。',
      },
    },
  },
};

export const WithoutSpace: Story = {
  name: '余白なし',
  args: {
    space: false,
  },
  parameters: {
    docs: {
      description: {
        story: '左右の余白を無効にする。親要素が余白を管理する場合に使用する。',
      },
    },
  },
};
