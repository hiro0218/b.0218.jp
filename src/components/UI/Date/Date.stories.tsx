import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import PostDate from './index';

const meta = {
  title: 'UI/Date',
  component: PostDate,
  tags: ['autodocs'],
} satisfies Meta<typeof PostDate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '基本',
  args: {
    date: '2024-01-15',
    updated: '2024-01-15',
  },
};

export const WithUpdate: Story = {
  name: '更新日あり',
  args: {
    date: '2024-01-15',
    updated: '2024-03-20',
  },
};

export const NoUpdate: Story = {
  name: '更新日なし',
  args: {
    date: '2024-01-15',
    updated: undefined,
  },
};
