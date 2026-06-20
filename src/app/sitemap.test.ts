import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Post, PostSummary, TagCounts } from '@/types/source';

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

const tags: TagCounts[] = [{ slug: 'test', count: 2 }];

describe('sitemap', () => {
  afterEach(() => {
    vi.resetModules();
    vi.doUnmock('@/lib/source/post');
    vi.doUnmock('@/lib/source/tag');
  });

  it('noindex の記事を URL と更新日計算から除外する', async () => {
    vi.doMock('@/lib/source/post', () => ({
      getPostBySlug: (slug: string) => fullPosts.get(slug) ?? null,
      getPostsListJson: () => posts,
    }));
    vi.doMock('@/lib/source/tag', () => ({
      getTagsWithCount: () => tags,
    }));

    const { default: sitemap } = await import('./sitemap');
    const result = sitemap();
    const urls = result.map((entry) => entry.url);

    expect(urls).toContain('https://b.0218.jp/public-post.html');
    expect(urls).not.toContain('https://b.0218.jp/hidden-post.html');
    expect(result.find((entry) => entry.url === 'https://b.0218.jp/')?.lastModified).toBe(posts[1].date);
    expect(result.find((entry) => entry.url === 'https://b.0218.jp/tags/test')?.lastModified).toBe(posts[1].date);
  });
});
