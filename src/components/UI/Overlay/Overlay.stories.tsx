import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Overlay } from './index';

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

export const Default: Story = {
  name: '表示状態',
  args: {
    onCloseAction: fn(),
    isOpen: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'オーバーレイが表示されている状態。モーダルやズーム画像の背面に使用する。',
      },
    },
  },
};

export const Closed: Story = {
  name: '非表示状態',
  args: {
    onCloseAction: fn(),
    isOpen: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'オーバーレイが非表示の状態。',
      },
    },
  },
};

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
    await expect(overlay).toBeVisible();
  },
};
