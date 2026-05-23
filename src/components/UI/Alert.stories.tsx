import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Alert } from '@/components/UI/Alert';

const meta = {
  title: 'UI/Alert',
  component: Alert,
  args: {
    html: '<p>記事本文中で読者に向けた注意喚起や補足を差し込むためのブロック。本文のリズムから一度視線を外したい箇所で使う。</p>',
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * GitHub Flavored Markdown の `> [!NOTE]` に対応。注釈や参考リンクのような、読み飛ばしても本文の理解は崩れない情報を差し込む。
 *
 * @summary 補足情報（最弱）
 */
export const Note: Story = {
  name: 'Note',
  args: { type: 'note' },
};

/**
 * `> [!TIP]` 対応。効率の良い書き方やショートカットなど、知っていると得をする話を分離する。
 *
 * @summary ベストプラクティスの分離
 */
export const Tip: Story = {
  name: 'Tip',
  args: { type: 'tip' },
};

/**
 * `> [!IMPORTANT]` 対応。読み飛ばすと前提を取り違えるレベルの情報に使う。
 *
 * @summary 前提として読ませたい情報
 */
export const Important: Story = {
  name: 'Important',
  args: { type: 'important' },
};

/**
 * `> [!WARNING]` 対応。手順を間違えたときの副作用を明示する。データ損失や巻き戻し不能な操作の手前に置く。
 *
 * @summary 副作用付き操作の手前で
 */
export const Warning: Story = {
  name: 'Warning',
  args: { type: 'warning' },
};

/**
 * `> [!CAUTION]` 対応。GFM の中で最も強い強調。セキュリティ事故やプロダクション影響の警告に絞る。
 *
 * @summary 強調レベル最大
 */
export const Caution: Story = {
  name: 'Caution',
  args: { type: 'caution' },
};

/**
 * ラベル行を隠してアイコンと本文だけにする派生。種別が文脈から自明な箇所で行数を詰めたいときに使う。
 *
 * @summary ラベル省略の派生
 */
export const HiddenLabel: Story = {
  name: 'ラベル省略',
  args: { type: 'note', hideLabel: true },
};
