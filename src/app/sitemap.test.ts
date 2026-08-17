import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Post, PostSummary, TagCounts } from '@/types/source';

const hiddenPost: PostSummary = {
  title: 'Hidden post',
  slug: 'hidden-post',
  date: '2026-01-02T00:00:00.000Z',
  tags: ['test'],
};

const publicPost: PostSummary = {
  title: 'Public post',
  slug: 'public-post',
  date: '2026-01-01T00:00:00.000Z',
  updated: '2026-03-01T00:00:00.000Z',
  tags: ['test'],
};

const newerPublishedPost: PostSummary = {
  title: 'Newer published post',
  slug: 'newer-published-post',
  date: '2026-02-01T00:00:00.000Z',
  tags: ['test'],
};

const posts: PostSummary[] = [hiddenPost, newerPublishedPost, publicPost];

const fullPosts = new Map<string, Post>([
  [
    'hidden-post',
    {
      ...hiddenPost,
      content: '<p>Hidden</p>',
      noindex: true,
    },
  ],
  [
    'newer-published-post',
    {
      ...newerPublishedPost,
      content: '<p>Newer</p>',
    },
  ],
  [
    'public-post',
    {
      ...publicPost,
      content: '<p>Public</p>',
    },
  ],
]);

const tags: TagCounts[] = [{ slug: 'test', count: 12 }];

async function loadSitemap() {
  vi.doMock('@/lib/source/post', () => ({
    getPostBySlug: (slug: string) => fullPosts.get(slug) ?? null,
    getPostsListJson: () => posts,
  }));
  vi.doMock('@/lib/source/tag', () => ({
    getTagsWithCount: () => tags,
  }));

  const { default: sitemap } = await import('./sitemap');
  return sitemap();
}

describe('sitemap', () => {
  afterEach(() => {
    vi.resetModules();
    vi.doUnmock('@/lib/source/post');
    vi.doUnmock('@/lib/source/tag');
  });

  it('noindex の記事を URL と更新日計算から除外する', async () => {
    const result = await loadSitemap();
    const urls = result.map((entry) => entry.url);

    expect(urls).toContain('https://b.0218.jp/public-post.html');
    expect(urls).toContain('https://b.0218.jp/newer-published-post.html');
    expect(urls).not.toContain('https://b.0218.jp/hidden-post.html');
    expect(result.find((entry) => entry.url === 'https://b.0218.jp/')?.lastModified).toBe(publicPost.updated);
    expect(result.find((entry) => entry.url === 'https://b.0218.jp/tags/test')?.lastModified).toBe(publicPost.updated);
  });

  it('記事 URL の lastModified は updated があればそれを使う', async () => {
    const result = await loadSitemap();

    expect(result.find((entry) => entry.url === 'https://b.0218.jp/public-post.html')?.lastModified).toBe(
      publicPost.updated,
    );
    expect(result.find((entry) => entry.url === 'https://b.0218.jp/newer-published-post.html')?.lastModified).toBe(
      newerPublishedPost.date,
    );
  });

  it('タグの 2 ページ目以降を sitemap に含める', async () => {
    const result = await loadSitemap();
    const urls = result.map((entry) => entry.url);

    expect(urls).toContain('https://b.0218.jp/tags/test');
    expect(urls).toContain('https://b.0218.jp/tags/test/2');
    expect(result.find((entry) => entry.url === 'https://b.0218.jp/tags/test/2')?.lastModified).toBe(
      publicPost.updated,
    );
  });
});
