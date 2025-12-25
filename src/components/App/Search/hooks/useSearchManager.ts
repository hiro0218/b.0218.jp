import { useCallback, useMemo, useRef, useState } from 'react';
import { useSearchWithCache } from '@/components/App/Search/engine/searchEngine';
import type { SearchProps } from '@/components/App/Search/types';
import debounce from '@/lib/utils/debounce';
import type { SearchState } from '../types';

type UseSearchManagerProps = {
  archives: SearchProps[];
  debounceDelayMs?: number;
};

const initialState: SearchState = {
  results: [],
  query: '',
};

/**
 * 検索機能の統合管理を提供
 */
export const useSearchManager = ({ archives, debounceDelayMs = 300 }: UseSearchManagerProps) => {
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

      const results = searchWithCache(archives, trimmedQuery);
      setResults(results, trimmedQuery);
      lastQueryRef.current = trimmedQuery;
    },
    [archives, setResults, reset, searchWithCache],
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
