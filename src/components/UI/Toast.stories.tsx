import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Toast } from '@/components/UI/Toast';

const meta = {
  title: 'UI/Toast',
  component: Toast,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 表示中のトースト。コードブロック横の「コピー」ボタンを押した直後のような、一過性のフィードバックを担う。
 *
 * @summary 表示中
 */
export const Visible: Story = {
  name: '表示',
  args: {
    message: 'コードをコピーしました',
    isVisible: true,
    onHideToast: fn(),
  },
};

/**
 * 非表示状態。アニメーションが完了したあと DOM が残っていても操作の邪魔にならないことを目視確認する。
 *
 * @summary 非表示
 */
export const Hidden: Story = {
  name: '非表示',
  args: {
    message: 'この通知は隠れている',
    isVisible: false,
    onHideToast: fn(),
  },
};

/**
 * トーストをクリックすると `onHideToast` が呼ばれることを検証する。ユーザーが手動で閉じる経路の保証。
 *
 * @summary クリックで onHideToast 発火
 */
export const ClickToDismiss: Story = {
  tags: ['!manifest'],
  name: 'クリックで閉じる',
  args: {
    message: 'クリックすると閉じる',
    isVisible: true,
    onHideToast: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const toast = canvas.getByRole('status');
    await userEvent.click(toast);
    await expect(args.onHideToast).toHaveBeenCalled();
  },
};
