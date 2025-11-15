'use client';

import { type RefObject, useCallback, useEffect, useMemo, useRef } from 'react';
import type { UseSearchFacadeOptions, UseSearchFacadeReturn } from '../types';
import { useKeyboardNavigation } from './useKeyboardNavigation';
import { useLatestRef } from './useLatestRef';
import { usePostsList } from './usePostsList';
import { useSearchFocusManager } from './useSearchFocusManager';
import { useSearchInput } from './useSearchInput';
import { useSearchManager } from './useSearchManager';
import { useSearchStatePersistence } from './useSearchStatePersistence';

/**
 * Facade Pattern により、複雑な内部実装を隠蔽し、使用側のコードを簡潔にする
 */
export const useSearchFacade = ({
  onClose,
  dialogRef,
  options = {},
}: UseSearchFacadeOptions): UseSearchFacadeReturn => {
  const { persistState = true } = options;

  const archives = usePostsList();
  const { state, debouncedSearch, executeSearch, setResults } = useSearchManager({
    archives,
  });
  const { saveSearchState, loadSearchState } = useSearchStatePersistence();

  const focusManager = useSearchFocusManager({
    resultsLength: state.results.length,
    dialogRef: dialogRef as RefObject<HTMLDialogElement>,
  });
  const { focusedIndex, setFocusedIndex, resetAll: resetFocus, navigateToIndex } = focusManager.state;
  const { setResultRef } = focusManager.results;
  const savedStateRef = useRef<ReturnType<typeof loadSearchState>>(null);
  const hasHydratedResultsRef = useRef(false);
  const hasExecutedRestorationRef = useRef(false);

  const tryRestoreSearchState = useCallback(() => {
    if (!persistState) return;

    const savedState = savedStateRef.current ?? loadSearchState();
    if (!savedState?.query) return;

    if (!hasHydratedResultsRef.current) {
      setResults(savedState.results ?? [], savedState.query);
      hasHydratedResultsRef.current = true;
      savedStateRef.current = savedState;
    }

    if (!archives.length) {
      return;
    }

    if (hasExecutedRestorationRef.current) {
      return;
    }

    executeSearch(savedState.query);
    if (savedState.focusedIndex !== undefined) {
      setFocusedIndex(savedState.focusedIndex);
    }
    hasExecutedRestorationRef.current = true;
  }, [archives.length, executeSearch, loadSearchState, persistState, setFocusedIndex, setResults]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: 初回マウント時のみ実行
  useEffect(() => {
    if (!persistState) return;

    savedStateRef.current = loadSearchState();
    hasHydratedResultsRef.current = false;
    hasExecutedRestorationRef.current = false;
    tryRestoreSearchState();
  }, []);

  useEffect(() => {
    tryRestoreSearchState();
  }, [tryRestoreSearchState]);

  useEffect(() => {
    if (!persistState) return;
    if (!state.query && state.results.length === 0) return;

    saveSearchState({
      query: state.query,
      results: state.results,
      focusedIndex,
    });
  }, [persistState, state.query, state.results, focusedIndex, saveSearchState]);

  const handleCloseDialog = useCallback(() => {
    resetFocus();
    onClose();
  }, [resetFocus, onClose]);

  const focusedIndexRef = useLatestRef(focusedIndex);
  const stateRef = useLatestRef(state.results);

  const { keyboardProps } = useKeyboardNavigation({
    onNavigate: navigateToIndex,
    onClose: handleCloseDialog,
    focusedIndexRef,
    resultsRef: stateRef,
  });

  const { handleSearchInput } = useSearchInput({
    currentQuery: state.query,
    focusedIndex,
    executeSearch,
    debouncedSearch,
  });

  const ui = useMemo(
    () => ({
      inputProps: {
        onKeyUp: handleSearchInput,
      },
      containerProps: keyboardProps,
      setResultRef,
    }),
    [handleSearchInput, keyboardProps, setResultRef],
  );

  const actions = useMemo(
    () => ({
      close: handleCloseDialog,
    }),
    [handleCloseDialog],
  );

  return {
    results: state.results,
    query: state.query,
    focusedIndex,
    ui,
    actions,
  };
};
