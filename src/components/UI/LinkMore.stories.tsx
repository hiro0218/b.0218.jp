import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { LinkMore } from '@/components/UI/LinkMore';

const meta = {
  title: 'UI/LinkMore',
  component: LinkMore,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof LinkMore>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '基本',
  args: {
    href: '/posts',
    text: 'もっと見る',
  },
  parameters: {
    docs: {
      description: {
        story: '基本的な「もっと見る」リンク。一覧ページへの遷移に使用する。',
      },
    },
  },
};

export const WithLongText: Story = {
  name: '長いテキスト',
  args: {
    href: '/tags/typescript',
    text: 'TypeScript の記事をすべて見る',
  },
  parameters: {
    docs: {
      description: {
        story: 'テキストが長い場合の表示。レイアウト崩れがないことを確認する。',
      },
    },
  },
};

export const ExternalLink: Story = {
  name: '外部リンク',
  args: {
    href: 'https://example.com',
    text: '外部サイトへ',
  },
  parameters: {
    docs: {
      description: {
        story: '外部 URL を指定した場合の表示。',
      },
    },
  },
};
