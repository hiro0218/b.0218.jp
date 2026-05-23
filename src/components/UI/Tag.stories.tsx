import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { PostTag } from '@/components/UI/Tag';

const meta = {
  title: 'UI/Tag',
  component: PostTag,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof PostTag>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * タグ名のみのシンプルな表示。記事詳細ページのタグ一覧に使用する。
 *
 * @summary タグ名のみのシンプルな表示
 */
export const Default: Story = {
  name: '基本',
  args: {
    tags: [{ slug: 'TypeScript' }, { slug: 'React' }, { slug: 'Next.js' }],
  },
};

/**
 * 各タグに記事数を併記する。タグ一覧ページに使用する。
 *
 * @summary 各タグに記事数を併記する
 */
export const WithCounts: Story = {
  name: '件数付き',
  args: {
    tags: [
      { slug: 'TypeScript', count: 15 },
      { slug: 'React', count: 12 },
      { slug: 'CSS', count: 8 },
      { slug: 'Next.js', count: 5 },
    ],
  },
};

/**
 * タグページへのリンク付き。クリックでタグ別記事一覧に遷移する。
 *
 * @summary タグページへのリンク付き
 */
export const Navigable: Story = {
  name: 'リンク付き',
  args: {
    tags: [
      { slug: 'TypeScript', count: 15, isNavigable: true },
      { slug: 'React', count: 12, isNavigable: true },
      { slug: 'CSS', count: 8, isNavigable: true },
    ],
  },
};

/**
 * リンク付きとテキストのみが混在する実運用パターン。
 *
 * @summary リンク付きとテキストのみが混在する実運用パターン
 */
export const Mixed: Story = {
  name: '混在',
  args: {
    tags: [
      { slug: 'TypeScript', count: 15, isNavigable: true },
      { slug: 'React', isNavigable: false },
      { slug: 'CSS', count: 8, isNavigable: true },
    ],
  },
};

/**
 * 空配列の場合。コンポーネントは null を返す。
 *
 * @summary 空配列の場合
 */
export const Empty: Story = {
  name: '空配列',
  args: {
    tags: [],
  },
};
