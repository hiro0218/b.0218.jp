import { afterEach, describe, expect, test, vi } from 'vitest';
import type { PostPopularityScores, PostSummary } from '@/types/source';

describe('isIgnoredPostTag', () => {
  // ここでは何もモックしないが、動的 import でキャッシュされた実モジュールが後続の
  // describe (vi.doMock 前提) に漏れないよう、他ブロックと同様にモジュールキャッシュを都度破棄する。
  afterEach(() => {
    vi.resetModules();
  });

  test('無視リストに含まれるタグの場合、true を返す', async () => {
    const { isIgnoredPostTag } = await import('./list');
    expect(isIgnoredPostTag('名探偵コナン')).toBe(true);
  });

  test('無視リストに含まれないタグの場合、false を返す', async () => {
    const { isIgnoredPostTag } = await import('./list');
    expect(isIgnoredPostTag('React')).toBe(false);
  });
});

describe('getFilteredPosts', () => {
  afterEach(() => {
    vi.doUnmock('@/lib/source/post');
    vi.resetModules();
  });

  test('無視タグを含む記事を除外する', async () => {
    const posts: PostSummary[] = [
      { slug: 'a', title: 'A', date: '2024-01-02', tags: ['React'] },
      { slug: 'b', title: 'B', date: '2024-01-01', tags: ['名探偵コナン'] },
    ];
    vi.doMock('@/lib/source/post', () => ({
      getPostsListJson: (): PostSummary[] => posts,
    }));

    const { getFilteredPosts } = await import('./list');
    expect(getFilteredPosts().map((post) => post.slug)).toEqual(['a']);
  });
});

describe('getRecentPosts', () => {
  afterEach(() => {
    vi.doUnmock('@/lib/source/post');
    vi.resetModules();
  });

  test('date 降順の一覧から先頭6件を返す', async () => {
    const posts: PostSummary[] = Array.from({ length: 8 }, (_, index) => ({
      slug: `post-${index}`,
      title: `Post ${index}`,
      date: `2024-01-${String(8 - index).padStart(2, '0')}`,
      tags: [],
    }));
    vi.doMock('@/lib/source/post', () => ({
      getPostsListJson: (): PostSummary[] => posts,
    }));

    const { getRecentPosts } = await import('./list');
    expect(getRecentPosts().map((post) => post.slug)).toEqual([
      'post-0',
      'post-1',
      'post-2',
      'post-3',
      'post-4',
      'post-5',
    ]);
  });

  test('複数回呼び出した場合、同一参照を返す', async () => {
    vi.doMock('@/lib/source/post', () => ({
      getPostsListJson: (): PostSummary[] => [],
    }));

    const { getRecentPosts } = await import('./list');
    expect(getRecentPosts()).toBe(getRecentPosts());
  });
});

describe('getPopularPost', () => {
  afterEach(() => {
    vi.doUnmock('@/lib/post/derived');
    vi.resetModules();
  });

  test('人気度 (total) の降順で返す', async () => {
    const scores: PostPopularityScores = {
      'post-a': { total: 10, ga: 5, hatena: 5 },
      'post-b': { total: 30, ga: 20, hatena: 10 },
      'post-c': { total: 20, ga: 15, hatena: 5 },
    };
    vi.doMock('@/lib/post/derived', () => ({
      getPostsPopular: (): PostPopularityScores => scores,
    }));
    const posts: PostSummary[] = [
      { slug: 'post-a', title: 'A', date: '2024-01-01', tags: [] },
      { slug: 'post-b', title: 'B', date: '2024-01-02', tags: [] },
      { slug: 'post-c', title: 'C', date: '2024-01-03', tags: [] },
    ];

    const { getPopularPost } = await import('./list');
    expect(getPopularPost(posts, 10).map((post) => post.slug)).toEqual(['post-b', 'post-c', 'post-a']);
  });

  test('恒久的に無視される記事スラッグを除外する', async () => {
    const scores: PostPopularityScores = {
      '20141105125846': { total: 100, ga: 100, hatena: 0 },
      'post-a': { total: 10, ga: 5, hatena: 5 },
    };
    vi.doMock('@/lib/post/derived', () => ({
      getPostsPopular: (): PostPopularityScores => scores,
    }));
    const posts: PostSummary[] = [
      { slug: '20141105125846', title: 'Ignored', date: '2024-01-01', tags: [] },
      { slug: 'post-a', title: 'A', date: '2024-01-02', tags: [] },
    ];

    const { getPopularPost } = await import('./list');
    expect(getPopularPost(posts, 10).map((post) => post.slug)).toEqual(['post-a']);
  });

  test('displayLimit で件数を絞り込む', async () => {
    const scores: PostPopularityScores = {
      'post-a': { total: 10, ga: 5, hatena: 5 },
      'post-b': { total: 30, ga: 20, hatena: 10 },
    };
    vi.doMock('@/lib/post/derived', () => ({
      getPostsPopular: (): PostPopularityScores => scores,
    }));
    const posts: PostSummary[] = [
      { slug: 'post-a', title: 'A', date: '2024-01-01', tags: [] },
      { slug: 'post-b', title: 'B', date: '2024-01-02', tags: [] },
    ];

    const { getPopularPost } = await import('./list');
    expect(getPopularPost(posts, 1).map((post) => post.slug)).toEqual(['post-b']);
  });
});
