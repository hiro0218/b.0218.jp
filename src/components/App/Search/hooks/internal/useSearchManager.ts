import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import debounce from '@/lib/utils/debounce';
import { useSearchWithCache } from '../../engine/search';
import { isSearchDataReady, loadAndInitializeSearch, subscribeSearchDataReady } from '../../engine/searchDataLoader';
import type { SearchState } from '../../types';

type UseSearchManagerProps = {
  debounceDelayMs?: number;
  getInitialState?: () => SearchState | null;
};

const initialState: SearchState = {
  results: [],
  query: '',
};

const getReadyServerSnapshot = () => false;

export const useSearchManager = ({ debounceDelayMs = 300, getInitialState }: UseSearchManagerProps = {}) => {
  const [state, setState] = useState<SearchState>(() => getInitialState?.() ?? initialState);
  const searchRequestIdRef = useRef(0);
  // 検索データの準備状態は外部ストア（searchDataLoader のキャッシュ）を単一の真実として購読する
  const isReady = useSyncExternalStore(subscribeSearchDataReady, isSearchDataReady, getReadyServerSnapshot);
  const searchWithCache = useSearchWithCache();

  const setResults = useCallback((results: SearchState['results'], query: string) => {
    setState({ results, query });
  }, []);

  const reset = useCallback(() => {
    searchRequestIdRef.current += 1;
    setState(initialState);
  }, []);

  /** 即座実行が必要な場合はこれを直接使用 */
  const executeSearch = useCallback(
    (query: string) => {
      const trimmedQuery = query.trim();

      if (!trimmedQuery) {
        reset();
        return;
      }

      const requestId = searchRequestIdRef.current + 1;
      searchRequestIdRef.current = requestId;
      const commitResults = () => {
        if (searchRequestIdRef.current !== requestId) return;
        setResults(searchWithCache(trimmedQuery), trimmedQuery);
      };

      if (!isSearchDataReady()) {
        // データ未ロード時はロード完了後に検索を実行する（React の自動バッチングで最新クエリの結果が反映される）
        loadAndInitializeSearch()
          .then(commitResults)
          .catch(() => {});
        return;
      }

      commitResults();
    },
    [reset, searchWithCache, setResults],
  );

  // マウント時にデータロードを開始（プリフェッチ未完了時のフォールバック）
  useEffect(() => {
    if (isReady) return;
    loadAndInitializeSearch().catch(() => {});
  }, [isReady]);

  const debouncedSearch = useMemo(() => debounce(executeSearch, debounceDelayMs), [debounceDelayMs, executeSearch]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return {
    state,
    debouncedSearch,
    executeSearch,
    reset,
  };
};
