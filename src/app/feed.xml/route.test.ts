import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Post, PostSummary } from '@/types/source';

const posts: PostSummary[] = [
  {
    title: 'Hidden post',
    slug: 'hidden-post',
    date: '2026-01-02T00:00:00.000Z',
    tags: ['test'],
  },
  {
    title: 'Public post',
    slug: 'public-post',
    date: '2026-01-01T00:00:00.000Z',
    tags: ['test'],
  },
];

const fullPosts = new Map<string, Post>([
  [
    'hidden-post',
    {
      ...posts[0],
      content: '<p>Hidden</p>',
      noindex: true,
    },
  ],
  [
    'public-post',
    {
      ...posts[1],
      content: '<p>Public</p>',
    },
  ],
]);

function mockPostSource() {
  vi.doMock('@/lib/source/post', () => ({
    getPostBySlug: (slug: string) => fullPosts.get(slug) ?? null,
    getPostsListJson: () => posts,
  }));
}

describe('feed route', () => {
  afterEach(() => {
    vi.resetModules();
    vi.doUnmock('@/lib/source/post');
  });

  it('全体 RSS には公開記事だけを含める', async () => {
    mockPostSource();

    const { GET } = await import('./route');
    const response = GET();
    const body = await response.text();

    expect(response.headers.get('content-type')).toContain('application/rss+xml');
    expect(body).toContain('<rss');
    expect(body).toContain('Public post');
    expect(body).toContain('https://b.0218.jp/feed.xml');
    expect(body).not.toContain('Hidden post');
  });
});
