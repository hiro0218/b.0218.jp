/**
 * @vitest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react';
import { beforeEach, expect, test, vi } from 'vitest';
import type { SearchResultItem } from '../../types';

const searchMocks = vi.hoisted(() => ({
  isReady: false,
  loadAndInitializeSearch: vi.fn(),
  searchWithCache: vi.fn(),
  subscribeSearchDataReady: vi.fn(),
}));

vi.mock('../../engine/searchDataLoader', () => ({
  isSearchDataReady: () => searchMocks.isReady,
  loadAndInitializeSearch: searchMocks.loadAndInitializeSearch,
  subscribeSearchDataReady: searchMocks.subscribeSearchDataReady,
}));

vi.mock('../../engine/search', () => ({
  useSearchWithCache: () => searchMocks.searchWithCache,
}));

import { useSearchManager } from './useSearchManager';

function createDeferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((promiseResolve, promiseReject) => {
    resolve = promiseResolve;
    reject = promiseReject;
  });

  return { promise, resolve, reject };
}

function createSearchResult(query: string): SearchResultItem {
  return {
    title: `${query} result`,
    slug: query.toLowerCase(),
    tags: [query],
    matchType: 'EXACT',
    matchedIn: 'title',
  };
}

beforeEach(() => {
  searchMocks.isReady = false;
  searchMocks.loadAndInitializeSearch.mockReset();
  searchMocks.searchWithCache.mockReset();
  searchMocks.subscribeSearchDataReady.mockReset();
  searchMocks.loadAndInitializeSearch.mockResolvedValue(undefined);
  searchMocks.searchWithCache.mockImplementation((query: string) => [createSearchResult(query)]);
  searchMocks.subscribeSearchDataReady.mockImplementation(() => () => {});
});

test('検索データが準備済みの場合は即座に検索結果を反映する', () => {
  searchMocks.isReady = true;

  const { result } = renderHook(() => useSearchManager());

  act(() => {
    result.current.executeSearch(' React ');
  });

  expect(searchMocks.searchWithCache).toHaveBeenCalledWith('React');
  expect(result.current.state).toEqual({
    query: 'React',
    results: [createSearchResult('React')],
  });
});

test('検索データロード待ち中に reset した場合は古い検索結果を反映しない', async () => {
  const deferred = createDeferred<void>();
  searchMocks.loadAndInitializeSearch.mockReturnValue(deferred.promise);

  const { result } = renderHook(() => useSearchManager());

  act(() => {
    result.current.executeSearch('React');
    result.current.reset();
  });

  searchMocks.isReady = true;
  await act(async () => {
    deferred.resolve();
    await deferred.promise;
  });

  expect(searchMocks.searchWithCache).not.toHaveBeenCalledWith('React');
  expect(result.current.state).toEqual({
    query: '',
    results: [],
  });
});

test('検索データロード待ち中に複数回検索した場合は最後の query だけを反映する', async () => {
  const deferred = createDeferred<void>();
  searchMocks.loadAndInitializeSearch.mockReturnValue(deferred.promise);

  const { result } = renderHook(() => useSearchManager());

  act(() => {
    result.current.executeSearch('React');
    result.current.executeSearch('Next');
  });

  searchMocks.isReady = true;
  await act(async () => {
    deferred.resolve();
    await deferred.promise;
  });

  expect(searchMocks.searchWithCache).toHaveBeenCalledTimes(1);
  expect(searchMocks.searchWithCache).toHaveBeenCalledWith('Next');
  expect(result.current.state).toEqual({
    query: 'Next',
    results: [createSearchResult('Next')],
  });
});
