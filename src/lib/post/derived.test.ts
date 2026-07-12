import { afterEach, describe, expect, test, vi } from 'vitest';

describe('getPostsPopular', () => {
  afterEach(() => {
    vi.doUnmock('~/dist/posts-popular.json');
    vi.resetModules();
  });

  test('複数回呼び出した場合、同一参照を返す', async () => {
    const { getPostsPopular } = await import('./derived');
    expect(getPostsPopular()).toBe(getPostsPopular());
  });

  test('壊れた dist データ (total が number でない) の場合、throw する', async () => {
    vi.doMock('~/dist/posts-popular.json', () => ({
      default: { 'some-slug': { total: 'invalid', ga: 1, hatena: 1 } },
    }));

    const { getPostsPopular } = await import('./derived');
    expect(() => getPostsPopular()).toThrow('[dist/posts-popular] Invalid data');
  });
});

describe('getSimilarPosts', () => {
  afterEach(() => {
    vi.doUnmock('~/dist/posts-similarity.json');
    vi.resetModules();
  });

  test('複数回呼び出した場合、同一参照を返す', async () => {
    const { getSimilarPosts } = await import('./derived');
    expect(getSimilarPosts()).toBe(getSimilarPosts());
  });

  test('壊れた dist データ (トップレベルが配列) の場合、throw する', async () => {
    vi.doMock('~/dist/posts-similarity.json', () => ({
      default: [],
    }));

    const { getSimilarPosts } = await import('./derived');
    expect(() => getSimilarPosts()).toThrow('[dist/posts-similarity] Invalid data');
  });
});
