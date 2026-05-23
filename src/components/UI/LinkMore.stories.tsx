import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { LinkMore } from '@/components/UI/LinkMore';

const meta = {
  title: 'UI/LinkMore',
  component: LinkMore,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof LinkMore>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * セクション末尾に置く一覧導線。トップページから記事一覧へ送り出すなど、文脈が自明な箇所で使う。
 *
 * @summary 短文の「もっと見る」
 */
export const Default: Story = {
  name: '基本',
  args: {
    href: '/posts',
    text: 'もっと見る',
  },
};

/**
 * 短い「もっと見る」では行き先が伝わらない場面で文脈を込める派生。タグ別アーカイブやカテゴリ別一覧などで使う。
 *
 * @summary 文脈付き導線
 */
export const WithLongText: Story = {
  name: '文脈付き',
  args: {
    href: '/tags/typescript',
    text: 'TypeScript の記事をすべて見る',
  },
};

/**
 * 外部リソースへ送る派生。サイト内では完結しない参考実装や仕様書への導線として使う。
 *
 * @summary 外部リソースへの導線
 */
export const ExternalLink: Story = {
  name: '外部リンク',
  args: {
    href: 'https://html.spec.whatwg.org/',
    text: 'HTML Living Standard を読む',
  },
};
