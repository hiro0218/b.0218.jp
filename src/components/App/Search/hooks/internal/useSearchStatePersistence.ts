'use client';

import { useCallback, useEffect, useRef } from 'react';
import useIsClient from '@/hooks/useIsClient';
import { getSessionStorage, removeSessionStorage, setSessionStorage } from '@/lib/browser/safeSessionStorage';
import type { SearchResultItem, SearchState as SharedSearchState } from '../../types';

type SearchState = {
  query: string;
  results: SearchResultItem[];
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

// ===== 状態復元 =====

interface UseSearchStateRestorationProps {
  persistState: boolean;
  executeSearch: (query: string) => void;
  setResults: (results: SearchResultItem[], query: string) => void;
  loadSearchState: () => { query: string; results: SearchResultItem[] } | null;
}

/**
 * sessionStorage から検索状態を復元し、検索を再実行するフック
 *
 * @description
 * - キャッシュされた結果を即座に表示（初回ハイドレーション）
 * - 転置インデックスによる検索を再実行して最新結果を取得
 */
export const useSearchStateRestoration = ({
  persistState,
  executeSearch,
  setResults,
  loadSearchState,
}: UseSearchStateRestorationProps) => {
  const savedStateRef = useRef<ReturnType<typeof loadSearchState>>(null);
  const hasHydratedResultsRef = useRef(false);
  const hasExecutedRestorationRef = useRef(false);

  const tryRestoreSearchState = useCallback(() => {
    if (!persistState) return;

    const savedState = savedStateRef.current ?? loadSearchState();
    if (!savedState?.query) return;

    // 初回ハイドレーション: キャッシュされた結果を即座に表示
    if (!hasHydratedResultsRef.current) {
      setResults(savedState.results ?? [], savedState.query);
      hasHydratedResultsRef.current = true;
      savedStateRef.current = savedState;
    }

    if (hasExecutedRestorationRef.current) {
      return;
    }

    // 転置インデックスは常に利用可能なため、即座に検索を再実行
    executeSearch(savedState.query);
    hasExecutedRestorationRef.current = true;
  }, [executeSearch, loadSearchState, persistState, setResults]);

  // 初回マウント時の状態初期化
  // biome-ignore lint/correctness/useExhaustiveDependencies: 初回マウント時のみ実行
  useEffect(() => {
    if (!persistState) return;

    savedStateRef.current = loadSearchState();
    hasHydratedResultsRef.current = false;
    hasExecutedRestorationRef.current = false;
    tryRestoreSearchState();
  }, []);

  // 復元を試行
  useEffect(() => {
    tryRestoreSearchState();
  }, [tryRestoreSearchState]);
};
