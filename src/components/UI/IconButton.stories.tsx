import { ArrowDownTrayIcon, MagnifyingGlassIcon, ShareIcon } from '@heroicons/react/24/outline';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import { IconButton } from '@/components/UI/IconButton';
import { ICON_SIZE_SM } from '@/ui/iconSizes';

const meta = {
  title: 'UI/IconButton',
  component: IconButton,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * クリック操作を担う基本形。検索トリガーや共有のような、テキスト無しでアイコン 1 つで意図を伝える UI で使う。
 * @summary button モードの基本
 */
export const Button: Story = {
  name: 'button',
  args: {
    'aria-label': '検索を開く',
    children: <MagnifyingGlassIcon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />,
    onClick: fn(),
  },
};

/**
 * ホバー時にツールチップを出す派生。アイコンだけで意図が読み取りにくいケースで補足説明を付ける。
 * @summary ツールチップ付き
 */
export const WithTooltip: Story = {
  name: 'tooltip 付き',
  args: {
    'aria-label': '共有する',
    tooltip: '共有する',
    children: <ShareIcon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />,
    onClick: fn(),
  },
};

/**
 * 操作不可状態。クリップボード API 未対応など、機能が使えない環境で誤操作を防ぐ表現として使う。
 * @summary disabled
 */
export const Disabled: Story = {
  name: 'disabled',
  args: {
    'aria-label': 'この環境ではコピーできない',
    children: <ArrowDownTrayIcon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />,
    disabled: true,
  },
};

/**
 * ドロップダウンメニュー展開中など、外部状態によって hover overlay を強制表示する派生。
 * @summary 強制 active 表示
 */
export const ForcedActive: Story = {
  name: 'data-active 強制表示',
  args: {
    'aria-label': 'メニューを開く',
    children: <ShareIcon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />,
    'data-active': true,
  },
};

/**
 * 外部サイトへ遷移するアイコン。X やはてなブックマークへの送出など、`target="_blank"` と `rel="noreferrer"` をコンポーネント側で強制したい用途で使う。
 * @summary 外部リンク
 */
export const ExternalLink: Story = {
  name: '外部リンク',
  args: {
    'aria-label': 'X で記事を共有',
    as: 'externalLink',
    href: 'https://x.com/intent/tweet',
    children: <ShareIcon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />,
  },
};

/**
 * 内部ページへの遷移。Next.js の Link を経由したクライアントサイド遷移で、`prefetch` 制御も可能。
 * @summary 内部リンク
 */
export const InternalLink: Story = {
  name: '内部リンク',
  args: {
    'aria-label': '記事一覧へ',
    as: 'link',
    href: '/posts',
    children: <MagnifyingGlassIcon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />,
  },
};

/**
 * 一辺 44px に縮めた派生。検索ダイアログのクリアボタンのように、コンパクトな行内へ収めつつ最小タッチターゲットを確保したい場面で使う。
 * @summary touch サイズ（44px）
 */
export const TouchSize: Story = {
  name: 'touch サイズ',
  args: {
    'aria-label': '検索キーワードをクリア',
    size: 'touch',
    children: <MagnifyingGlassIcon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />,
    onClick: fn(),
  },
};
