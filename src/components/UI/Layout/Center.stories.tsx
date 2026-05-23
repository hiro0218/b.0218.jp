import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { DemoBox } from '@/stories/_internal/DemoBox';

import { Center } from './Center';

const meta = {
  title: 'UI/Layout/Center',
  component: Center,
  args: {
    children: <DemoBox>中央揃えコンテンツ</DemoBox>,
  },
} satisfies Meta<typeof Center>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * コンテンツ幅を制限しつつ画面中央に配置したいときに使用する。一覧ページの本文領域や記事一覧の最外殻として典型的に使う。
 *
 * @summary コンテンツ幅を制限しつつ画面中央に配置したいときに使用する
 */
export const Default: Story = {
  name: '基本',
};

/**
 * 左右に内側余白を付与する。モバイル幅での端ぶつかりを防ぐ。
 *
 * @summary 左右に内側余白を付与する
 */
export const WithGutters: Story = {
  name: 'ガター付き',
  args: {
    gutters: 3,
  },
};

/**
 * 子要素の幅を尊重したまま中央に置きたいときに使用する。固定 max-width に依存せず、見出しやボタン群のような可変幅コンテンツを画面中央に配置する場面で使う。
 *
 * @summary 子要素の幅を尊重したまま中央に置きたいときに使用する
 */
export const Intrinsic: Story = {
  name: '内在的な中央揃え',
  args: {
    intrinsic: true,
    children: <DemoBox>内在的な中央揃え（flex column + align center）</DemoBox>,
  },
};

/**
 * max-width をカスタム値に変更する。狭いコンテンツ幅が必要な場合に使用する。
 *
 * @summary max-width をカスタム値に変更する
 */
export const CustomMaxWidth: Story = {
  name: 'カスタム max-width',
  args: {
    maxWidth: '40rem',
    children: <DemoBox>幅を狭めた中央揃え（max 40rem）</DemoBox>,
  },
};

/**
 * ランドマークとして識別したい区画を中央配置する場合に使用する。スクリーンリーダーの読み上げ単位を構造化する目的で `<section>` 化したいときに使う。
 *
 * @summary ランドマークとして識別したい区画を中央配置する場合に使用する
 */
export const AsSection: Story = {
  name: 'section 要素',
  args: {
    as: 'section',
    children: <DemoBox>section 要素として描画</DemoBox>,
  },
};
