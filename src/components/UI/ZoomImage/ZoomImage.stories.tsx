import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';

import ZoomImage from './ZoomImage';

const meta = {
  title: 'UI/ZoomImage',
  component: ZoomImage,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ZoomImage>;

export default meta;
type Story = StoryObj<typeof meta>;

function placeholder(w: number, h: number): string {
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect fill="#e2e8f0" width="${w}" height="${h}"/><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" fill="#64748b" font-size="14">${w}×${h}</text></svg>`)}`;
}

const Img600x400 = placeholder(600, 400);
const Img80x80 = placeholder(80, 80);

export const Default: Story = {
  name: '基本',
  args: {
    src: Img600x400,
    alt: 'TypeScript の型推論フロー図',
  },
};

export const WithClassName: Story = {
  name: 'className 付き',
  args: {
    src: Img600x400,
    alt: 'コンポーネント構成図',
    className: 'custom-image',
  },
};

export const SmallImage: Story = {
  name: '小さい画像（ズーム不可）',
  args: {
    src: Img80x80,
    alt: 'アイコン画像',
  },
};

export const ClickToZoom: Story = {
  name: 'ズーム操作',
  args: {
    src: Img600x400,
    alt: 'ズーム操作テスト画像',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = await canvas.findByRole('button', { name: '画像をズーム' });
    await userEvent.click(trigger);

    const body = within(document.body);
    const dialog = await body.findByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('open');

    const closeButton = within(dialog).getByRole('button', { name: '閉じる' });
    await expect(closeButton).toBeVisible();
  },
};
