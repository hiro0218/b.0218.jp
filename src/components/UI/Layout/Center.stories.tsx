import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { DemoBox } from '@/stories/_internal/DemoBox';

import { Center } from './Center';

const meta = {
  title: 'UI/Layout/Center',
  component: Center,
  args: {
    children: <DemoBox>max-inline-size に対する中央寄せ</DemoBox>,
  },
} satisfies Meta<typeof Center>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 最大幅を持つ単一の中央カラム。記事一覧ページの最外殻として典型的に置く。
 *
 * @summary 最外殻の中央カラム
 */
export const Default: Story = {
  name: '基本',
};

/**
 * 左右に内側余白を足してモバイル幅での端ぶつかりを防ぐ派生。
 *
 * @summary モバイル端の余白付き
 */
export const WithGutters: Story = {
  name: 'gutter 付き',
  args: { gutters: 3 },
};

/**
 * `max-width` ではなく子要素自身の幅を尊重して中央に置く派生（flex column + align center）。見出しやボタン群のように、可変幅コンテンツを中央に揃えるときに使う。
 *
 * @summary 内在幅の中央寄せ
 */
export const Intrinsic: Story = {
  name: '内在的な中央寄せ',
  args: {
    intrinsic: true,
    children: <DemoBox>子要素の幅を尊重した中央寄せ</DemoBox>,
  },
};

/**
 * `max-width` を任意の値に上書きする派生。デフォルトのコンテンツ幅では広すぎる箇所で絞る。
 *
 * @summary max-width のカスタム
 */
export const CustomMaxWidth: Story = {
  name: 'max-width 上書き',
  args: {
    maxWidth: '40rem',
    children: <DemoBox>40rem に絞った中央寄せ</DemoBox>,
  },
};

/**
 * `<section>` として描画する派生。スクリーンリーダーが区画として読み上げるためには見出しまたは `aria-label` でランドマークに名前を与える必要があるため、利用時は内部に見出しを伴うのが基本となる。
 *
 * @summary section ランドマーク化（見出し付き）
 */
export const AsSection: Story = {
  name: 'section 要素',
  args: {
    as: 'section',
    children: (
      <>
        <h2>section の名前</h2>
        <DemoBox>section ランドマークの中身</DemoBox>
      </>
    ),
  },
};
