import type { Decorator, Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import { Overlay } from '@/components/UI/Overlay';

const meta = {
  title: 'UI/Overlay',
  component: Overlay,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Overlay>;

export default meta;
type Story = StoryObj<typeof meta>;

const withOpenDialogSibling: Decorator = (Story) => (
  <>
    <dialog open style={{ display: 'none' }} />
    <Story />
  </>
);

/**
 * 表示状態。Overlay は `dialog[open] ~ &` の sibling セレクタで可視化するため、Storybook では非表示の `<dialog open>` を兄弟として注入して可視状態を再現する。
 *
 * @summary 表示状態
 */
export const Default: Story = {
  name: '表示',
  args: {
    onCloseAction: fn(),
    isOpen: true,
  },
  decorators: [withOpenDialogSibling],
};

/**
 * `isOpen=false` を渡し、かつ可視化のトリガーとなる `<dialog open>` を置かない素の状態。DOM 上は存在するが、`visibility: hidden` と `opacity: 0` で実描画されない挙動を確認する。
 *
 * @summary 非表示状態（dialog sibling なし）
 */
export const Closed: Story = {
  name: '非表示',
  args: {
    onCloseAction: fn(),
    isOpen: false,
  },
};

/**
 * 背景クリックで `onCloseAction` が発火することを検証する。dialog の閉じ操作経路の保証。
 *
 * @summary クリックで onCloseAction 発火
 */
export const ClickToClose: Story = {
  tags: ['!manifest'],
  name: 'クリックで閉じる',
  args: {
    onCloseAction: fn(),
    isOpen: true,
  },
  decorators: [withOpenDialogSibling],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const overlay = canvas.getByTestId('overlay');
    await userEvent.click(overlay);
    await expect(args.onCloseAction).toHaveBeenCalled();
  },
};

/**
 * isOpen=true で DOM に存在し、かつ可視であることのスモークテスト。CSS 非表示と DOM 削除の混同を防ぐ。
 *
 * @summary 可視性のスモークテスト
 */
export const OverlayStructure: Story = {
  tags: ['!manifest'],
  name: 'DOM 確認',
  args: {
    onCloseAction: fn(),
    isOpen: true,
  },
  decorators: [withOpenDialogSibling],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const overlay = canvas.getByTestId('overlay');
    await expect(overlay).toBeInTheDocument();
    await waitFor(() => expect(overlay).toBeVisible());
  },
};
