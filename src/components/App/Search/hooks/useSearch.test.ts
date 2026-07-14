/**
 * @vitest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import type { SearchResultItem } from '../types';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const searchMocks = vi.hoisted(() => ({
  isReady: true,
  loadAndInitializeSearch: vi.fn(),
  searchWithCache: vi.fn(),
  subscribeSearchDataReady: vi.fn(),
}));

vi.mock('../engine/searchDataLoader', () => ({
  isSearchDataReady: () => searchMocks.isReady,
  loadAndInitializeSearch: searchMocks.loadAndInitializeSearch,
  subscribeSearchDataReady: searchMocks.subscribeSearchDataReady,
}));

vi.mock('../engine/search', () => ({
  useSearchWithCache: () => searchMocks.searchWithCache,
}));

import { useSearch } from './useSearch';

function createSearchResult(query: string): SearchResultItem {
  return {
    title: `${query} result`,
    slug: query.toLowerCase(),
    tags: [query],
    matchType: 'EXACT',
    matchedIn: 'title',
  };
}

afterEach(() => {
  vi.useRealTimers();
});

test('実行済みクエリへ戻る入力の場合、予約済みデバウンス検索を発火させない', () => {
  vi.useFakeTimers();
  searchMocks.searchWithCache.mockImplementation((query: string) => [createSearchResult(query)]);
  searchMocks.subscribeSearchDataReady.mockImplementation(() => () => {});

  const { result } = renderHook(() => useSearch({ persistState: false }));

  act(() => {
    result.current.inputProps.onValueChange('a');
  });
  act(() => {
    vi.advanceTimersByTime(300);
  });

  expect(result.current.query).toBe('a');
  expect(searchMocks.searchWithCache).toHaveBeenCalledWith('a');

  act(() => {
    result.current.inputProps.onValueChange('ab');
  });
  // タイマーは進めない(デバウンス待機中の予約済み検索を残したまま、実行済みクエリへ戻す状況を作る)

  act(() => {
    result.current.inputProps.onValueChange('a');
  });
  act(() => {
    vi.advanceTimersByTime(300);
  });

  expect(result.current.query).toBe('a');
  expect(searchMocks.searchWithCache).not.toHaveBeenCalledWith('ab');
});
