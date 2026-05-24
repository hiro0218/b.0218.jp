import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Heading } from '@/components/UI/Heading';

const meta = {
  title: 'UI/Heading',
  component: Heading,
  args: {
    children: '記事本文中のセクション見出し',
  },
  argTypes: {
    as: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    },
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 記事本文中で最も多く現れる中見出し。Controls で `as` を切り替えるとレベルを変えられる。
 *
 * @summary 中見出しの基準
 */
export const Default: Story = {
  name: '基本（h2）',
  args: { as: 'h2' },
};

/**
 * ページタイトルとしての h1。一覧ページや記事詳細の最上位見出しに 1 つだけ置く。
 *
 * @summary ページ最上位見出し
 */
export const H1: Story = {
  name: 'h1',
  args: { as: 'h1', children: '記事一覧' },
};

/**
 * 最深層のサブ見出し。スケールの下限を視覚的に押さえるためのリファレンス。実運用での出現頻度は低い。
 *
 * @summary スケール下限の参照
 */
export const H6: Story = {
  name: 'h6',
  args: { as: 'h6', children: '注釈レベルの見出し' },
};

/**
 * 通常より太い見出し。同じ階層内でさらに強調したい箇所に限定する。
 *
 * @summary 太字の強調派生
 */
export const Bold: Story = {
  name: '太字',
  args: { as: 'h2', isBold: true },
};

/**
 * 見出しの行末に件数や日付を補助情報として並置する派生。タグページの「TypeScript (12)」のような表記に使う。
 *
 * @summary 行末の補助テキスト
 */
export const WithTextSide: Story = {
  name: 'サイドテキスト',
  args: { as: 'h2', textSide: '(12)' },
};

/**
 * 見出し直下に説明文を吊るす派生。セクションの導入が長くなりそうなときに 1 行だけ前置きを置く。
 *
 * @summary 直下の補足テキスト
 */
export const WithTextSub: Story = {
  name: '補足テキスト',
  args: {
    as: 'h2',
    textSub: '記事を category 別に絞り込んで一覧できる',
  },
};

/**
 * サイドテキストと補足テキストを両方付けた最大構成の確認用標本。
 *
 * @summary 最大構成の確認用標本
 */
export const WithTextSideAndSub: Story = {
  tags: ['!manifest'],
  name: 'サイド + 補足',
  args: {
    as: 'h2',
    children: 'TypeScript',
    textSide: '(12)',
    textSub: 'TypeScript / Biome / Oxfmt などの記事',
  },
};
