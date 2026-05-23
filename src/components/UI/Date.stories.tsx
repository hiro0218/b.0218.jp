import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { PostDate } from '@/components/UI/Date';

const meta = {
  title: 'UI/Date',
  component: PostDate,
} satisfies Meta<typeof PostDate>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 公開日と更新日が同一の記事。更新日を出さず公開日だけ表示する。
 *
 * @summary 公開日のみ
 */
export const Default: Story = {
  name: '基本',
  args: {
    date: '2026-04-27',
    updated: '2026-04-27',
  },
};

/**
 * 公開後に内容を更新した記事。公開日と更新日を併記する。
 *
 * @summary 公開日 + 更新日
 */
export const WithUpdate: Story = {
  name: '更新日あり',
  args: {
    date: '2024-08-02',
    updated: '2026-03-20',
  },
};

/**
 * フロントマターに `updated` が無い記事の表示。公開日のみが描画される。
 *
 * @summary 更新日 undefined
 */
export const NoUpdate: Story = {
  name: '更新日なし',
  args: {
    date: '2026-05-02',
    updated: undefined,
  },
};
