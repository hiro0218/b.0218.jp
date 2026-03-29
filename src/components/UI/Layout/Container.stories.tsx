import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Container } from './Container';

const DemoContent = () => (
  <div style={{ background: 'var(--colors-blue-200)', padding: '1rem', borderRadius: '4px' }}>
    コンテナ内のコンテンツ — max-width による幅制限を確認
  </div>
);

const meta = {
  title: 'UI/Layout/Container',
  component: Container,
  tags: ['autodocs'],
  args: {
    children: <DemoContent />,
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: '基本' };

export const Small: Story = {
  name: '小サイズ',
  args: {
    size: 'small',
  },
};

export const Large: Story = {
  name: '大サイズ',
  args: {
    size: 'large',
  },
};

export const WithoutSpace: Story = {
  name: '余白なし',
  args: {
    space: false,
  },
};
