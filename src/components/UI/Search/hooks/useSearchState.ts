import { useCallback, useState } from 'react';
import type { SearchResultItem } from '../types';

export interface SearchState {
  results: SearchResultItem[];
  query: string;
}

const initialState: SearchState = {
  results: [],
  query: '',
};

/**
 * 検索状態管理のシンプルなロジックを提供
 */
export const useSearchState = () => {
  const [state, setState] = useState<SearchState>(initialState);

  const setResults = useCallback((results: SearchResultItem[], query: string) => {
    setState({
      results,
      query,
    });
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    state,
    setResults,
    reset,
  };
};
