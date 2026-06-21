import { useCallback, useEffect, useRef } from 'react';
import useIsClient from '@/hooks/useIsClient';
import { getSessionStorage, removeSessionStorage, setSessionStorage } from '@/lib/browser/safeSessionStorage';
import { isObject } from '@/lib/utils/isObject';
import { isStringArray } from '@/lib/utils/isStringArray';
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

const MATCH_TYPES = new Set(['EXACT', 'PARTIAL', 'EXACT_NO_SPACE', 'PARTIAL_NO_SPACE', 'MULTI_TERM_MATCH', 'NONE']);
const MATCHED_IN = new Set(['title', 'tag', 'both']);

function isSearchResultItem(value: unknown): value is SearchResultItem {
  return (
    isObject(value) &&
    typeof value.slug === 'string' &&
    typeof value.title === 'string' &&
    isStringArray(value.tags) &&
    typeof value.matchType === 'string' &&
    MATCH_TYPES.has(value.matchType) &&
    typeof value.matchedIn === 'string' &&
    MATCHED_IN.has(value.matchedIn)
  );
}

function isStoredSearchState(value: unknown): value is StoredSearchState {
  return (
    isObject(value) &&
    typeof value.query === 'string' &&
    Array.isArray(value.results) &&
    value.results.every(isSearchResultItem) &&
    Number.isFinite(value.timestamp) &&
    (value.isOpen === undefined || typeof value.isOpen === 'boolean')
  );
}

function readValidStoredSearchState(): StoredSearchState | null {
  const state = getSessionStorage<unknown>(SEARCH_STORAGE_KEY);
  if (!state) return null;

  if (!isStoredSearchState(state)) {
    removeSessionStorage(SEARCH_STORAGE_KEY);
    return null;
  }

  return state;
}

function readFreshStoredSearchState(): StoredSearchState | null {
  const state = readValidStoredSearchState();
  if (!state) return null;

  const isExpired = Date.now() - state.timestamp > STORAGE_EXPIRY;
  if (isExpired) {
    removeSessionStorage(SEARCH_STORAGE_KEY);
    return null;
  }

  return state;
}

/**
 * useState の lazy initializer など、フック外からの使用を想定。
 * getSessionStorage は SSR 環境では null を返すため安全。
 */
export const readSearchStateSync = (): SharedSearchState | null => {
  const state = readFreshStoredSearchState();
  if (!state) return null;

  return { query: state.query, results: state.results };
};

/** 画面遷移後も検索結果を維持するために使用 */
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

    const state = readFreshStoredSearchState();
    if (!state) return null;

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

interface UseSearchStateRestorationProps {
  persistState: boolean;
  executeSearch: (query: string) => void;
  setResults: (results: SearchResultItem[], query: string) => void;
  loadSearchState: () => { query: string; results: SearchResultItem[] } | null;
}

export const useSearchStateRestoration = ({
  persistState,
  executeSearch,
  setResults,
  loadSearchState,
}: UseSearchStateRestorationProps) => {
  const hasHydratedResultsRef = useRef(false);
  const hasExecutedRestorationRef = useRef(false);

  // sessionStorage からの復元はマウント時に一度だけ実行する。
  // hasHydrated/hasExecuted フラグで二重実行を防ぐ（loadSearchState は冪等なので再読込しても安全）。
  useEffect(() => {
    if (!persistState) return;

    const savedState = loadSearchState();
    if (!savedState?.query) return;

    if (!hasHydratedResultsRef.current) {
      setResults(savedState.results ?? [], savedState.query);
      hasHydratedResultsRef.current = true;
    }

    if (hasExecutedRestorationRef.current) {
      return;
    }

    // データ未ロード時は executeSearch 内でクエリが保留され、ロード完了後に自動実行される
    executeSearch(savedState.query);
    hasExecutedRestorationRef.current = true;
  }, [executeSearch, loadSearchState, persistState, setResults]);
};
