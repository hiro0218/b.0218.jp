import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { DemoBox } from '@/stories/_internal/DemoBox';

import { Cluster } from './Cluster';

const defaultChildren = (
  <>
    <DemoBox compact>TypeScript</DemoBox>
    <DemoBox color="var(--colors-green-200)">Biome</DemoBox>
    <DemoBox color="var(--colors-red-200)">CSS</DemoBox>
    <DemoBox color="var(--colors-blue-300)">設計</DemoBox>
    <DemoBox color="var(--colors-green-300)">AI</DemoBox>
  </>
);

const meta = {
  title: 'UI/Layout/Cluster',
  component: Cluster,
  args: {
    children: defaultChildren,
  },
} satisfies Meta<typeof Cluster>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 折り返しを前提とした水平配置。要素数が可変なタグ列・バッジ列に使う。
 *
 * @summary タグ列の基本形
 */
export const Default: Story = {
  name: '基本',
};

/**
 * `gap` を広めに取ったタグ列。タッチ操作の誤タップ回避や、要素の独立性を強調したい場面に使う。
 *
 * @summary 広い gap のタグ列
 */
export const WideGap: Story = {
  name: '広い gap',
  args: { gap: 800 },
};

/**
 * 子要素を均等幅に配分する派生。要素数が固定の主要ナビに使う。
 *
 * @summary 均等幅の主要ナビ
 */
export const Wide: Story = {
  name: '均等配分',
  args: {
    isWide: true,
    children: (
      <>
        <DemoBox compact>記事</DemoBox>
        <DemoBox color="var(--colors-green-200)">タグ</DemoBox>
        <DemoBox color="var(--colors-red-200)">アーカイブ</DemoBox>
      </>
    ),
  },
};

/**
 * `<nav>` として描画する派生。サイト内のナビゲーション領域として意味づける。
 *
 * @summary nav ランドマーク化
 */
export const AsNav: Story = {
  name: 'nav 要素',
  args: {
    as: 'nav',
    gap: 300,
    children: (
      <>
        <DemoBox compact>ホーム</DemoBox>
        <DemoBox color="var(--colors-green-200)">記事</DemoBox>
        <DemoBox color="var(--colors-red-200)">タグ</DemoBox>
      </>
    ),
  },
};
