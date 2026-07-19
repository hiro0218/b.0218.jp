import { useCallback, useEffect, useRef } from 'react';
import useIsClient from '@/hooks/useIsClient';
import { getSessionStorage, removeSessionStorage, setSessionStorage } from '@/lib/browser/safeSessionStorage';
import { isObject } from '@/lib/utils/isObject';
import { isStringArray } from '@/lib/utils/isStringArray';
import { MATCH_TYPE_VALUES, MATCHED_IN_VALUES, type SearchResultItem, type SearchState } from '../../types';

const SEARCH_STORAGE_KEY = 'search-state';
const STORAGE_EXPIRY = 30 * 60 * 1000;

type StoredSearchState = SearchState & {
  timestamp: number;
};

// 許容値は types.ts の値配列（型の導出元）から構築する。リストが1つしかないため、バリアント追加時の同期漏れは構造的に起きない
const MATCH_TYPES = new Set<string>(MATCH_TYPE_VALUES);
const MATCHED_IN = new Set<string>(MATCHED_IN_VALUES);

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
    Number.isFinite(value.timestamp)
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
export const readSearchStateSync = (): SearchState | null => {
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
  loadSearchState: () => { query: string; results: SearchResultItem[] } | null;
}

/**
 * 保存済みクエリでの再検索を、マウント後に一度だけ実行する。
 * 表示状態の復元は useSearch 側の lazy initializer（readSearchStateSync）が担っており、
 * ここでは保存時点から記事データが変わっている可能性に備えて結果を最新化するだけである。
 * この分担は SearchDialog が開いたときにクライアントでのみ mount される前提に依存する。
 * 常時 mount + SSR/hydration 構成へ変える場合は、hydration mismatch を避けるため effect での表示復元に戻す必要がある。
 */
export const useSearchStateRestoration = ({
  persistState,
  executeSearch,
  loadSearchState,
}: UseSearchStateRestorationProps) => {
  const hasExecutedRestorationRef = useRef(false);

  // loadSearchState は isClient の確定後に有効になるため、依存変化による再実行を ref で一度に抑える
  useEffect(() => {
    if (!persistState) return;
    if (hasExecutedRestorationRef.current) return;

    const savedState = loadSearchState();
    if (!savedState?.query) return;

    // データ未ロード時は executeSearch 内でクエリが保留され、ロード完了後に自動実行される
    executeSearch(savedState.query);
    hasExecutedRestorationRef.current = true;
  }, [executeSearch, loadSearchState, persistState]);
};
