import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';

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
    <a href="#barrel-file">[TypeScript] Barrel ファイルを廃止する</a>
    <a href="#refresh-token">[Codex] refresh token already used</a>
    <a href="#sdd">仕様駆動開発（SDD）とフロントエンドの相性</a>
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
 * トリガーの左端揃えで右方向へ展開する派生。トリガーが画面左端に寄っているときの既定方向として使う
 * （Anchor Positioning 対応ブラウザでは、はみ出す場合に自動で反転する）。
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
 * トリガークリックで `aria-expanded` / `aria-controls` が更新され、リンク選択・外側クリック・フォーカス移動・
 * Esc キーのいずれでも閉じ、リンク選択と Esc ではトリガーへ focus が戻ることを検証する。フォーカス移動で閉じる場合は
 * 移動先のフォーカスを奪わない。disclosure パターンのアクセシビリティ契約の保証。
 *
 * @summary 開閉操作と閉じ方の検証
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

    const panelId = trigger.getAttribute('aria-controls');
    expect(panelId).toBeTruthy();
    expect(document.getElementById(panelId ?? '')).not.toBeNull();

    const links = canvas.getAllByRole('link');
    expect(links).toHaveLength(3);

    // リンク選択で閉じてトリガーへ focus が戻る
    await userEvent.click(links[0]);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toHaveFocus();

    // 外側クリックで閉じる（useInteractOutside は focus を戻さない）
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(canvasElement);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    // フォーカスがパネルの外へ移ると閉じる（Tab でパネルを通り過ぎても開いたままにしない）。移動先のフォーカスは奪い返さない
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const outside = canvasElement.ownerDocument.createElement('button');
    outside.type = 'button';
    outside.textContent = 'outside';
    canvasElement.after(outside);
    outside.focus();
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
    await expect(outside).toHaveFocus();
    outside.remove();

    // Esc キーで閉じてトリガーへ focus が戻る（最後を今と同じ状態にして VRT の見た目を変えないため、Escape を最後に置く）
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toHaveFocus();
  },
};
