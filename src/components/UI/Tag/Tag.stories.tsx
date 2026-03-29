import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import PostTag from './index';

const meta = {
  title: 'UI/Tag',
  component: PostTag,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof PostTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '基本',
  args: {
    tags: [{ slug: 'TypeScript' }, { slug: 'React' }, { slug: 'Next.js' }],
  },
};

export const WithCounts: Story = {
  name: '件数付き',
  args: {
    tags: [
      { slug: 'TypeScript', count: 15 },
      { slug: 'React', count: 12 },
      { slug: 'CSS', count: 8 },
      { slug: 'Next.js', count: 5 },
    ],
  },
};

export const Navigable: Story = {
  name: 'リンク付き',
  args: {
    tags: [
      { slug: 'TypeScript', count: 15, isNavigable: true },
      { slug: 'React', count: 12, isNavigable: true },
      { slug: 'CSS', count: 8, isNavigable: true },
    ],
  },
};

export const Mixed: Story = {
  name: '混在',
  args: {
    tags: [
      { slug: 'TypeScript', count: 15, isNavigable: true },
      { slug: 'React', isNavigable: false },
      { slug: 'CSS', count: 8, isNavigable: true },
    ],
  },
};

export const Empty: Story = {
  name: '空配列',
  args: {
    tags: [],
  },
};
