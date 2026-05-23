import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Anchor } from '@/components/UI/Anchor';

const meta = {
  title: 'UI/Anchor',
  component: Anchor,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Anchor>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * サイト内リンクの基本形。Next.js Link でクライアントサイドナビゲーションを行う。
 *
 * @summary サイト内リンクの基本形
 */
export const Default: Story = {
  name: '基本',
  args: {
    href: '/example',
    children: 'リンクテキスト',
  },
};

/**
 * title 属性でホバー時にリンク先の補足情報を表示する。
 *
 * @summary title 属性でホバー時にリンク先の補足情報を表示する
 */
export const WithTitle: Story = {
  name: 'title 属性付き',
  args: {
    href: '/example',
    title: 'サンプルリンク',
    children: 'タイトル付きリンク',
  },
};

/**
 * 外部 URL へのリンク。ドメインが異なる場合に自動で外部リンク扱いになる。
 *
 * @summary 外部 URL へのリンク
 */
export const ExternalLink: Story = {
  name: '外部リンク',
  args: {
    href: 'https://example.com',
    children: '外部リンク',
  },
};
