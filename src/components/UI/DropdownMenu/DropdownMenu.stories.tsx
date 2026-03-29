import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';

import { GitHubLogo, ICON_SIZE_SM } from '@/ui/icons';

import { DropdownMenu } from './index';

const menuTitle = (
  <>
    <span className="sr-only">Feedback</span>
    <GitHubLogo height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
  </>
);

const MENU_TRIGGER_NAME = /Feedback/;

const meta = {
  title: 'UI/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '基本',
  args: {
    title: menuTitle,
    children: (
      <>
        <a href="/about">概要</a>
        <a href="/blog">ブログ</a>
        <a href="/contact">お問い合わせ</a>
      </>
    ),
  },
};

export const PositionLeft: Story = {
  name: '左寄せ',
  args: {
    title: menuTitle,
    menuHorizontalPosition: 'left',
    children: (
      <>
        <a href="/about">概要</a>
        <a href="/blog">ブログ</a>
      </>
    ),
  },
};

const menuItems = (
  <>
    <a href="/item-1">項目 1</a>
    <a href="/item-2">項目 2</a>
    <a href="/item-3">項目 3</a>
  </>
);

export const ToggleMenu: Story = {
  name: '開閉操作',
  args: {
    title: menuTitle,
    children: menuItems,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: MENU_TRIGGER_NAME });

    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(trigger).toHaveAttribute('aria-haspopup', 'menu');

    const links = canvas.getAllByRole('link');
    await expect(links).toHaveLength(3);
  },
};
