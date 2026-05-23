import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Title } from '@/components/UI/Title';

const meta = {
  title: 'UI/Title',
  component: Title,
  args: {
    children: 'ページタイトル',
  },
} satisfies Meta<typeof Title>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * ページタイトルの基本形。h1 要素として描画される。
 *
 * @summary ページタイトルの基本形
 */
export const Default: Story = {
  name: '基本',
};

/**
 * タイトル直下に説明文を表示する。ページの概要を伝える場合に使用する。
 *
 * @summary タイトル直下に説明文を表示する
 */
export const WithParagraph: Story = {
  name: '説明文付き',
  args: {
    paragraph: 'ページの内容を簡潔に説明するテキストです。',
  },
};

/**
 * 記事タイトルや検索結果見出しが長くなるページで、タイトル領域を保ったまま読ませたい場合に使用する。
 *
 * @summary 長いページタイトル
 */
export const LongTitle: Story = {
  name: '長いタイトル',
  args: {
    children: 'TypeScriptの型システムを活用したReactコンポーネント設計パターンについての詳細な解説と実践的なアプローチ',
  },
};

/**
 * タイトルと長めの説明文を組み合わせた表示。アーカイブページ等に使用する。
 *
 * @summary タイトルと長めの説明文を組み合わせた表示
 */
export const WithComplexParagraph: Story = {
  name: 'タイトル + 説明文',
  args: {
    children: '記事一覧',
    paragraph:
      'Web開発に関する技術記事をまとめています。TypeScript、React、Next.jsなどのフロントエンド技術を中心に発信しています。',
  },
};
