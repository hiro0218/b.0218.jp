import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ComponentProps } from 'react';

import { ArticleCard } from '@/components/UI/ArticleCard';
import { StoryFrame, StoryGrid, StoryStack, StoryWidth } from '@/stories/_internal/StorySurface';

const EXAMPLE_LINK = '/posts/example-post';

const DEFAULT_ARTICLE_ARGS = {
  link: EXAMPLE_LINK,
  title: 'TypeScript 5.0 の新機能まとめ',
  date: '2024-01-15',
} satisfies ComponentProps<typeof ArticleCard>;

const FULL_ARTICLE_ARGS = {
  link: EXAMPLE_LINK,
  title: 'Storybook v10 で Next.js アプリのコンポーネントカタログを構築する完全ガイド',
  date: '2024-01-15',
  updated: '2024-07-01',
  excerpt:
    'Storybook v10 の新機能を活用して、Next.js アプリケーションのコンポーネントカタログを効率的に構築する方法を詳しく解説します。',
  tags: ['Storybook', 'Next.js', 'React', 'Testing'],
  category: 'development',
} satisfies ComponentProps<typeof ArticleCard>;

const VARIANT_REFERENCES = [
  {
    title: '基本',
    caption: 'タイトルと投稿日だけをスキャンする一覧向け。',
    args: DEFAULT_ARTICLE_ARGS,
  },
  {
    title: '概要文付き',
    caption: '開く前に記事内容を判断したい一覧向け。',
    args: {
      link: EXAMPLE_LINK,
      title: 'Next.js App Router の設計パターン',
      date: '2024-02-20',
      excerpt:
        'App Router を使った実践的な設計パターンについて解説します。Server Components と Client Components の使い分けがポイントです。',
    },
  },
  {
    title: '更新日付き',
    caption: '公開後に内容を更新した記事の鮮度を一覧上でも伝える。',
    args: {
      link: EXAMPLE_LINK,
      title: 'CSS Container Queries の実践ガイド',
      date: '2024-01-01',
      updated: '2024-06-15',
      excerpt: 'Container Queries を使ったレスポンシブデザインの新しいアプローチを紹介します。',
    },
  },
  {
    title: 'カテゴリ付き',
    caption: '記事の大分類を一覧上で先に見分けたい場合に使う。',
    args: {
      link: EXAMPLE_LINK,
      title: 'Panda CSS でスタイリングを効率化する',
      date: '2024-04-01',
      category: 'development',
      tags: ['CSS', 'Panda CSS'],
    },
  },
] satisfies Array<{ title: string; caption: string; args: ComponentProps<typeof ArticleCard> }>;

const RESPONSIVE_REFERENCES = [
  {
    title: '300px',
    caption: 'カテゴリバッジが上部に移動し、タグは非表示になる。',
    inlineSize: '300px',
  },
  {
    title: '450px',
    caption: 'ヘッダーは横並びを維持し、タグは非表示になる。',
    inlineSize: '450px',
  },
  {
    title: '600px',
    caption: 'カテゴリ、概要文、タグまで含めた一覧カードの標準幅。',
    inlineSize: '600px',
  },
] as const;

const meta = {
  title: 'UI/ArticleCard',
  component: ArticleCard,
  args: DEFAULT_ARTICLE_ARGS,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <StoryWidth maxInlineSize="600px">
        <Story />
      </StoryWidth>
    ),
  ],
} satisfies Meta<typeof ArticleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 記事一覧でタイトルと投稿日だけを素早くスキャンさせたい場合に使用する。
 *
 * @summary 記事一覧でタイトルと投稿日だけを素早くスキャンさせたい場合に使用する
 */
export const Default: Story = {
  name: '基本',
};

/**
 * 記事の内容を開く前に判断できるよう、一覧ページで概要文を併記する場合に使用する。
 *
 * @summary 記事の内容を開く前に判断できるよう、一覧ページで概要文を併記する場合に使用する
 */
export const WithExcerpt: Story = {
  name: '概要文付き',
  args: {
    link: EXAMPLE_LINK,
    title: 'Next.js App Router の設計パターン',
    date: '2024-02-20',
    excerpt:
      'App Router を使った実践的な設計パターンについて解説します。Server Components と Client Components の使い分けがポイントです。',
  },
};

/**
 * 記事の分類を一覧上で補助したい場合に使用する。狭い幅では本文スキャンを優先する。
 *
 * @summary 記事の分類を一覧上で補助したい場合に使用する
 */
export const WithTags: Story = {
  name: 'タグ付き',
  args: {
    link: EXAMPLE_LINK,
    title: 'React 19 の新機能と移行ガイド',
    date: '2024-03-10',
    tags: ['React', 'TypeScript', 'Next.js'],
  },
};

/**
 * 公開後に内容を更新した記事で、鮮度を一覧上でも伝えたい場合に使用する。
 *
 * @summary 公開後に内容を更新した記事で、鮮度を一覧上でも伝えたい場合に使用する
 */
