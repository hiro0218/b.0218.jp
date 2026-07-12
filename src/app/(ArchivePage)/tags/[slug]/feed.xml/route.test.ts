import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Post, PostSummary, TagCounts } from '@/types/source';

const posts: PostSummary[] = [
  {
    title: 'Hidden tag post',
    slug: 'hidden-post',
    date: '2026-01-03T00:00:00.000Z',
    tags: ['test'],
  },
  {
    title: 'Public tag post',
    slug: 'public-post',
    date: '2026-01-02T00:00:00.000Z',
    tags: ['test'],
  },
  {
    title: 'Other post',
    slug: 'other-post',
    date: '2026-01-01T00:00:00.000Z',
    tags: ['other'],
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
  [
    'other-post',
    {
      ...posts[2],
      content: '<p>Other</p>',
    },
  ],
]);

const tags: TagCounts[] = [
  { slug: 'test', count: 3 },
  { slug: 'small', count: 2 },
];

function mockSources() {
  vi.doMock('@/lib/source/post', () => ({
    getPostBySlug: (slug: string) => fullPosts.get(slug) ?? null,
    getPostsListJson: () => posts,
  }));
  vi.doMock('@/lib/source/tag', () => ({
    getTagsWithCount: () => tags,
  }));
}

describe('tag feed route', () => {
  afterEach(() => {
    vi.resetModules();
    vi.doUnmock('@/lib/source/post');
    vi.doUnmock('@/lib/source/tag');
  });

  it('公開タグだけを静的生成対象にする', async () => {
    mockSources();

    const { generateStaticParams } = await import('./route');

    expect(generateStaticParams()).toEqual([{ slug: 'test' }]);
  });

  it('タグ RSS には該当タグの公開記事だけを含める', async () => {
    mockSources();

    const { GET } = await import('./route');
    const response = await GET(new Request('https://b.0218.jp/tags/test/feed.xml'), {
      params: Promise.resolve({ slug: 'test' }),
    });
    const body = await response.text();

    expect(response.headers.get('content-type')).toContain('application/rss+xml');
    expect(body).toContain('<rss');
    expect(body).toContain('Public tag post');
    expect(body).toContain('https://b.0218.jp/tags/test/feed.xml');
    expect(body).not.toContain('Hidden tag post');
    expect(body).not.toContain('Other post');
  });

  it('公開対象外タグは 404 を返す', async () => {
    mockSources();

    const { GET } = await import('./route');
    const response = await GET(new Request('https://b.0218.jp/tags/small/feed.xml'), {
      params: Promise.resolve({ slug: 'small' }),
    });

    expect(response.status).toBe(404);
  });
});
