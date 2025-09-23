import { useCallback, useMemo } from 'react';
import debounce from '@/lib/debounce';
import type { SearchProps } from '../types';
import { useSearchWithCache } from '../utils/search';
import { useSearchState } from './useSearchState';

type UseSearchManagerProps = {
  archives: SearchProps[];
  debounceDelayMs?: number;
};

/**
 * 検索機能の統合管理を提供
 */
export const useSearchManager = ({ archives, debounceDelayMs = 300 }: UseSearchManagerProps) => {
  const { state, setResults, reset } = useSearchState();
  const searchWithCache = useSearchWithCache();

  /** 即座実行が必要な場合はこれを直接使用 */
  const executeSearch = useCallback(
    (query: string) => {
      const trimmedQuery = query.trim();

      // 空文字の場合はリセット
      if (!trimmedQuery) {
        reset();
        return;
      }

      // 同じクエリの場合はスキップ
      if (trimmedQuery === state.query) {
        return;
      }

      const results = searchWithCache(archives, trimmedQuery);
      setResults(results, trimmedQuery);
    },
    [archives, state.query, setResults, reset, searchWithCache],
  );

  // デバウンス処理された検索関数
  const debouncedSearch = useMemo(() => debounce(executeSearch, debounceDelayMs), [executeSearch, debounceDelayMs]);

  return {
    state,
    debouncedSearch,
    executeSearch,
    reset,
  };
};
