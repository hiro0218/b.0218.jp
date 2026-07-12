import { afterEach, describe, expect, test, vi } from 'vitest';

describe('getSimilarTag', () => {
  afterEach(() => {
    vi.doUnmock('~/dist/tags-similarity.json');
    vi.resetModules();
  });

  test('複数回呼び出した場合、同一参照を返す', async () => {
    const { getSimilarTag } = await import('./derived');
    expect(getSimilarTag()).toBe(getSimilarTag());
  });

  test('壊れた dist データ (スコアが number でない) の場合、throw する', async () => {
    vi.doMock('~/dist/tags-similarity.json', () => ({
      default: { tagA: { tagB: 'invalid' } },
    }));

    const { getSimilarTag } = await import('./derived');
    expect(() => getSimilarTag()).toThrow('[dist/tags-similarity] Invalid data');
  });
});

describe('getTagCategoriesJson', () => {
  afterEach(() => {
    vi.doUnmock('~/dist/tag-categories.json');
    vi.resetModules();
  });

  test('複数回呼び出した場合、同一参照を返す', async () => {
    const { getTagCategoriesJson } = await import('./derived');
    expect(getTagCategoriesJson()).toBe(getTagCategoriesJson());
  });

  test('壊れた dist データ (未知のカテゴリ名) の場合、throw する', async () => {
    vi.doMock('~/dist/tag-categories.json', () => ({
      default: { tagA: 'unknown-category' },
    }));

    const { getTagCategoriesJson } = await import('./derived');
    expect(() => getTagCategoriesJson()).toThrow('[dist/tag-categories] Invalid data');
  });
});
