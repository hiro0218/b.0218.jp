import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Logo } from '@/components/UI/Logo';

const meta = {
  title: 'UI/Logo',
  component: Logo,
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * サイトロゴの基本表示。ヘッダーに配置しトップページへのリンクとして機能する。
 *
 * @summary サイトロゴの基本表示
 */
export const Default: Story = {
  name: '基本',
};
