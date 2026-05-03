import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Tooltip } from '@/components/UI/Tooltip';

const meta = {
  title: 'UI/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '基本',
  args: {
    text: 'ツールチップ',
    children: <button type="button">ホバーしてください</button>,
  },
  parameters: {
    docs: {
      description: {
        story: 'ホバーで下方向にツールチップを表示する基本形。',
      },
    },
  },
};

export const PositionTop: Story = {
  name: '上方向',
  args: {
    text: '上に表示',
    position: 'top',
    children: <button type="button">上方向</button>,
  },
  parameters: {
    docs: {
      description: {
        story: 'ツールチップを上方向に表示する。下にスペースがない場合に使用する。',
      },
    },
  },
};
