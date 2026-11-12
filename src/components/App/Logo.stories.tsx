import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Logo } from '@/components/App/Logo';

const meta = {
  // title を App/Logo に改めない。VRT が id の接頭辞 ui- で対象を絞り、基準画像の名前も id から決まるため
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
