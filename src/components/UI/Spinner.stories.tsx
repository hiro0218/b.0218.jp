import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';

import { Spinner } from '@/components/UI/Spinner';

const meta = {
  title: 'UI/Spinner',
  component: Spinner,
} satisfies Meta<typeof Spinner>;

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

export const CssCheck: Story = {
  tags: ['ai-generated', '!manifest'],
  name: 'CSS インラインスタイル検証',
  parameters: {
    docs: {
      description: {
        story:
          'Spinner が size prop からインラインスタイルで svg の幅と高さを設定することを computed style で証明する。プレビュー環境がコンポーネントの DOM とスタイルを正しく適用している証拠とする。',
      },
    },
  },
  play: ({ canvasElement }) => {
    const svg = canvasElement.querySelector('svg');
    if (!svg) throw new Error('Spinner svg not rendered');
    expect(getComputedStyle(svg).width).toBe('50px');
  },
};
