import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { PostTag } from '@/components/Page/_shared/Tag';

const meta = {
  // title を Page/Tag に改めない。VRT が id の接頭辞 ui- で対象を絞り、基準画像の名前も id から決まるため
  title: 'UI/Tag',
  component: PostTag,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof PostTag>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 記事詳細ページに置くタグ列。タグ名だけのテキスト表示で、件数や遷移リンクは持たない。本文の流れに収まる小さい形（chip）にする。
 *
 * @summary 記事詳細のタグ列
 */
export const Default: Story = {
  name: '基本',
  args: {
    size: 'chip',
    tags: [{ slug: 'TypeScript' }, { slug: 'Biome' }, { slug: '設計' }],
  },
};

/**
 * タグ一覧ページに置く形式。件数を併記して全体規模が見える状態にする。一覧の主な操作なので大きい形（pill）にする。
 *
 * @summary 件数併記のタグ一覧
 */
export const WithCounts: Story = {
  name: '件数付き',
  args: {
    size: 'pill',
    tags: [
      { slug: 'TypeScript', count: 27 },
      { slug: 'CSS', count: 19 },
      { slug: 'AI', count: 14 },
      { slug: 'Next.js', count: 11 },
    ],
  },
};

/**
 * クリックでタグ別アーカイブに飛ぶ遷移付き。記事詳細のフッターやサイドバーで他の関連記事へ広げる動線なので、関連タグと同じ大きい形（pill）にする。
 *
 * @summary タグ別アーカイブへの導線
 */
export const Navigable: Story = {
  name: 'リンク付き',
  args: {
    size: 'pill',
    tags: [
      { slug: 'TypeScript', count: 27, isNavigable: true },
      { slug: 'CSS', count: 19, isNavigable: true },
      { slug: 'AI', count: 14, isNavigable: true },
    ],
  },
};

/**
 * 一部のタグだけ遷移可能にする運用パターン。記事詳細の隣接表示などで、自身に紐づくタグはテキストのままにする。記事の冒頭と同じ小さい形（chip）にする。
 *
 * @summary 自タグはテキスト、他はリンク
 */
export const Mixed: Story = {
  name: 'リンク混在',
  args: {
    size: 'chip',
    tags: [
      { slug: 'TypeScript', count: 27, isNavigable: true },
      { slug: 'Biome', isNavigable: false },
      { slug: '設計', count: 8, isNavigable: true },
    ],
  },
};

/**
 * 空配列のときに何も描画しないことを確認する標本。タグ未設定の記事レイアウトに穴を空けないため。
 *
 * @summary 空配列でレンダーしない
 */
export const Empty: Story = {
  name: '空配列',
  args: { size: 'chip', tags: [] },
};
