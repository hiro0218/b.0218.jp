import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Overlay } from './index';

const meta = {
  title: 'UI/Overlay',
  component: Overlay,
  tags: ['autodocs'],
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
};

export const Closed: Story = {
  name: '非表示状態',
  args: {
    onCloseAction: fn(),
    isOpen: false,
  },
};

export const ClickToClose: Story = {
  name: 'クリックで閉じる',
  args: {
    onCloseAction: fn(),
    isOpen: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const overlay = canvas.getAllByRole('generic').at(-1);

    if (!overlay) {
      throw new Error('Overlay element not found.');
    }

    await userEvent.click(overlay);
    await expect(args.onCloseAction).toHaveBeenCalled();
  },
};

export const OverlayStructure: Story = {
  name: 'DOM 構造確認',
  args: {
    onCloseAction: fn(),
    isOpen: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const overlay = canvas.getAllByRole('generic').at(-1);

    if (!overlay) {
      throw new Error('Overlay element not found.');
    }

    await expect(overlay).toBeInTheDocument();
    await expect(overlay).toBeVisible();
  },
};
