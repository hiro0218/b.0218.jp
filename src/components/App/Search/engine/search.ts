import { useCallback, useRef } from 'react';
import type { SearchResultItem } from '../types';
import { isEmptyQuery } from '../utils/validation';
import { SearchCache } from './cache';
import { performIndexedSearch } from './indexedSearch';
import { ensureSearchEngineSync } from './searchDataLoader';

export const performPostSearch = (searchValue: string): SearchResultItem[] => {
  if (isEmptyQuery(searchValue)) {
    return [];
  }

  if (!ensureSearchEngineSync()) return [];

  return performIndexedSearch(searchValue);
};

/**
 * リアルタイム検索のUX向上のため同一検索語の結果をキャッシュ。LRU方式で最大50件まで保持（メモリ使用量制限）
 */
export const useSearchWithCache = () => {
  const cacheRef = useRef<SearchCache | null>(null);
  if (cacheRef.current === null) {
    cacheRef.current = new SearchCache();
  }

  return useCallback((searchValue: string): SearchResultItem[] => {
    if (!searchValue) return [];

    const cacheKey = SearchCache.createKey(searchValue, 0);

    const cachedResult = cacheRef.current?.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const results = performPostSearch(searchValue);
    cacheRef.current?.set(cacheKey, results);

    return results;
  }, []);
};
