import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Title } from './index';

const meta = {
  title: 'UI/Title',
  component: Title,
  tags: ['autodocs'],
  args: {
    children: 'ページタイトル',
  },
} satisfies Meta<typeof Title>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '基本',
};

export const WithParagraph: Story = {
  name: '説明文付き',
  args: {
    paragraph: 'ページの内容を簡潔に説明するテキストです。',
  },
};

export const LongTitle: Story = {
  name: '長いタイトル',
  args: {
    children: 'TypeScriptの型システムを活用したReactコンポーネント設計パターンについての詳細な解説と実践的なアプローチ',
  },
};

export const WithComplexParagraph: Story = {
  name: 'タイトル + 説明文',
  args: {
    children: '記事一覧',
    paragraph:
      'Web開発に関する技術記事をまとめています。TypeScript、React、Next.jsなどのフロントエンド技術を中心に発信しています。',
  },
};
