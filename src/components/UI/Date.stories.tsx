import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { PostDate } from '@/components/UI/Date';

const meta = {
  title: 'UI/Date',
  component: PostDate,
} satisfies Meta<typeof PostDate>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 公開日と更新日が同一の場合。公開日のみ表示する。
 *
 * @summary 公開日と更新日が同一の場合
 */
export const Default: Story = {
  name: '基本',
  args: {
    date: '2024-01-15',
    updated: '2024-01-15',
  },
};

/**
 * 公開後に内容を更新した記事。公開日と更新日の両方を表示する。
 *
 * @summary 公開後に内容を更新した記事
 */
export const WithUpdate: Story = {
  name: '更新日あり',
  args: {
    date: '2024-01-15',
    updated: '2024-03-20',
  },
};

/**
 * 更新日が未設定の場合。公開日のみ表示する。
 *
 * @summary 更新日が未設定の場合
 */
export const NoUpdate: Story = {
  name: '更新日なし',
  args: {
    date: '2024-01-15',
    updated: undefined,
  },
};
