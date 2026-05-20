import { type RefObject, useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import type { SearchResultItem } from '../types';
import { useSearchDOMRefs } from './internal/useSearchDOMRefs';
import { useSearchManager } from './internal/useSearchManager';
import { useSearchNavigation } from './internal/useSearchNavigation';
import {
  readSearchStateSync,
  useSearchStatePersistence,
  useSearchStateRestoration,
} from './internal/useSearchStatePersistence';

export interface UseSearchOptions {
  onClose?: () => void;
  dialogRef?: RefObject<HTMLDialogElement>;
  persistState?: boolean;
  debounceMs?: number;
  loop?: boolean;
}

export interface UseSearchReturn {
  query: string;
  results: SearchResultItem[];
  isLoading: boolean;
  error: Error | null;
  focusedIndex: number;
  search: (query: string) => void;
  debouncedSearch: (query: string) => void;
  reset: () => void;
  close: () => void;
  inputProps: { onKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => void };
  containerProps: React.DOMAttributes<HTMLElement>;
  setResultRef: (index: number, element: HTMLDivElement | null) => void;
}

const NAV_KEYS: ReadonlySet<string> = new Set(['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', 'Escape']);

/**
 * @summary 検索ダイアログの状態 / DOM 参照 / キーボードナビゲーションを統合する hook。
 *
 * @example
 * const search = useSearch({ onClose, dialogRef });
 * <input {...search.inputProps} />
 * <div {...search.containerProps}>
 *   {search.results.map((r, i) => <div ref={(el) => search.setResultRef(i, el)} key={r.slug}>{r.title}</div>)}
 * </div>
 */
export const useSearch = ({
  onClose,
  dialogRef,
  persistState = true,
  debounceMs = 300,
  loop = true,
}: UseSearchOptions): UseSearchReturn => {
  const {
    state,
    isReady,
    debouncedSearch,
    executeSearch,
    reset: resetManager,
    setResults,
  } = useSearchManager({
    debounceDelayMs: debounceMs,
    getInitialState: persistState ? readSearchStateSync : undefined,
  });

  const { saveSearchState, loadSearchState, clearSearchState } = useSearchStatePersistence();

  useSearchStateRestoration({ persistState, executeSearch, setResults, loadSearchState });

  useEffect(() => {
    if (!persistState) return;
    if (!state.query && state.results.length === 0) return;
    saveSearchState({ query: state.query, results: state.results });
  }, [persistState, state.query, state.results, saveSearchState]);

  const reset = useCallback(() => {
    resetManager();
    clearSearchState();
  }, [resetManager, clearSearchState]);

  const { updateDOMRefs, focusInput, scrollToFocusedElement, setResultRef, getResultRef, clearExcessRefs } =
    useSearchDOMRefs({ dialogRef });

  const resultsRef = useRef<SearchResultItem[]>(state.results);
  resultsRef.current = state.results;

  const { focusedIndex, resetFocus, containerProps } = useSearchNavigation({
    resultsLength: state.results.length,
    onClose,
    loop,
    resultsRef,
    getResultRef,
  });

  useLayoutEffect(() => {
    updateDOMRefs();
    clearExcessRefs(state.results.length);
  }, [updateDOMRefs, state.results.length, clearExcessRefs]);

  useLayoutEffect(() => {
    if (focusedIndex === -1) {
      focusInput();
      return;
    }
    const targetElement = getResultRef(focusedIndex);
    if (targetElement) {
      targetElement.focus();
      scrollToFocusedElement(targetElement);
    }
  }, [focusedIndex, getResultRef, focusInput, scrollToFocusedElement]);

  const focusedIndexRef = useRef(focusedIndex);
  focusedIndexRef.current = focusedIndex;

  const handleClose = useCallback(() => {
    resetFocus();
    if (onClose) onClose();
  }, [resetFocus, onClose]);

  const handleSearchInput = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!(e.currentTarget instanceof HTMLInputElement) || e.nativeEvent.isComposing) return;

      const value = e.currentTarget.value.trim();
      if (value === state.query) return;

      if (e.key === 'Enter' && focusedIndexRef.current === -1) {
        executeSearch(value);
        return;
      }
      if (!NAV_KEYS.has(e.key)) {
        debouncedSearch(value);
      }
    },
    [state.query, executeSearch, debouncedSearch],
  );

  const inputProps = useMemo(() => ({ onKeyUp: handleSearchInput }), [handleSearchInput]);

  return {
    query: state.query,
    results: state.results,
    isLoading: !isReady,
    error: null,
    focusedIndex,
    search: executeSearch,
    debouncedSearch,
    reset,
    close: handleClose,
    inputProps,
    containerProps,
    setResultRef,
  };
};
