import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Avatar } from './Avatar';

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 画像が読み込める通常状態。コメント投稿者やいいねした著者など、外部から渡された画像をそのまま表示する。
 * @summary 画像がある場合
 */
export const WithImage: Story = {
  name: '画像がある場合',
  args: {
    name: 'Alice',
    src: 'https://picsum.photos/seed/avatar/64',
  },
};

/**
 * 送信元が画像を持たない、または画像URLが安全基準（https 限定）を満たさない場合の表示。
 * @summary 画像が無い場合
 */
export const WithoutImage: Story = {
  name: '画像が無い場合',
  args: {
    name: 'Alice',
    src: null,
  },
};

/**
 * 画像 URL は存在するが実際の読み込みが失敗するケース。壊れたリンクや削除済み画像でもイニシャル表示に落ちることを確認する。
 * @summary 画像の読み込みに失敗した場合
 */
export const BrokenImage: Story = {
  name: '画像の読み込みに失敗した場合',
  args: {
    name: 'Alice',
    src: 'https://invalid.example/broken.png',
  },
};
