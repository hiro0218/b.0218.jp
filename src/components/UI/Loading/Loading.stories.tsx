import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Loading } from './index';

const meta = {
  title: 'UI/Loading',
  component: Loading,
  tags: ['autodocs'],
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '基本',
};

export const Small: Story = {
  name: '小サイズ',
  args: {
    size: 24,
  },
};

export const Large: Story = {
  name: '大サイズ',
  args: {
    size: 80,
  },
};
