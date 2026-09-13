import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AUTHOR_ICON, SITE_URL } from '@/constants';
import { PostLikes } from './Likes';

const TARGET_URL = `${SITE_URL}/example-post.html`;

/**
 * webmention.io 宛のリクエストだけを差し替え、それ以外は元の fetch に委譲する。
 * Storybook には MSW を導入していないため、loaders 内でグローバルの fetch を
 * 一時的にラップして表示状態を再現する。
 */
function mockLikesEndpoint(children: unknown[]) {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString();
    if (url.includes('webmention.io')) {
      return { ok: true, json: async () => ({ type: 'feed', children }) } as Response;
    }
    return originalFetch(input, init);
  }) as typeof fetch;
}

const meta = {
  title: 'Page/Post/PostLikes',
  component: PostLikes,
  parameters: { layout: 'padded' },
  args: { url: TARGET_URL },
} satisfies Meta<typeof PostLikes>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 記事に webmention 経由のいいねが複数付いた状態。著者アバターが横並びで表示される基本形。
 * @summary いいねが複数ある場合
 */
export const Default: Story = {
  name: 'いいねが複数ある場合',
  loaders: [
    async () => {
      mockLikesEndpoint([
        {
          url: 'https://example.com/a',
          'wm-id': 1,
          'wm-property': 'like-of',
          author: { name: 'Alice', url: 'https://example.com/alice', photo: AUTHOR_ICON },
        },
        {
          url: 'https://example.com/b',
          'wm-id': 2,
          'wm-property': 'like-of',
          author: { name: 'Bob', url: 'https://example.com/bob' },
        },
      ]);
      return {};
    },
  ],
  parameters: {
    docs: {
      description: {
        story: '記事に webmention 経由のいいねが複数付いた状態を示す。著者写真の有無が混在するケースを含む。',
      },
    },
  },
};

/**
 * 送信元が著者写真を返さない場合、イニシャル 1 文字のフォールバック表示になる。
 * @summary 著者写真が無い場合
 */
export const WithoutPhoto: Story = {
  name: '著者写真が無い場合',
  loaders: [
    async () => {
      mockLikesEndpoint([
        {
          url: 'https://example.com/a',
          'wm-id': 1,
          'wm-property': 'like-of',
          author: { name: 'Alice', url: 'https://example.com/alice' },
        },
      ]);
      return {};
    },
  ],
  parameters: {
    docs: {
      description: {
        story: 'webmention.io から著者写真が返らない送信元でも表示が破綻しないことを確認する。',
      },
    },
  },
};

/**
 * いいねが 1 件も無い記事では、見出しごとセクション全体を描画しない。
 * @summary いいねが無い場合
 */
export const Empty: Story = {
  name: 'いいねが無い場合',
  loaders: [
    async () => {
      mockLikesEndpoint([]);
      return {};
    },
  ],
  parameters: {
    docs: {
      description: {
        story: 'いいねが無い記事で空の見出しやセクション枠が残らないことを確認する。',
      },
    },
  },
};
