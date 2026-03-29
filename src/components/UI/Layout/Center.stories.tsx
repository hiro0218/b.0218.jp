import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Center } from './Center';

const DemoBox = ({ children, color = 'var(--colors-blue-200)' }: { children: React.ReactNode; color?: string }) => (
  <div style={{ background: color, padding: '1rem', borderRadius: '4px' }}>{children}</div>
);

const meta = {
  title: 'UI/Layout/Center',
  component: Center,
  tags: ['autodocs'],
  args: {
    children: <DemoBox>中央揃えコンテンツ</DemoBox>,
  },
} satisfies Meta<typeof Center>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: '基本' };

export const WithGutters: Story = {
  name: 'ガター付き',
  args: {
    gutters: 3,
  },
};

export const Intrinsic: Story = {
  name: '内在的な中央揃え',
  args: {
    intrinsic: true,
    children: <DemoBox>内在的な中央揃え（flex column + align center）</DemoBox>,
  },
};

export const CustomMaxWidth: Story = {
  name: 'カスタム max-width',
  args: {
    maxWidth: '40rem',
    children: <DemoBox>幅を狭めた中央揃え（max 40rem）</DemoBox>,
  },
};

export const AsSection: Story = {
  name: 'section 要素',
  args: {
    as: 'section',
    children: <DemoBox>section 要素として描画</DemoBox>,
  },
};
