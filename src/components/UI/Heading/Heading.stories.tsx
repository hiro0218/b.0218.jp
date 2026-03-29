import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Heading from './index';

const meta = {
  title: 'UI/Heading',
  component: Heading,
  tags: ['autodocs'],
  args: {
    children: '見出しテキスト',
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const H1: Story = {
  name: 'h1',
  args: {
    as: 'h1',
  },
};

export const H2: Story = {
  name: 'h2',
  args: {
    as: 'h2',
  },
};

export const H3: Story = {
  name: 'h3',
  args: {
    as: 'h3',
  },
};

export const H4: Story = {
  name: 'h4',
  args: {
    as: 'h4',
  },
};

export const H5: Story = {
  name: 'h5',
  args: {
    as: 'h5',
    children: '見出しレベル5',
  },
};

export const H6: Story = {
  name: 'h6',
  args: {
    as: 'h6',
    children: '見出しレベル6',
  },
};

export const Bold: Story = {
  name: '太字',
  args: {
    as: 'h2',
    isBold: true,
  },
};

export const WithTextSide: Story = {
  name: 'サイドテキスト',
  args: {
    as: 'h2',
    textSide: '(10)',
  },
};

export const WithTextSub: Story = {
  name: '補足テキスト',
  args: {
    as: 'h2',
    textSub: '補足テキスト',
  },
};

export const WithTextSideAndSub: Story = {
  name: 'サイド + 補足',
  args: {
    as: 'h2',
    textSide: '(10)',
    textSub: '補足テキスト',
  },
};
