import { useCallback, useState } from 'react';
import type { SearchProps } from '../types';

export interface SearchState {
  results: SearchProps[];
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

  const setResults = useCallback((results: SearchProps[], query: string) => {
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
