import { MagnifyingGlassIcon, ShareNetworkIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { IconLink } from '@/components/UI/IconLink';
import { ICON_SIZE_SM } from '@/ui/iconSizes';

const meta = {
  title: 'UI/IconLink',
  component: IconLink,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof IconLink>;

export default meta;
type Story = StoryObj<typeof meta>;

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
    children: <ShareNetworkIcon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />,
  },
};

/**
 * アイコンだけのリンクで、サイト内の別ページへ移動させるときに使う。Next.js の Link を経由するので、遷移はクライアント側で行われ、`prefetch` も制御できる。
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
