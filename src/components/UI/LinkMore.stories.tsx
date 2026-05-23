import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { LinkMore } from '@/components/UI/LinkMore';

const meta = {
  title: 'UI/LinkMore',
  component: LinkMore,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof LinkMore>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的な「もっと見る」リンク。一覧ページへの遷移に使用する。
 *
 * @summary 基本的な「もっと見る」リンク
 */
export const Default: Story = {
  name: '基本',
  args: {
    href: '/posts',
    text: 'もっと見る',
  },
};

/**
 * 遷移先の範囲を明確にしたい一覧リンクで使用する。タグ別記事一覧など、短い「もっと見る」だけでは文脈が不足する場合に使う。
 *
 * @summary 文脈を含む長いリンク文言
 */
export const WithLongText: Story = {
  name: '長いテキスト',
  args: {
    href: '/tags/typescript',
    text: 'TypeScript の記事をすべて見る',
  },
};

/**
 * 同一サイト内の一覧ではなく、外部リソースへ誘導する導線として使用する。
 *
 * @summary 外部リソースへの導線
 */
export const ExternalLink: Story = {
  name: '外部リンク',
  args: {
    href: 'https://example.com',
    text: '外部サイトへ',
  },
};
