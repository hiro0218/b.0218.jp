import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Skeleton } from '@/components/UI/Skeleton';

const meta = {
  title: 'UI/Skeleton',
  component: Skeleton,
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 幅・高さともにデフォルト値（100% / 1em）。テキスト1行分の読み込み中表示に置く。
 *
 * @summary 標準（テキスト1行相当）
 */
export const Default: Story = {
  name: '基本',
};

/**
 * 高さを持たせた大型版。画像やカード全体の読み込み中表示に置く。
 *
 * @summary 画像・カード相当の大型
 */
export const Block: Story = {
  name: 'ブロック要素',
  args: { height: '200px' },
};
