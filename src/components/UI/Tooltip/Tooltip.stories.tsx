import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Tooltip } from './index';

const meta = {
  title: 'UI/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
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
};

export const PositionTop: Story = {
  name: '上方向',
  args: {
    text: '上に表示',
    position: 'top',
    children: <button type="button">上方向</button>,
  },
};
