import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Sidebar } from './Sidebar';

const DemoContent = ({ color = 'var(--colors-blue-200)', label }: { color?: string; label: string }) => (
  <div style={{ background: color, padding: '1rem', borderRadius: '4px', minHeight: '100px' }}>{label}</div>
);

const defaultChildren = (
  <>
    <Sidebar.Main>
      <DemoContent label="メインエリア（flex: 7）" />
    </Sidebar.Main>
    <Sidebar.Side>
      <DemoContent color="var(--colors-green-200)" label="サイドバーエリア（flex: 3、デスクトップで sticky）" />
    </Sidebar.Side>
  </>
);

const meta = {
  title: 'UI/Layout/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  args: {
    children: defaultChildren,
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: '基本' };

export const WithTitle: Story = {
  name: 'タイトル付き',
  args: {
    children: (
      <>
        <Sidebar.Title>サイドバーレイアウト</Sidebar.Title>
        <Sidebar.Main>
          <DemoContent label="メインコンテンツ" />
        </Sidebar.Main>
        <Sidebar.Side>
          <DemoContent color="var(--colors-green-200)" label="サイドコンテンツ" />
        </Sidebar.Side>
      </>
    ),
  },
};

export const CustomGap: Story = {
  name: 'カスタム gap',
  args: {
    gap: 5,
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
          <DemoContent label="メインコンテンツ" />
        </Sidebar.Main>
        <Sidebar.Side>
          <DemoContent color="var(--colors-green-200)" label="サイドコンテンツ" />
        </Sidebar.Side>
      </>
    ),
  },
};
