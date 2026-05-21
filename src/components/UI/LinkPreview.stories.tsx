import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

import { LinkPreview } from '@/components/UI/LinkPreview';

function placeholder(w: number, h: number): string {
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect fill="#e2e8f0" width="${w}" height="${h}"/><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" fill="#64748b" font-size="14">${w}×${h}</text></svg>`,
  )}`;
}

const Thumbnail = placeholder(120, 120);

const meta = {
  title: 'UI/LinkPreview',
  component: LinkPreview,
  tags: ['ai-generated'],
  parameters: {
    layout: 'padded',
  },
  args: {
    link: 'https://example.com/page',
    card: 'summary',
    thumbnail: Thumbnail,
    title: 'リンク先ページのタイトル',
    description: 'リンク先ページの概要文を補足として表示する。',
    domain: 'example.com',
  },
} satisfies Meta<typeof LinkPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '基本',
  parameters: {
    docs: {
      description: {
        story: '記事本文中で外部リンクを OGP カード形式で表示する標準形。',
      },
    },
  },
};

export const WithoutThumbnail: Story = {
  name: 'サムネイルなし',
  args: {
    thumbnail: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'OGP 画像が取得できなかった場合の表示。本文領域が全幅になる。',
      },
    },
  },
};

export const LargeImage: Story = {
  name: '大画像カード',
  args: {
    card: 'summary_large_image',
  },
  parameters: {
    docs: {
      description: {
        story: 'OGP の summary_large_image タイプ。広いコンテナで description が表示される。',
      },
    },
  },
};

export const HtmlEntitiesInTitle: Story = {
  tags: ['ai-generated', '!manifest'],
  name: 'HTML エンティティを含むタイトル',
  args: {
    title: '&lt;script&gt; タグと &amp; を含む例',
  },
  parameters: {
    docs: {
      description: {
        story: 'タイトルの HTML エンティティをデコードして表示することを検証する。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('<script> タグと & を含む例')).toBeVisible();
  },
};
