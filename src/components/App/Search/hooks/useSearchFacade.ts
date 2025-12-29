'use client';

import { type RefObject, useCallback, useEffect, useMemo, useRef } from 'react';
import { usePostsData } from '../data/usePostsData';
import type { UseSearchFacadeOptions, UseSearchFacadeReturn } from '../types';
import { useSearchDOMRefs } from './useSearchDOMRefs';
import { useSearchFocusState } from './useSearchFocusState';
import { useSearchKeyboard } from './useSearchKeyboard';
import { useSearchManager } from './useSearchManager';
import { useSearchStatePersistence } from './useSearchStatePersistence';
import { useSearchStateRestoration } from './useSearchStateRestoration';

/**
 * Facade Pattern により、複雑な内部実装を隠蔽し、使用側のコードを簡潔にする
 *
 * @description
 * 統合フック数: 8-9 → 6
 * - usePostsData: データフェッチ・キャッシュ
 * - useSearchManager: 検索実行管理
 * - useSearchStatePersistence: 状態永続化
 * - useSearchFocusState: フォーカスインデックス管理
 * - useSearchDOMRefs: DOM参照と操作
 * - useSearchKeyboard: キーボード操作（2フック統合）
 */
export const useSearchFacade = ({
  onClose,
  dialogRef,
  options = {},
}: UseSearchFacadeOptions): UseSearchFacadeReturn => {
  const { persistState = true } = options;

  // ===== データ・検索・永続化 =====
  const { data: archives } = usePostsData();
  const { state, debouncedSearch, executeSearch, setResults } = useSearchManager({
    archives,
  });
  const { saveSearchState, loadSearchState } = useSearchStatePersistence();

  // ===== フォーカス管理（分離） =====
  const { focusedIndex, setFocusedIndex, navigateToIndex, resetFocus } = useSearchFocusState({
    resultsLength: state.results.length,
  });

  const { updateDOMRefs, focusInput, scrollToFocusedElement, setResultRef, getResultRef, clearExcessRefs } =
    useSearchDOMRefs({
      dialogRef: dialogRef as RefObject<HTMLDialogElement>,
    });

  // 検索状態の復元（専用フックに委譲）
  useSearchStateRestoration({
    persistState,
    archives,
    executeSearch,
    setFocusedIndex,
    setResults,
    loadSearchState,
  });

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

  // ===== キーボード操作（統合） =====
  const focusedIndexRef = useRef(focusedIndex);
  const resultsRef = useRef(state.results);

  useEffect(() => {
    focusedIndexRef.current = focusedIndex;
    resultsRef.current = state.results;
  }, [focusedIndex, state.results]);

  const { keyboardProps, handleSearchInput } = useSearchKeyboard({
    onNavigate: navigateToIndex,
    onClose: handleCloseDialog,
    focusedIndexRef,
    resultsRef,
    getResultRef,
    currentQuery: state.query,
    executeSearch,
    debouncedSearch,
  });

  useEffect(() => {
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

  useEffect(() => {
    updateDOMRefs();
    clearExcessRefs(state.results.length);
  }, [state.results.length, updateDOMRefs, clearExcessRefs]);

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
