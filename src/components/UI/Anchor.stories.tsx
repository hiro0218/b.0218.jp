import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Anchor } from '@/components/UI/Anchor';

const meta = {
  title: 'UI/Anchor',
  component: Anchor,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Anchor>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * サイト内遷移の基本形。Next.js の `Link` でクライアントサイド遷移する。
 *
 * @summary サイト内リンクの基本
 */
export const Default: Story = {
  name: '基本',
  args: {
    href: '/posts',
    children: '記事一覧へ',
  },
};

/**
 * `title` 属性でホバー時に補足テキストを出す派生。リンク文言だけでは行き先が伝わりにくいときに足す。
 *
 * @summary ホバー補足付き
 */
export const WithTitle: Story = {
  name: 'title 属性付き',
  args: {
    href: '/posts/202605021758',
    title: '[TypeScript] パフォーマンスとAI AgentのためにBarrelファイルを廃止する',
    children: '関連記事',
  },
};

/**
 * 外部ドメインへの導線。Next.js の `Link` は外部 URL でも `<a>` を描画するが、クライアント遷移は同一オリジン内に限られる。Anchor 自身はドメイン判定や rel 付与をしないため、必要な属性は呼び出し側で添える。
 *
 * @summary 外部ドメインへの導線
 */
export const ExternalLink: Story = {
  name: '外部リンク',
  args: {
    href: 'https://html.spec.whatwg.org/',
    children: 'HTML Living Standard',
  },
};
