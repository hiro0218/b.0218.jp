import { useCallback, useMemo, useRef, useState } from 'react';
import { useSearchWithCache } from '@/components/App/Search/engine/search';
import debounce from '@/lib/utils/debounce';
import type { SearchState } from '../../types';

type UseSearchManagerProps = {
  debounceDelayMs?: number;
};

const initialState: SearchState = {
  results: [],
  query: '',
};

/**
 * 検索機能の統合管理を提供
 * @description
 * 転置インデックスベースの高速検索を使用
 * archivesパラメータは不要（ビルド時生成の検索インデックスを使用）
 */
export const useSearchManager = ({ debounceDelayMs = 300 }: UseSearchManagerProps = {}) => {
  const [state, setState] = useState<SearchState>(initialState);
  const searchWithCache = useSearchWithCache();
  const lastQueryRef = useRef('');

  const setResults = useCallback((results: SearchState['results'], query: string) => {
    setState({
      results,
      query,
    });
  }, []);

  const reset = useCallback(() => {
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

      if (trimmedQuery === lastQueryRef.current) {
        return;
      }

      const results = searchWithCache(trimmedQuery);
      setResults(results, trimmedQuery);
      lastQueryRef.current = trimmedQuery;
    },
    [setResults, reset, searchWithCache],
  );

  const debouncedSearch = useMemo(() => debounce(executeSearch, debounceDelayMs), [executeSearch, debounceDelayMs]);

  return {
    state,
    debouncedSearch,
    executeSearch,
    reset,
    setResults,
  };
};
