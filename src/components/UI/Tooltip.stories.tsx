import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Tooltip } from '@/components/UI/Tooltip';

const meta = {
  title: 'UI/Tooltip',
  component: Tooltip,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * ホバーで下方向にラベルを出す基本形。アイコンボタンの名称補足が典型用途。
 *
 * @summary 下方向の補足ラベル
 */
export const Default: Story = {
  name: '基本',
  args: {
    text: 'GitHub で開く',
    children: <button type="button">GitHub</button>,
  },
};

/**
 * 下方向にスペースが取れない位置で上に出す派生。フッターの右端アイコンなどで使う。
 *
 * @summary 上方向反転
 */
export const PositionTop: Story = {
  name: '上方向',
  args: {
    text: '上に表示',
    position: 'top',
    children: <button type="button">アクション</button>,
  },
};
