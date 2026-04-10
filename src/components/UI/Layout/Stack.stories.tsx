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
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '基本',
  parameters: {
    docs: {
      description: {
        story: '縦方向に要素を並べる基本形。デフォルト gap は 2（8px）。',
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

export const CustomGap: Story = {
  name: 'カスタム gap',
  args: {
    gap: 5,
  },
  parameters: {
    docs: {
      description: {
        story: 'gap を変更して要素間のスペースを調整する。',
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
        story: '異なる高さの要素を交差軸で中央揃えする。',
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
        story: '要素を右寄せする。',
      },
    },
  },
};

export const NoGap: Story = {
  name: 'gap なし',
  args: {
    gap: 0,
  },
  parameters: {
    docs: {
      description: {
        story: 'gap を 0 にしたタイトなレイアウト。メニュー項目等に使用する。',
      },
    },
  },
};
