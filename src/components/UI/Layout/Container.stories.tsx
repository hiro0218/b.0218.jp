import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { DemoBox } from '@/stories/_internal/DemoBox';

import { Container } from './Container';

const meta = {
  title: 'UI/Layout/Container',
  component: Container,
  args: {
    children: <DemoBox>max-inline-size による幅制限ゾーン</DemoBox>,
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * トップページや記事一覧の最外殻として置く幅。情報を横にスキャンするブラウジングを前提とした太めの値。
 *
 * @summary 一覧用の標準幅
 */
export const Default: Story = {
  name: '一覧用',
};

/**
 * サイトヘッダーのように両端いっぱいまで使う chrome 用。コンテンツ幅というよりは画面端からの gutter のみ与える。
 *
 * @summary chrome 用の全幅
 */
export const Large: Story = {
  name: 'サイト chrome',
  args: { size: 'large' },
};
