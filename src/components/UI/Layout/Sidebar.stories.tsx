import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { DemoBox } from '@/stories/_internal/DemoBox';

import { Sidebar } from './Sidebar';

const SIDEBAR_HEADING_ID = 'sidebar-heading';

const defaultChildren = (
  <>
    <Sidebar.Main>
      <DemoBox minHeight="100px">本文 — flex 比 7</DemoBox>
    </Sidebar.Main>
    <Sidebar.Side>
      <DemoBox color="var(--colors-green-200)" minHeight="100px">
        サイド — flex 比 3、デスクトップで sticky
      </DemoBox>
    </Sidebar.Side>
  </>
);

const meta = {
  title: 'UI/Layout/Sidebar',
  component: Sidebar,
  args: {
    children: defaultChildren,
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 主従 2 カラムの基本形。デスクトップ幅でサイドが sticky になり、本文スクロールを追従しない。
 *
 * @summary 主従 2 カラム
 */
export const Default: Story = {
  name: '基本',
};

/**
 * 区画にランドマークとして名前を付ける派生。タグ別・カテゴリ別など、区画の意味を見出しで明示するページで使う。
 *
 * @summary タイトル付きランドマーク
 */
export const WithTitle: Story = {
  name: 'タイトル付き',
  args: {
    children: (
      <>
        <Sidebar.Title>TypeScript</Sidebar.Title>
        <Sidebar.Main>
          <DemoBox minHeight="100px">本文</DemoBox>
        </Sidebar.Main>
        <Sidebar.Side>
          <DemoBox color="var(--colors-green-200)" minHeight="100px">
            関連タグ一覧
          </DemoBox>
        </Sidebar.Side>
      </>
    ),
  },
};

/**
 * 本文とサイドの間隔を広く取った派生。サイドを補足情報として本文から視覚的に切り離したいときに使う。
 *
 * @summary 区画間の余白を広げる
 */
export const CustomGap: Story = {
  name: 'gap カスタム',
  args: { gap: 800 },
};

/**
 * タイトルの見出しレベルを h3 に落とす派生。ページ内で既に上位見出しが存在する文脈で使う。
 *
 * @summary h3 タイトル
 */
export const TitleWithCustomTag: Story = {
  name: 'h3 タイトル',
  args: {
    children: (
      <>
        <Sidebar.Title id={SIDEBAR_HEADING_ID} tag="h3">
          関連記事
        </Sidebar.Title>
        <Sidebar.Main>
          <DemoBox minHeight="100px">本文</DemoBox>
        </Sidebar.Main>
        <Sidebar.Side>
          <DemoBox color="var(--colors-green-200)" minHeight="100px">
            関連リンク
          </DemoBox>
        </Sidebar.Side>
      </>
    ),
  },
};
