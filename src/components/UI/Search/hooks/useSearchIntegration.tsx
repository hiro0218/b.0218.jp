'use client';

import { type RefObject, useCallback, useEffect, useRef } from 'react';
import { useKeyboardNavigation } from './useKeyboardNavigation';
import { useLatestRef } from './useLatestRef';
import { usePostsList } from './usePostsList';
import { useSearchFocusManager } from './useSearchFocusManager';
import { useSearchInput } from './useSearchInput';
import { useSearchManager } from './useSearchManager';
import { useSearchStatePersistence } from './useSearchStatePersistence';

type UseSearchIntegrationProps = {
  closeDialog: () => void;
  dialogRef?: RefObject<HTMLDialogElement>;
  persistSearchState?: boolean;
};

/**
 * 検索機能の統合フック（検索状態永続化とキーボードナビゲーションを統合）
 * ビジネス要件：UX向上のため画面遷移時も検索状態を保持する必要がある
 * @param closeDialog ダイアログ終了処理
 * @param dialogRef ダイアログ要素への参照
 * @param persistSearchState 検索状態永続化の有効/無効（デフォルト: true）
 * @returns 統合された検索機能インターフェース
 */
export const useSearchIntegration = ({
  closeDialog,
  dialogRef,
  persistSearchState = true,
}: UseSearchIntegrationProps) => {
  const archives = usePostsList();
  const {
    state,
    debouncedSearch,
    executeSearch,
    reset: resetSearchState,
    setResults,
  } = useSearchManager({
    archives,
  });
  const { saveSearchState, loadSearchState, clearSearchState } = useSearchStatePersistence();

  const focusManager = useSearchFocusManager({
    resultsLength: state.results.length,
    dialogRef,
  });
  const { focusedIndex, setFocusedIndex, resetAll: resetFocus, navigateToIndex } = focusManager.state;
  const { setResultRef } = focusManager.results;
  const savedStateRef = useRef<ReturnType<typeof loadSearchState>>(null);
  const hasHydratedResultsRef = useRef(false);
  const hasExecutedRestorationRef = useRef(false);

  const tryRestoreSearchState = useCallback(() => {
    if (!persistSearchState) return;

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
  }, [archives.length, executeSearch, loadSearchState, persistSearchState, setFocusedIndex, setResults]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: 初回マウント時のみ実行
  useEffect(() => {
    if (!persistSearchState) return;

    savedStateRef.current = loadSearchState();
    hasHydratedResultsRef.current = false;
    hasExecutedRestorationRef.current = false;
    tryRestoreSearchState();
  }, []);

  useEffect(() => {
    tryRestoreSearchState();
  }, [tryRestoreSearchState]);

  useEffect(() => {
    if (!persistSearchState) return;
    if (!state.query && state.results.length === 0) return;

    saveSearchState({
      query: state.query,
      results: state.results,
      focusedIndex,
    });
  }, [persistSearchState, state.query, state.results, focusedIndex, saveSearchState]);

  const handleCloseDialog = () => {
    resetFocus();
    closeDialog();
  };

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

  const reset = useCallback(() => {
    resetFocus();
    resetSearchState();
    hasHydratedResultsRef.current = false;
    hasExecutedRestorationRef.current = false;
    savedStateRef.current = null;
    if (persistSearchState) {
      clearSearchState();
    }
  }, [clearSearchState, persistSearchState, resetFocus, resetSearchState]);

  return {
    results: state.results,
    query: state.query,
    focusedIndex,
    onSearchInput: handleSearchInput,
    setFocusedIndex,
    setResultRef,
    closeDialog: handleCloseDialog,
    reset,
    keyboardProps,
  };
};
