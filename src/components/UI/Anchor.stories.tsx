import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Anchor } from '@/components/UI/Anchor';

const meta = {
  title: 'UI/Anchor',
  component: Anchor,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Anchor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '基本',
  args: {
    href: '/example',
    children: 'リンクテキスト',
  },
  parameters: {
    docs: {
      description: {
        story: 'サイト内リンクの基本形。Next.js Link でクライアントサイドナビゲーションを行う。',
      },
    },
  },
};

export const WithTitle: Story = {
  name: 'title 属性付き',
  args: {
    href: '/example',
    title: 'サンプルリンク',
    children: 'タイトル付きリンク',
  },
  parameters: {
    docs: {
      description: {
        story: 'title 属性でホバー時にリンク先の補足情報を表示する。',
      },
    },
  },
};

export const ExternalLink: Story = {
  name: '外部リンク',
  args: {
    href: 'https://example.com',
    children: '外部リンク',
  },
  parameters: {
    docs: {
      description: {
        story: '外部 URL へのリンク。ドメインが異なる場合に自動で外部リンク扱いになる。',
      },
    },
  },
};
