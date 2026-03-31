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

export const Default: Story = {
  name: '基本',
  parameters: {
    docs: {
      description: {
        story: '水平中央揃えの基本形。max-width 80rem。',
      },
    },
  },
};

export const WithGutters: Story = {
  name: 'ガター付き',
  args: {
    gutters: 3,
  },
  parameters: {
    docs: {
      description: {
        story: '左右に内側余白を付与する。モバイル幅での端ぶつかりを防ぐ。',
      },
    },
  },
};

export const Intrinsic: Story = {
  name: '内在的な中央揃え',
  args: {
    intrinsic: true,
    children: <DemoBox>内在的な中央揃え（flex column + align center）</DemoBox>,
  },
  parameters: {
    docs: {
      description: {
        story: 'flex column + align center による内在的な中央揃え。子要素の幅に応じて縮む。',
      },
    },
  },
};

export const CustomMaxWidth: Story = {
  name: 'カスタム max-width',
  args: {
    maxWidth: '40rem',
    children: <DemoBox>幅を狭めた中央揃え（max 40rem）</DemoBox>,
  },
  parameters: {
    docs: {
      description: {
        story: 'max-width をカスタム値に変更する。狭いコンテンツ幅が必要な場合に使用する。',
      },
    },
  },
};

export const AsSection: Story = {
  name: 'section 要素',
  args: {
    as: 'section',
    children: <DemoBox>section 要素として描画</DemoBox>,
  },
  parameters: {
    docs: {
      description: {
        story: 'section 要素として描画する。セマンティクスが必要な場合に使用する。',
      },
    },
  },
};
