'use client';

import { useCallback } from 'react';
import useIsClient from '@/hooks/useIsClient';
import { getSessionStorage, removeSessionStorage, setSessionStorage } from '@/lib/browser/safeSessionStorage';
import type { SearchResultItem, SearchState as SharedSearchState } from '../../types';

type SearchState = {
  query: string;
  results: SearchResultItem[];
  focusedIndex: number;
  isOpen?: boolean;
};

const SEARCH_STORAGE_KEY = 'search-state';
const STORAGE_EXPIRY = 30 * 60 * 1000;

type StoredSearchState = SearchState & {
  timestamp: number;
};

/**
 * 検索状態をsessionStorageから同期的に読み込む
 *
 * useState の lazy initializer など、フック外からの使用を想定。
 * getSessionStorage は SSR 環境では null を返すため安全。
 */
export const readSearchStateSync = (): SharedSearchState | null => {
  const state = getSessionStorage<StoredSearchState>(SEARCH_STORAGE_KEY);
  if (!state) return null;

  const isExpired = Date.now() - state.timestamp > STORAGE_EXPIRY;
  if (isExpired) {
    removeSessionStorage(SEARCH_STORAGE_KEY);
    return null;
  }

  return { query: state.query, results: state.results };
};

/**
 * 検索状態をsessionStorageで永続化するフック
 * 画面遷移後も検索結果を維持するために使用
 */
export const useSearchStatePersistence = () => {
  const isClient = useIsClient();

  const saveSearchState = useCallback(
    (state: SearchState) => {
      if (!isClient) return;

      const storedState: StoredSearchState = {
        ...state,
        isOpen: state.isOpen ?? true,
        timestamp: Date.now(),
      };

      setSessionStorage(SEARCH_STORAGE_KEY, storedState);
    },
    [isClient],
  );

  const loadSearchState = useCallback((): SearchState | null => {
    if (!isClient) return null;

    const state = getSessionStorage<StoredSearchState>(SEARCH_STORAGE_KEY);
    if (!state) return null;

    const isExpired = Date.now() - state.timestamp > STORAGE_EXPIRY;
    if (isExpired) {
      removeSessionStorage(SEARCH_STORAGE_KEY);
      return null;
    }

    const { timestamp, ...searchState } = state;
    return searchState;
  }, [isClient]);

  const clearSearchState = useCallback(() => {
    if (!isClient) return;
    removeSessionStorage(SEARCH_STORAGE_KEY);
  }, [isClient]);

  return {
    saveSearchState,
    loadSearchState,
    clearSearchState,
  };
};
