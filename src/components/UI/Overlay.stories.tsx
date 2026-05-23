import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import { Overlay } from '@/components/UI/Overlay';

const meta = {
  title: 'UI/Overlay',
  component: Overlay,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <>
        <dialog open style={{ display: 'none' }} />
        <Story />
      </>
    ),
  ],
} satisfies Meta<typeof Overlay>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * オーバーレイが表示されている状態。モーダルやズーム画像の背面に使用する。
 *
 * @summary オーバーレイが表示されている状態
 */
export const Default: Story = {
  name: '表示状態',
  args: {
    onCloseAction: fn(),
    isOpen: true,
  },
};

/**
 * オーバーレイが非表示の状態。
 *
 * @summary オーバーレイが非表示の状態
 */
export const Closed: Story = {
  name: '非表示状態',
  args: {
    onCloseAction: fn(),
    isOpen: false,
  },
};

/**
 * オーバーレイをクリックすると onCloseAction が発火することを検証するインタラクションテスト。
 *
 * @summary オーバーレイをクリックすると onCloseAction が発火することを検証するインタラクションテスト
 */
export const ClickToClose: Story = {
  tags: ['!manifest'],
  name: 'クリックで閉じる',
  args: {
    onCloseAction: fn(),
    isOpen: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const overlay = canvas.getByTestId('overlay');
    await userEvent.click(overlay);
    await expect(args.onCloseAction).toHaveBeenCalled();
  },
};

/**
 * isOpen=true のとき DOM に存在し可視であることを検証するスモークテスト。
 *
 * @summary isOpen=true のとき DOM に存在し可視であることを検証するスモークテスト
 */
export const OverlayStructure: Story = {
  tags: ['!manifest'],
  name: 'DOM 構造確認',
  args: {
    onCloseAction: fn(),
    isOpen: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const overlay = canvas.getByTestId('overlay');
    await expect(overlay).toBeInTheDocument();
    await waitFor(() => expect(overlay).toBeVisible());
  },
};
