import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { DemoBox } from '@/stories/_internal/DemoBox';

import { Sidebar } from './Sidebar';

const SIDEBAR_HEADING_ID = 'sidebar-heading';

const defaultChildren = (
  <>
    <Sidebar.Main>
      <DemoBox minHeight="100px">メインエリア（flex: 7）</DemoBox>
    </Sidebar.Main>
    <Sidebar.Side>
      <DemoBox color="var(--colors-green-200)" minHeight="100px">
        サイドバーエリア（flex: 3、デスクトップで sticky）
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
 * メイン + サイドバーの 2 カラムレイアウト。デスクトップでサイドバーが sticky になる。
 *
 * @summary メイン + サイドバーの 2 カラムレイアウト
 */
export const Default: Story = {
  name: '基本',
};

/**
 * メイン + サイドのレイアウト全体に名前を付けて、ランドマークとして認識させたいときに使用する。タグ別アーカイブやカテゴリ別一覧など、見出しが区画の意味を表すページで使う。
 *
 * @summary メイン + サイドのレイアウト全体に名前を付けて、ランドマークとして認識させたいときに使用する
 */
export const WithTitle: Story = {
  name: 'タイトル付き',
  args: {
    children: (
      <>
        <Sidebar.Title>サイドバーレイアウト</Sidebar.Title>
        <Sidebar.Main>
          <DemoBox minHeight="100px">メインコンテンツ</DemoBox>
        </Sidebar.Main>
        <Sidebar.Side>
          <DemoBox color="var(--colors-green-200)" minHeight="100px">
            サイドコンテンツ
          </DemoBox>
        </Sidebar.Side>
      </>
    ),
  },
};

/**
 * メインとサイドの間に強い区切りを付けたいときに使用する。サイドが補足情報や広告など、メインから視覚的に切り離して読ませたい場面で使う。
 *
 * @summary メインとサイドの間に強い区切りを付けたいときに使用する
 */
export const CustomGap: Story = {
  name: 'カスタム gap',
  args: {
    gap: 5,
  },
};

/**
 * タイトルの HTML タグを h3 に変更する。見出しレベルの調整が必要な場合に使用する。
 *
 * @summary タイトルの HTML タグを h3 に変更する
 */
export const TitleWithCustomTag: Story = {
  name: 'h3 タイトル',
  args: {
    children: (
      <>
        <Sidebar.Title id={SIDEBAR_HEADING_ID} tag="h3">
          h3 サイドバータイトル
        </Sidebar.Title>
        <Sidebar.Main>
          <DemoBox minHeight="100px">メインコンテンツ</DemoBox>
        </Sidebar.Main>
        <Sidebar.Side>
          <DemoBox color="var(--colors-green-200)" minHeight="100px">
            サイドコンテンツ
          </DemoBox>
        </Sidebar.Side>
      </>
    ),
  },
};
