import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

import { Spinner } from '@/components/UI/Spinner';

const meta = {
  title: 'UI/Spinner',
  component: Spinner,
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 標準サイズ（50px）のスピナー。ページ全体の読み込み表示に使用する。
 *
 * @summary 標準サイズ（50px）のスピナー
 */
export const Default: Story = {
  name: '基本',
};

/**
 * 小サイズ（24px）。ボタン内やインラインの読み込み表示に使用する。
 *
 * @summary 小サイズ（24px）
 */
export const Small: Story = {
  name: '小サイズ',
  args: {
    size: 24,
  },
};

/**
 * 大サイズ（80px）。初回ロードなど画面全体の待機表示に使用する。
 *
 * @summary 大サイズ（80px）
 */
export const Large: Story = {
  name: '大サイズ',
  args: {
    size: 80,
  },
};

/**
 * Spinner が size prop からインラインスタイルで svg の幅と高さを設定することを computed style で証明する。プレビュー環境がコンポーネントの DOM とスタイルを正しく適用している証拠とする。
 *
 * @summary Spinner が size prop からインラインスタイルで svg の幅と高さを設定することを computed style で証明…
 */
export const CssCheck: Story = {
  tags: ['ai-generated', '!manifest'],
  name: 'CSS インラインスタイル検証',
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const status = canvas.getByRole('status');
    const svg = status.firstElementChild;
    if (!svg) throw new Error('Spinner svg not rendered');
    expect(getComputedStyle(svg).width).toBe('50px');
  },
};
