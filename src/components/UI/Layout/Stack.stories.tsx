import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { DemoBox } from '@/stories/_internal/DemoBox';

import { Stack } from './Stack';

const defaultChildren = (
  <>
    <DemoBox>要素 1</DemoBox>
    <DemoBox color="var(--colors-green-200)">要素 2</DemoBox>
    <DemoBox color="var(--colors-red-200)">要素 3</DemoBox>
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
      options: [0, '½', 1, 2, 3, 4, 5, 6],
    },
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '基本',
  parameters: {
    docs: {
      description: {
        story:
          '要素を縦方向に均等な間隔で積みたいときの最小構成。フォームのフィールド群やセクション内段落など、上下関係を持つ要素の標準的な並べ方として使う。',
      },
    },
  },
};

export const Horizontal: Story = {
  name: '横方向',
  args: {
    direction: 'horizontal',
  },
  parameters: {
    docs: {
      description: {
        story: '横方向に要素を並べる。ヘッダーやツールバーに使用する。',
      },
    },
  },
};

export const WithGap: Story = {
  name: 'gap 調整',
  args: {
    gap: 5,
  },
  parameters: {
    docs: {
      description: {
        story:
          '密度の異なるレイアウトを設計するときの間隔基準を確認するために使用する。Controls で 0 〜 6 を切り替え、タイトな密度か呼吸感のあるリズムかを選ぶ判断に使う。',
      },
    },
  },
};

export const WithAlignment: Story = {
  name: '配置指定',
  args: {
    direction: 'horizontal',
    align: 'center',
    justify: 'space-between',
  },
  parameters: {
    docs: {
      description: {
        story: '横方向で配置を指定する。space-between でヘッダーレイアウト等に使用する。',
      },
    },
  },
};

export const WithWrap: Story = {
  name: '折り返し',
  args: {
    direction: 'horizontal',
    wrap: 'wrap',
    gap: 2,
    children: (
      <>
        <DemoBox>折り返し 1</DemoBox>
        <DemoBox color="var(--colors-green-200)">折り返し 2</DemoBox>
        <DemoBox color="var(--colors-red-200)">折り返し 3</DemoBox>
        <DemoBox color="var(--colors-blue-300)">折り返し 4</DemoBox>
        <DemoBox color="var(--colors-green-300)">折り返し 5</DemoBox>
        <DemoBox color="var(--colors-red-300)">折り返し 6</DemoBox>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '横方向で折り返しを有効にする。タグ一覧等の可変個数の要素に使用する。',
      },
    },
  },
};

export const AsList: Story = {
  name: 'ul 要素',
  args: {
    as: 'ul',
    gap: 1,
    children: (
      <>
        <li>
          <DemoBox>リスト項目 1</DemoBox>
        </li>
        <li>
          <DemoBox color="var(--colors-green-200)">リスト項目 2</DemoBox>
        </li>
        <li>
          <DemoBox color="var(--colors-red-200)">リスト項目 3</DemoBox>
        </li>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'ul 要素として描画する。セマンティクスが必要なリストに使用する。',
      },
    },
  },
};

export const AlignCenter: Story = {
  name: '中央揃え',
  args: {
    direction: 'horizontal',
    align: 'center',
    children: (
      <>
        <DemoBox>小さい</DemoBox>
        <DemoBox color="var(--colors-green-200)">
          <div style={{ paddingBlock: '2rem' }}>大きい要素</div>
        </DemoBox>
        <DemoBox color="var(--colors-red-200)">中くらい</DemoBox>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          '異なる高さの要素を横並びにしつつ、視線の高さを揃えたいときに使用する。アイコンとテキスト、フォームラベルと入力欄など、視覚的な基準線を保ちたい組み合わせで使う。',
      },
    },
  },
};

export const JustifyEnd: Story = {
  name: '右寄せ',
  args: {
    direction: 'horizontal',
    justify: 'flex-end',
  },
  parameters: {
    docs: {
      description: {
        story:
          'ダイアログのフッターやツールバーなど、主要操作を右端に固定したいときに使用する。primary / secondary ボタンを並べて読者の視線終端で操作させる場面で使う。',
      },
    },
  },
};
