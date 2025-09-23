import { useCallback } from 'react';

const NAV_KEYS = new Set(['ArrowDown', 'ArrowUp', 'Enter', 'Escape'] as const);

type UseSearchInputProps = {
  currentQuery: string;
  focusedIndex: number;
  executeSearch: (query: string) => void;
  debouncedSearch: (query: string) => void;
};

export const useSearchInput = ({ currentQuery, focusedIndex, executeSearch, debouncedSearch }: UseSearchInputProps) => {
  const handleSearchInput = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!(e.currentTarget instanceof HTMLInputElement) || e.nativeEvent.isComposing) {
        return;
      }

      const value = e.currentTarget.value.trim();
      if (value === currentQuery) {
        return;
      }

      if (e.key === 'Enter' && focusedIndex === -1) {
        executeSearch(value);
        return;
      }

      if (!NAV_KEYS.has(e.key)) {
        debouncedSearch(value);
      }
    },
    [currentQuery, focusedIndex, executeSearch, debouncedSearch],
  );

  return {
    handleSearchInput,
  };
};
