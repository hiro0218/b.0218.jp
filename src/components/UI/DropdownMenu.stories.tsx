import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';

import { DropdownMenu } from '@/components/UI/DropdownMenu';
import { ICON_SIZE_SM } from '@/ui/iconSizes';
import { GitHubLogo } from '@/ui/icons/GitHubLogo';

const meta = {
  title: 'UI/DropdownMenu',
  component: DropdownMenu,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const menuTitle = <GitHubLogo height={ICON_SIZE_SM} width={ICON_SIZE_SM} />;

const MENU_TRIGGER_NAME = /Feedback/;

const interactionMenuItems = (
  <>
    <a href="/posts/202605021758">[TypeScript] Barrel ファイルを廃止する</a>
    <a href="/posts/202604271115">[Codex] refresh token already used</a>
    <a href="/posts/202603081143">仕様駆動開発（SDD）とフロントエンドの相性</a>
  </>
);

/**
 * トリガーの右端揃えで展開する標準形。記事フッターのフィードバックボタンが典型。
 *
 * @summary 右寄せ展開の標準
 */
export const Default: Story = {
  name: '基本',
  args: {
    title: menuTitle,
    triggerLabel: 'Feedback',
    children: (
      <>
        <a href="https://github.com/example/repo/issues/new">不具合を報告</a>
        <a href="https://github.com/example/repo/edit/main/article.md">記事を編集</a>
        <a href="https://github.com/example/repo">リポジトリを開く</a>
      </>
    ),
  },
};

/**
 * トリガーの左端揃えで展開する派生。トリガーが画面右端に寄っているときに、メニューが画面外に出ないように使う。
 *
 * @summary 左寄せ展開の派生
 */
export const PositionLeft: Story = {
  name: '左寄せ',
  args: {
    title: menuTitle,
    triggerLabel: 'Feedback',
    menuHorizontalPosition: 'left',
    children: (
      <>
        <a href="/posts">記事一覧</a>
        <a href="/tags">タグ一覧</a>
      </>
    ),
  },
};

/**
 * トリガークリックで `aria-expanded` と `aria-haspopup` が正しく更新されることを検証する。アクセシビリティ契約の保証。
 *
 * @summary 開閉時の ARIA 更新検証
 */
export const ToggleMenu: Story = {
  tags: ['!manifest'],
  name: '開閉操作',
  args: {
    title: menuTitle,
    triggerLabel: 'Feedback',
    children: interactionMenuItems,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: MENU_TRIGGER_NAME });

    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(trigger).toHaveAttribute('aria-haspopup', 'menu');

    const links = canvas.getAllByRole('link');
    expect(links).toHaveLength(3);
  },
};
