import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import ArticleCard from './index';

const meta = {
  title: 'UI/ArticleCard',
  component: ArticleCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ArticleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '基本',
  args: {
    link: '/posts/example-post',
    title: 'TypeScript 5.0 の新機能まとめ',
    date: '2024-01-15',
  },
};

export const WithExcerpt: Story = {
  name: '概要文付き',
  args: {
    link: '/posts/example-post',
    title: 'Next.js App Router の設計パターン',
    date: '2024-02-20',
    excerpt:
      'App Router を使った実践的な設計パターンについて解説します。Server Components と Client Components の使い分けがポイントです。',
  },
};

export const WithTags: Story = {
  name: 'タグ付き',
  args: {
    link: '/posts/example-post',
    title: 'React 19 の新機能と移行ガイド',
    date: '2024-03-10',
    tags: ['React', 'TypeScript', 'Next.js'],
  },
};

export const WithUpdatedDate: Story = {
  name: '更新日付き',
  args: {
    link: '/posts/example-post',
    title: 'CSS Container Queries の実践ガイド',
    date: '2024-01-01',
    updated: '2024-06-15',
    excerpt: 'Container Queries を使ったレスポンシブデザインの新しいアプローチを紹介します。',
  },
};

export const DevelopmentCategory: Story = {
  name: '開発カテゴリ',
  args: {
    link: '/posts/example-post',
    title: 'Panda CSS でスタイリングを効率化する',
    date: '2024-04-01',
    category: 'development',
    tags: ['CSS', 'Panda CSS'],
  },
};

export const TechnologyCategory: Story = {
  name: 'テクノロジーカテゴリ',
  args: {
    link: '/posts/example-post',
    title: 'AI コーディングアシスタントの活用法',
    date: '2024-05-01',
    category: 'technology',
    tags: ['AI', 'Productivity'],
  },
};

export const OtherCategory: Story = {
  name: 'その他カテゴリ',
  args: {
    link: '/posts/example-post',
    title: '技術ブログを書き続けるコツ',
    date: '2024-06-01',
    category: 'other',
  },
};

export const FullContent: Story = {
  name: '全属性',
  args: {
    link: '/posts/example-post',
    title: 'Storybook v10 で Next.js アプリのコンポーネントカタログを構築する完全ガイド',
    date: '2024-01-15',
    updated: '2024-07-01',
    excerpt:
      'Storybook v10 の新機能を活用して、Next.js アプリケーションのコンポーネントカタログを効率的に構築する方法を詳しく解説します。',
    tags: ['Storybook', 'Next.js', 'React', 'Testing'],
    category: 'development',
  },
};

export const WithTitleH2: Story = {
  name: 'h2 タイトル',
  args: {
    link: '/posts/example-post',
    title: 'TypeScript 5.0 の新機能まとめ',
    date: '2024-01-15',
    titleTagName: 'h2',
  },
};

export const LongTitle: Story = {
  name: '長いタイトル',
  args: {
    link: '/posts/example-post',
    title:
      'TypeScript と React Server Components を組み合わせたモダンなフルスタック Web アプリケーション開発の実践的アプローチについて詳しく解説する',
    date: '2024-01-15',
    excerpt: '非常に長いタイトルのテキストオーバーフローを確認するためのストーリーです。',
  },
};

export const Narrow: Story = {
  name: '幅 300px',
  args: {
    link: '/posts/example-post',
    title: 'コンテナ幅 300px での表示確認',
    date: '2024-01-15',
    category: 'development',
    tags: ['React', 'TypeScript'],
    excerpt: 'コンテナ幅 320px 以下でカテゴリバッジが上部に移動し、480px 以下でタグが非表示になる。',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

export const Medium: Story = {
  name: '幅 450px',
  args: {
    link: '/posts/example-post',
    title: 'コンテナ幅 450px での表示確認',
    date: '2024-01-15',
    category: 'technology',
    tags: ['CSS', 'Container Queries'],
    excerpt: 'コンテナ幅 320px〜480px ではヘッダーは横並び、タグは非表示。',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '450px' }}>
        <Story />
      </div>
    ),
  ],
};
