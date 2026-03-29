import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Anchor } from './index';

const meta = {
  title: 'UI/Anchor',
  component: Anchor,
  tags: ['autodocs'],
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
};

export const WithTitle: Story = {
  name: 'title 属性付き',
  args: {
    href: '/example',
    title: 'サンプルリンク',
    children: 'タイトル付きリンク',
  },
};

export const ExternalLink: Story = {
  name: '外部リンク',
  args: {
    href: 'https://example.com',
    children: '外部リンク',
  },
};
