import { afterEach, describe, expect, test, vi } from 'vitest';
import { TAG_VIEW_LIMIT } from '@/constants';
import type { TagCounts } from '@/types/source';

describe('getRoutableTags', () => {
  afterEach(() => {
    vi.doUnmock('@/lib/source/tag');
    vi.resetModules();
  });

  test('count が TAG_VIEW_LIMIT 未満のタグを除外する', async () => {
    vi.doMock('@/lib/source/tag', () => ({
      getTagsWithCount: (): TagCounts[] => [{ name: 'below', count: TAG_VIEW_LIMIT - 1 }],
    }));

    const { getRoutableTags } = await import('./routing');
    expect(getRoutableTags()).toEqual([]);
  });

  test('count が TAG_VIEW_LIMIT と等しいタグを含める', async () => {
    vi.doMock('@/lib/source/tag', () => ({
      getTagsWithCount: (): TagCounts[] => [{ name: 'exact', count: TAG_VIEW_LIMIT }],
    }));

    const { getRoutableTags } = await import('./routing');
    expect(getRoutableTags()).toEqual([{ name: 'exact', count: TAG_VIEW_LIMIT }]);
  });

  test('count が TAG_VIEW_LIMIT を超えるタグを含める', async () => {
    vi.doMock('@/lib/source/tag', () => ({
      getTagsWithCount: (): TagCounts[] => [{ name: 'above', count: TAG_VIEW_LIMIT + 1 }],
    }));

    const { getRoutableTags } = await import('./routing');
    expect(getRoutableTags()).toEqual([{ name: 'above', count: TAG_VIEW_LIMIT + 1 }]);
  });
});

describe('getRoutableTagStaticParams', () => {
  afterEach(() => {
    vi.doUnmock('@/lib/source/tag');
    vi.resetModules();
  });

  test('routable なタグの表示名だけを { slug } の配列に変換する', async () => {
    vi.doMock('@/lib/source/tag', () => ({
      getTagsWithCount: (): TagCounts[] => [
        { name: 'react', count: TAG_VIEW_LIMIT + 2 },
        { name: 'below', count: TAG_VIEW_LIMIT - 1 },
      ],
    }));

    const { getRoutableTagStaticParams } = await import('./routing');
    expect(getRoutableTagStaticParams()).toEqual([{ slug: 'react' }]);
  });
});

describe('getRoutableTagByRouteSlug', () => {
  afterEach(() => {
    vi.doUnmock('@/lib/source/tag');
    vi.resetModules();
  });

  test('URL エンコードされたタグ名を解決する', async () => {
    vi.doMock('@/lib/source/tag', () => ({
      getTagsWithCount: (): TagCounts[] => [{ name: 'C++', count: TAG_VIEW_LIMIT + 2 }],
    }));

    const { getRoutableTagByRouteSlug } = await import('./routing');
    expect(getRoutableTagByRouteSlug(encodeURIComponent('C++'))).toEqual({ name: 'C++', count: TAG_VIEW_LIMIT + 2 });
  });

  test('該当タグが存在しない場合、null を返す', async () => {
    vi.doMock('@/lib/source/tag', () => ({
      getTagsWithCount: (): TagCounts[] => [{ name: 'react', count: TAG_VIEW_LIMIT + 2 }],
    }));

    const { getRoutableTagByRouteSlug } = await import('./routing');
    expect(getRoutableTagByRouteSlug('missing')).toBeNull();
  });

  test('count が TAG_VIEW_LIMIT 未満のタグは解決されない', async () => {
    vi.doMock('@/lib/source/tag', () => ({
      getTagsWithCount: (): TagCounts[] => [{ name: 'below', count: TAG_VIEW_LIMIT - 1 }],
    }));

    const { getRoutableTagByRouteSlug } = await import('./routing');
    expect(getRoutableTagByRouteSlug('below')).toBeNull();
  });
});
