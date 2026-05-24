import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

import { LinkPreview } from '@/components/UI/LinkPreview';

function placeholder(w: number, h: number): string {
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect fill="#e2e8f0" width="${w}" height="${h}"/><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" fill="#64748b" font-size="14">${w}×${h}</text></svg>`,
  )}`;
}

const Thumbnail = placeholder(120, 120);

const meta = {
  title: 'UI/LinkPreview',
  component: LinkPreview,
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
  args: {
    link: 'https://html.spec.whatwg.org/',
    card: 'summary',
    thumbnail: Thumbnail,
    title: 'HTML Living Standard',
    description: 'WHATWG が編纂する HTML の単一の仕様。「HTML5」のバージョン区切りに代わる現行標準。',
    domain: 'html.spec.whatwg.org',
  },
} satisfies Meta<typeof LinkPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 記事本文中で外部リンクを OGP カード形式に展開する標準形。サムネイル付きの `summary` レイアウト。
 *
 * @summary OGP カードの標準
 */
export const Default: Story = {
  name: '基本',
};

/**
 * サムネイルが取得できなかったときの描画。本文領域が全幅に広がる。
 *
 * @summary サムネイル取得失敗時
 */
export const WithoutThumbnail: Story = {
  name: 'サムネイルなし',
  args: { thumbnail: '' },
};

/**
 * OGP の `summary_large_image` 形式。広いコンテナで `description` まで読ませたいときに使う。
 *
 * @summary 大画像カード
 */
export const LargeImage: Story = {
  name: '大画像カード',
  args: { card: 'summary_large_image' },
};

/**
 * `&lt;script&gt;` のようなエンティティを正しくデコードして描画することの検証。OGP 取得時のエスケープが二重にならない保証。
 *
 * @summary HTML エンティティのデコード検証
 */
export const HtmlEntitiesInTitle: Story = {
  tags: ['ai-generated', '!manifest'],
  name: 'エンティティ含むタイトル',
  args: {
    title: '&lt;script&gt; タグと &amp; を含む例',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('<script> タグと & を含む例')).toBeVisible();
  },
};
