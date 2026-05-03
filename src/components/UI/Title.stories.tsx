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

export const Default: Story = {
  name: '基本',
  parameters: {
    docs: {
      description: {
        story: 'ページタイトルの基本形。h1 要素として描画される。',
      },
    },
  },
};

export const WithParagraph: Story = {
  name: '説明文付き',
  args: {
    paragraph: 'ページの内容を簡潔に説明するテキストです。',
  },
  parameters: {
    docs: {
      description: {
        story: 'タイトル直下に説明文を表示する。ページの概要を伝える場合に使用する。',
      },
    },
  },
};

export const LongTitle: Story = {
  name: '長いタイトル',
  args: {
    children: 'TypeScriptの型システムを活用したReactコンポーネント設計パターンについての詳細な解説と実践的なアプローチ',
  },
  parameters: {
    docs: {
      description: {
        story: '長いタイトルの折り返し表示を確認する。',
      },
    },
  },
};

export const WithComplexParagraph: Story = {
  name: 'タイトル + 説明文',
  args: {
    children: '記事一覧',
    paragraph:
      'Web開発に関する技術記事をまとめています。TypeScript、React、Next.jsなどのフロントエンド技術を中心に発信しています。',
  },
  parameters: {
    docs: {
      description: {
        story: 'タイトルと長めの説明文を組み合わせた表示。アーカイブページ等に使用する。',
      },
    },
  },
};
