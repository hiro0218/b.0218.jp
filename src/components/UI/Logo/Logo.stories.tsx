import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Logo } from './index';

const meta = {
  title: 'UI/Logo',
  component: Logo,
  tags: ['autodocs'],
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '基本',
};
