import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import debounce from '@/lib/utils/debounce';
import { useSearchWithCache } from '../../engine/search';
import { isSearchDataReady, loadAndInitializeSearch } from '../../engine/searchDataLoader';
import type { SearchState } from '../../types';

type UseSearchManagerProps = {
  debounceDelayMs?: number;
  getInitialState?: () => SearchState | null;
};

const initialState: SearchState = {
  results: [],
  query: '',
};

export const useSearchManager = ({ debounceDelayMs = 300, getInitialState }: UseSearchManagerProps = {}) => {
  const [state, setState] = useState<SearchState>(() => getInitialState?.() ?? initialState);
  const [isReady, setIsReady] = useState(isSearchDataReady);
  const searchWithCache = useSearchWithCache();
  const lastQueryRef = useRef('');
  const isReadyRef = useRef(isReady);
  isReadyRef.current = isReady;

  const requestSearchData = useCallback(() => {
    loadAndInitializeSearch()
      .then(() => {
        isReadyRef.current = true;
        setIsReady(true);
      })
      .catch(() => {});
  }, []);

  // マウント時にデータロード開始（プリフェッチ未完了時のフォールバック）
  useEffect(() => {
    if (isReady) return;
    requestSearchData();
  }, [isReady, requestSearchData]);

  const setResults = useCallback((results: SearchState['results'], query: string) => {
    setState({
      results,
      query,
    });
  }, []);

  const reset = useCallback(() => {
    lastQueryRef.current = '';
    setState(initialState);
  }, []);

  /** 即座実行が必要な場合はこれを直接使用 */
  const executeSearch = useCallback(
    (query: string) => {
      const trimmedQuery = query.trim();

      if (!trimmedQuery) {
        reset();
        lastQueryRef.current = '';
        return;
      }

      if (!isReadyRef.current) {
        // データ未ロード時はクエリを保留
        lastQueryRef.current = trimmedQuery;
        requestSearchData();
        return;
      }

      if (trimmedQuery === lastQueryRef.current) {
        return;
      }

      const results = searchWithCache(trimmedQuery);
      setResults(results, trimmedQuery);
      lastQueryRef.current = trimmedQuery;
    },
    [setResults, reset, searchWithCache, requestSearchData],
  );

  // isReady が true になった時、保留中クエリがあれば検索実行
  useEffect(() => {
    if (!isReady || !lastQueryRef.current) return;
    const results = searchWithCache(lastQueryRef.current);
    setResults(results, lastQueryRef.current);
  }, [isReady, searchWithCache, setResults]);

  const debouncedSearch = useMemo(() => debounce(executeSearch, debounceDelayMs), [executeSearch, debounceDelayMs]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return {
    state,
    isReady,
    debouncedSearch,
    executeSearch,
    reset,
    setResults,
  };
};
