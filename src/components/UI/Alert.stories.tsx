import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Alert } from '@/components/UI/Alert';

const meta = {
  title: 'UI/Alert',
  component: Alert,
  args: {
    html: '<p>これはアラートメッセージのデモです。重要な情報をユーザーに伝える際に使用します。</p>',
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 補足情報や参考事項を伝える場合に使用する。最も軽い強調レベル。
 *
 * @summary 補足情報や参考事項を伝える場合に使用する
 */
export const Note: Story = {
  name: 'Note',
  args: {
    type: 'note',
  },
};

/**
 * 効率的な方法やベストプラクティスを提案する場合に使用する。
 *
 * @summary 効率的な方法やベストプラクティスを提案する場合に使用する
 */
export const Tip: Story = {
  name: 'Tip',
  args: {
    type: 'tip',
  },
};

/**
 * 見落とすと困る重要な情報を強調する場合に使用する。
 *
 * @summary 見落とすと困る重要な情報を強調する場合に使用する
 */
export const Important: Story = {
  name: 'Important',
  args: {
    type: 'important',
  },
};

/**
 * 取り消し不能な操作やデータ損失の可能性がある場合に使用する。
 *
 * @summary 取り消し不能な操作やデータ損失の可能性がある場合に使用する
 */
export const Warning: Story = {
  name: 'Warning',
  args: {
    type: 'warning',
  },
};

/**
 * 危険な操作やセキュリティリスクを警告する場合に使用する。最も強い強調レベル。
 *
 * @summary 危険な操作やセキュリティリスクを警告する場合に使用する
 */
export const Caution: Story = {
  name: 'Caution',
  args: {
    type: 'caution',
  },
};

/**
 * ラベルを非表示にしてアイコンと本文のみで表示する。文脈から種類が明らかな場合に使用する。
 *
 * @summary ラベルを非表示にしてアイコンと本文のみで表示する
 */
export const HiddenLabel: Story = {
  name: 'ラベル非表示',
  args: {
    type: 'note',
    hideLabel: true,
  },
};