export const WithUpdatedDate: Story = {
  name: '更新日付き',
  args: {
    link: EXAMPLE_LINK,
    title: 'CSS Container Queries の実践ガイド',
    date: '2024-01-01',
    updated: '2024-06-15',
    excerpt: 'Container Queries を使ったレスポンシブデザインの新しいアプローチを紹介します。',
  },
};

/**
 * 記事の大分類を一覧上で先に見分けたい場合に使用する。Controls で分類を切り替えられる。
 *
 * @summary 記事の大分類を一覧上で先に見分けたい場合に使用する
 */
export const WithCategory: Story = {
  name: 'カテゴリ付き',
  args: {
    link: EXAMPLE_LINK,
    title: 'Panda CSS でスタイリングを効率化する',
    date: '2024-04-01',
    category: 'development',
    tags: ['CSS', 'Panda CSS'],
  },
  argTypes: {
    category: {
      control: 'select',
      options: ['development', 'technology', 'other'],
    },
  },
};

/**
 * 一覧ページのトップレベル見出しとして配置する場合に使用する。
 *
 * @summary 一覧ページのトップレベル見出しとして配置する場合に使用する
 */
export const WithTitleH2: Story = {
  name: 'h2 タイトル',
  args: {
    titleTagName: 'h2',
  },
};

/**
 * 全 Props を同時指定した場合の最大構成を確認するために使用する。
 *
 * @summary 全 Props を同時指定した場合の最大構成を確認するために使用する
 */
export const FullContent: Story = {
  tags: ['!manifest'],
  name: '全属性',
  args: FULL_ARTICLE_ARGS,
};

/**
 * 長いタイトルが一覧の視認性を壊さないことを確認するために使用する。
 *
 * @summary 長いタイトルが一覧の視認性を壊さないことを確認するために使用する
 */
export const LongTitle: Story = {
  tags: ['!manifest'],
  name: '長いタイトル',
  args: {
    link: EXAMPLE_LINK,
    title:
      'TypeScript と React Server Components を組み合わせたモダンなフルスタック Web アプリケーション開発の実践的アプローチについて詳しく解説する',
    date: '2024-01-15',
    excerpt: '非常に長いタイトルのテキストオーバーフローを確認するためのストーリーです。',
  },
};

/**
 * 狭い一覧枠でもカテゴリ、日付、タイトルが読めることを確認するために使用する。
 *
 * @summary 狭い一覧枠でもカテゴリ、日付、タイトルが読めることを確認するために使用する
 */
export const Narrow: Story = {
  tags: ['!manifest'],
  name: '幅 300px',
  args: {
    link: EXAMPLE_LINK,
    title: 'コンテナ幅 300px での表示確認',
    date: '2024-01-15',
    category: 'development',
    tags: ['React', 'TypeScript'],
    excerpt: 'コンテナ幅 320px 以下でカテゴリバッジが上部に移動し、480px 以下でタグが非表示になる。',
  },
  decorators: [
    (Story) => (
      <StoryWidth inlineSize="300px">
        <Story />
      </StoryWidth>
    ),
  ],
};

/**
 * 中間幅の一覧枠でヘッダーと本文の優先順位を確認するために使用する。
 *
 * @summary 中間幅の一覧枠でヘッダーと本文の優先順位を確認するために使用する
 */
export const Medium: Story = {
  tags: ['!manifest'],
  name: '幅 450px',
  args: {
    link: EXAMPLE_LINK,
    title: 'コンテナ幅 450px での表示確認',
    date: '2024-01-15',
    category: 'technology',
    tags: ['CSS', 'Container Queries'],
    excerpt: 'コンテナ幅 320px〜480px ではヘッダーは横並び、タグは非表示。',
  },
  decorators: [
    (Story) => (
      <StoryWidth inlineSize="450px">
        <Story />
      </StoryWidth>
    ),
  ],
};

/**
 * 一覧カードの代表的な構成差を同じ幅で比較するためのリファレンス。
 *
 * @summary 一覧カードの代表的な構成差を同じ幅で比較するためのリファレンス
 */
export const VariantReference: Story = {
  tags: ['!manifest'],
  name: '構成一覧',
  args: FULL_ARTICLE_ARGS,
  render: () => (
    <StoryGrid minItemWidth="20rem">
      {VARIANT_REFERENCES.map(({ title, caption, args }) => (
        <StoryFrame caption={caption} key={title} title={title}>
          <ArticleCard {...args} />
        </StoryFrame>
      ))}
    </StoryGrid>
  ),
};

/**
 * コンテナクエリによる情報の出し分けを幅別に確認するためのリファレンス。
 *
 * @summary コンテナクエリによる情報の出し分けを幅別に確認するためのリファレンス
 */
export const ResponsiveReference: Story = {
  tags: ['!manifest'],
  name: '幅別一覧',
  args: FULL_ARTICLE_ARGS,
  render: () => (
    <StoryStack>
      {RESPONSIVE_REFERENCES.map(({ title, caption, inlineSize }) => (
        <StoryFrame caption={caption} inlineSize={inlineSize} key={title} title={title}>
          <ArticleCard {...FULL_ARTICLE_ARGS} />
        </StoryFrame>
      ))}
    </StoryStack>
  ),
};
