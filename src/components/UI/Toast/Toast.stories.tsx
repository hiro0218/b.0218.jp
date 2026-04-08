import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Toast } from './Toast';

const meta = {
  title: 'UI/Toast',
  component: Toast,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Visible: Story = {
  name: '表示状態',
  args: {
    message: 'クリップボードにコピーしました',
    isVisible: true,
    onHideToast: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: 'トーストが表示されている状態。クリップボードコピー等の操作フィードバックに使用する。',
      },
    },
  },
};

export const Hidden: Story = {
  name: '非表示状態',
  args: {
    message: 'この通知は非表示です',
    isVisible: false,
    onHideToast: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: 'トーストが非表示の状態。自動消去後やアニメーション完了後の状態。',
      },
    },
  },
};

export const ClickToDismiss: Story = {
  tags: ['!manifest'],
  name: 'クリックで閉じる',
  args: {
    message: 'クリックで閉じます',
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
