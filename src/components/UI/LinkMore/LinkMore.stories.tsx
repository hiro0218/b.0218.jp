import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { LinkMore } from './index';

const meta = {
  title: 'UI/LinkMore',
  component: LinkMore,
  tags: ['autodocs'],
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
};

export const WithLongText: Story = {
  name: '長いテキスト',
  args: {
    href: '/tags/typescript',
    text: 'TypeScript の記事をすべて見る',
  },
};

export const ExternalLink: Story = {
  name: '外部リンク',
  args: {
    href: 'https://example.com',
    text: '外部サイトへ',
  },
};
