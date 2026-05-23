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
 * 標準サイズ（50px）。コンテンツ領域の読み込み中表示に置く。
 *
 * @summary 標準サイズ 50px
 */
export const Default: Story = {
  name: '基本',
};

/**
 * 24px。ボタン内やインライン文中の即時フィードバックに置く小型版。
 *
 * @summary 小型 24px
 */
export const Small: Story = {
  name: '小サイズ',
  args: { size: 24 },
};

/**
 * 80px。初回ロードなど画面全体に置いて待機を明示する大型版。
 *
 * @summary 大型 80px
 */
export const Large: Story = {
  name: '大サイズ',
  args: { size: 80 },
};

/**
 * size prop が computed style の `width` に反映されることを検証する標本。プレビュー環境のスタイル適用が壊れていないことの保証。
 *
 * @summary size → computed style 反映の検証
 */
export const CssCheck: Story = {
  tags: ['!manifest'],
  name: 'CSS 反映検証',
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const status = canvas.getByRole('status');
    const svg = status.firstElementChild;
    if (!svg) throw new Error('Spinner svg not rendered');
    expect(getComputedStyle(svg).width).toBe('50px');
  },
};
