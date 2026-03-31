import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { DemoBox } from '@/stories/_internal/DemoBox';

import { Sidebar } from './Sidebar';

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

export const Default: Story = {
  name: '基本',
  parameters: {
    docs: {
      description: {
        story: 'メイン + サイドバーの 2 カラムレイアウト。デスクトップでサイドバーが sticky になる。',
      },
    },
  },
};

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
  parameters: {
    docs: {
      description: {
        story: 'Sidebar.Title を使用してレイアウト上部にタイトルを配置する。',
      },
    },
  },
};

export const CustomGap: Story = {
  name: 'カスタム gap',
  args: {
    gap: 5,
  },
  parameters: {
    docs: {
      description: {
        story: 'メインとサイドバー間の gap を変更する。',
      },
    },
  },
};

export const TitleWithCustomTag: Story = {
  name: 'h3 タイトル',
  args: {
    children: (
      <>
        <Sidebar.Title id="sidebar-heading" tag="h3">
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
  parameters: {
    docs: {
      description: {
        story: 'タイトルの HTML タグを h3 に変更する。見出しレベルの調整が必要な場合に使用する。',
      },
    },
  },
};
