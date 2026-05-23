import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Title } from '@/components/UI/Title';

const meta = {
  title: 'UI/Title',
  component: Title,
  args: {
    children: '記事一覧',
  },
} satisfies Meta<typeof Title>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * ページ最上位のタイトル。`<h1>` として描画される。
 *
 * @summary ページ h1 タイトル
 */
export const Default: Story = {
  name: '基本',
};

/**
 * タイトル直下に説明文を吊るす派生。ページ全体の趣旨を 1 行で説明したいときに使う。
 *
 * @summary 直下の説明文付き
 */
export const WithParagraph: Story = {
  name: '説明文付き',
  args: {
    paragraph: 'TypeScript・React・CSS を中心にした技術メモと、ときどき雑記。',
  },
};

/**
 * 記事タイトルなど、折り返しを起こさざるをえない長文が来た場合の標本。`text-wrap: balance` の効きが見える。
 *
 * @summary 長文ページタイトル
 */
export const LongTitle: Story = {
  name: '長文',
  args: {
    children: '確証バイアスを避けるためにAIには逆の視点でも確認する',
  },
};

/**
 * アーカイブページの最上位タイトル + 概要。タグやカテゴリの一覧ページで、何が並ぶページなのかを冒頭で示す。
 *
 * @summary アーカイブの導入
 */
export const WithComplexParagraph: Story = {
  name: 'タイトル + 説明文',
  args: {
    children: 'TypeScript',
    paragraph: 'TypeScript の型システム、エコシステム、Biome や Oxfmt との組み合わせに関する記事のアーカイブ。',
  },
};
