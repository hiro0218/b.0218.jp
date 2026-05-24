import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Logo } from '@/components/UI/Logo';

const meta = {
  title: 'UI/Logo',
  component: Logo,
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * グローバルヘッダーに置くサイト識別ロゴ。クリックでトップへ戻る役割を持つ。
 *
 * @summary ヘッダー設置のサイトロゴ
 */
export const Default: Story = {
  name: '基本',
};
