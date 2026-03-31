import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Loading } from './index';

const meta = {
  title: 'UI/Loading',
  component: Loading,
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '基本',
  parameters: {
    docs: {
      description: {
        story: '標準サイズ（50px）のスピナー。ページ全体の読み込み表示に使用する。',
      },
    },
  },
};

export const Small: Story = {
  name: '小サイズ',
  args: {
    size: 24,
  },
  parameters: {
    docs: {
      description: {
        story: '小サイズ（24px）。ボタン内やインラインの読み込み表示に使用する。',
      },
    },
  },
};

export const Large: Story = {
  name: '大サイズ',
  args: {
    size: 80,
  },
  parameters: {
    docs: {
      description: {
        story: '大サイズ（80px）。初回ロードなど画面全体の待機表示に使用する。',
      },
    },
  },
};
