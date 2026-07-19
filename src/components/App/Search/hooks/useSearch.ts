import { type RefObject, useEffect, useId, useLayoutEffect, useRef } from 'react';
import type { SearchResultItem } from '../types';
import { createSearchResultId } from '../utils/resultId';
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
  focusedIndex: number;
  reset: () => void;
  close: () => void;
  inputProps: {
    activeDescendantId?: string;
    listId: string;
    onValueChange: (value: string) => void;
  };
  containerProps: React.DOMAttributes<HTMLElement>;
  setResultRef: (index: number, element: HTMLDivElement | null) => void;
  setFocusedIndex: (index: number) => void;
}

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
  const listId = useId();
  const {
    state,
    debouncedSearch,
    executeSearch,
    reset: resetManager,
  } = useSearchManager({
    debounceDelayMs: debounceMs,
    getInitialState: persistState ? readSearchStateSync : undefined,
  });

  const { saveSearchState, loadSearchState, clearSearchState } = useSearchStatePersistence();

  useSearchStateRestoration({ persistState, executeSearch, loadSearchState });

  useEffect(() => {
    if (!persistState) return;
    if (!state.query && state.results.length === 0) return;
    saveSearchState({ query: state.query, results: state.results });
  }, [persistState, state.query, state.results, saveSearchState]);

  const {
    updateDOMRefs,
    focusInput,
    resetResultScroll,
    scrollToFocusedElement,
    setResultRef,
    getResultRef,
    clearExcessRefs,
  } = useSearchDOMRefs({ dialogRef });

  const resultsRef = useRef<SearchResultItem[]>(state.results);
  const shouldScrollFocusedResultRef = useRef(true);
  useEffect(() => {
    resultsRef.current = state.results;
  }, [state.results]);

  const submitSearch = (query: string) => {
    debouncedSearch.cancel();
    executeSearch(query);
  };

  const { focusedIndex, resetFocus, setFocusedIndex, containerProps } = useSearchNavigation({
    resultsLength: state.results.length,
    onClose,
    loop,
    resultsRef,
    onSubmitQuery: submitSearch,
    onKeyboardNavigation: () => {
      shouldScrollFocusedResultRef.current = true;
    },
  });

  useLayoutEffect(() => {
    updateDOMRefs();
    clearExcessRefs(state.results.length);
  }, [updateDOMRefs, state.results.length, clearExcessRefs]);

  useLayoutEffect(() => {
    if (focusedIndex === -1) {
      focusInput();
      resetResultScroll();
      return;
    }

    if (!shouldScrollFocusedResultRef.current) return;

    const targetElement = getResultRef(focusedIndex);
    if (targetElement) {
      focusInput();
      scrollToFocusedElement(targetElement);
    }
  }, [focusedIndex, getResultRef, focusInput, resetResultScroll, scrollToFocusedElement]);

  const setFocusedIndexFromMouse = (index: number) => {
    shouldScrollFocusedResultRef.current = false;
    setFocusedIndex(index);
  };

  const reset = () => {
    debouncedSearch.cancel();
    resetManager();
    resetFocus();
    clearSearchState();
  };

  const handleClose = () => {
    debouncedSearch.cancel();
    resetFocus();
    if (onClose) onClose();
  };

  const handleSearchInput = (value: string) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      reset();
      return;
    }

    if (trimmedValue === state.query) {
      // 実行済みクエリへ戻った場合、予約済みの古い検索が後から発火して入力欄と結果が食い違うのを防ぐ
      debouncedSearch.cancel();
      return;
    }

    shouldScrollFocusedResultRef.current = true;
    resetFocus();
    debouncedSearch(trimmedValue);
  };

  const activeResult = focusedIndex >= 0 ? state.results[focusedIndex] : undefined;
  const inputProps = {
    activeDescendantId: activeResult ? createSearchResultId(activeResult.slug) : undefined,
    listId,
    onValueChange: handleSearchInput,
  };

  return {
    query: state.query,
    results: state.results,
    focusedIndex,
    reset,
    close: handleClose,
    inputProps,
    containerProps,
    setResultRef,
    setFocusedIndex: setFocusedIndexFromMouse,
  };
};
