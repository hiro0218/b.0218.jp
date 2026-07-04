import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { DemoBox } from '@/stories/_internal/DemoBox';

import { Stack } from './Stack';

const defaultChildren = (
  <>
    <DemoBox>記事 — TypeScript</DemoBox>
    <DemoBox color="var(--colors-green-200)">記事 — Biome</DemoBox>
    <DemoBox color="var(--colors-red-200)">記事 — Oxfmt</DemoBox>
  </>
);

const meta = {
  title: 'UI/Layout/Stack',
  component: Stack,
  args: {
    children: defaultChildren,
  },
  argTypes: {
    gap: {
      control: 'select',
      options: [0, 75, 100, 300, 400, 600, 800, 1000],
    },
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 縦方向の等間隔配置。子要素自身に `margin` を持たせず、親が `gap` で関係を作る Every Layout の基本パターン。
 *
 * @summary 縦方向の等間隔
 */
export const Default: Story = {
  name: '基本',
};

/**
 * 横方向に並べる派生。ヘッダーの左右配置やツールバーに使う。
 *
 * @summary 横方向の並び
 */
export const Horizontal: Story = {
  name: '横方向',
  args: { direction: 'horizontal' },
};

/**
 * `gap` を Adobe Spectrum spacing スケールから選択する。段階を切り替えて、密度のリズムを判断する用。
 *
 * @summary gap スケールの確認
 */
export const WithGap: Story = {
  name: 'gap 調整',
  args: { gap: 800 },
};

/**
 * 横方向 + `space-between` でヘッダー的なレイアウトを作る派生。左にロゴ、右にナビという典型に使う。
 *
 * @summary 両端配置のヘッダー
 */
export const WithAlignment: Story = {
  name: '配置指定',
  args: {
    direction: 'horizontal',
    align: 'center',
    justify: 'space-between',
  },
};

/**
 * 横方向で折り返しを許可する派生。タグ列のように要素数が可変な並びに使う。
 *
 * @summary 折り返しのタグ列
 */
export const WithWrap: Story = {
  name: '折り返し',
  args: {
    direction: 'horizontal',
    wrap: 'wrap',
    gap: 300,
    children: (
      <>
        <DemoBox>TypeScript</DemoBox>
        <DemoBox color="var(--colors-green-200)">Biome</DemoBox>
        <DemoBox color="var(--colors-red-200)">CSS</DemoBox>
        <DemoBox color="var(--colors-blue-300)">設計</DemoBox>
        <DemoBox color="var(--colors-green-300)">AI</DemoBox>
        <DemoBox color="var(--colors-red-300)">Next.js</DemoBox>
      </>
    ),
  },
};

/**
 * `<ul>` として描画する派生。リストとしての意味を持たせたいときに使う。
 *
 * @summary ul リスト要素
 */
export const AsList: Story = {
  name: 'ul リスト',
  args: {
    as: 'ul',
    gap: 100,
    children: (
      <>
        <li>
          <DemoBox>記事 — TypeScript</DemoBox>
        </li>
        <li>
          <DemoBox color="var(--colors-green-200)">記事 — Biome</DemoBox>
        </li>
        <li>
          <DemoBox color="var(--colors-red-200)">記事 — Oxfmt</DemoBox>
        </li>
      </>
    ),
  },
};

/**
 * 高さの異なる要素を横並びにし、視線の基準線を中央で揃える派生。アイコンとテキスト、フォームのラベルと入力欄など。
 *
 * @summary 異なる高さの中央揃え
 */
export const AlignCenter: Story = {
  name: '中央揃え',
  args: {
    direction: 'horizontal',
    align: 'center',
    children: (
      <>
        <DemoBox>小</DemoBox>
        <DemoBox color="var(--colors-green-200)">
          <div style={{ paddingBlock: '2rem' }}>大きい要素</div>
        </DemoBox>
        <DemoBox color="var(--colors-red-200)">中</DemoBox>
      </>
    ),
  },
};

/**
 * 主操作を右端に固定する派生。ダイアログのフッターやツールバーで、副ボタン → 主ボタンの流れに使う。
 *
 * @summary 右端寄せのアクション群
 */
export const JustifyEnd: Story = {
  name: '右寄せ',
  args: {
    direction: 'horizontal',
    justify: 'flex-end',
  },
};
