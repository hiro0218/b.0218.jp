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
  name: '基本',
  parameters: {
    docs: {
      description: {
        story: 'デフォルトサイズのコンテナ。max-width で幅を制限し中央配置する。',
      },
    },
  },
};

export const Small: Story = {
  name: '小サイズ',
  args: {
    size: 'small',
  },
  parameters: {
    docs: {
      description: {
        story: '狭い max-width のコンテナ。記事本文等の読みやすい幅に使用する。',
      },
    },
  },
};

export const Large: Story = {
  name: '大サイズ',
  args: {
    size: 'large',
  },
  parameters: {
    docs: {
      description: {
        story: '広い max-width のコンテナ。ダッシュボード等の幅広レイアウトに使用する。',
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
