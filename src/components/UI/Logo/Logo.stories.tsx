import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Logo } from './index';

const meta = {
  title: 'UI/Logo',
  component: Logo,
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '基本',
  parameters: {
    docs: {
      description: {
        story: 'サイトロゴの基本表示。ヘッダーに配置しトップページへのリンクとして機能する。',
      },
    },
  },
};
