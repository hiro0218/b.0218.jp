import { type RefObject, useEffect } from 'react';
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
 * 検索機能の統合フック
 * @param closeDialog - ダイアログを閉じる関数
 * @param dialogRef - ダイアログへの参照
 * @param persistSearchState - 検索状態を永続化するかどうか
 * @returns 検索機能に必要なすべての状態と関数
 */
export const useSearchIntegration = ({
  closeDialog,
  dialogRef,
  persistSearchState = true,
}: UseSearchIntegrationProps) => {
  const archives = usePostsList();
  const { state, debouncedSearch, executeSearch, reset } = useSearchManager({ archives });
  const { saveSearchState, loadSearchState, clearSearchState } = useSearchStatePersistence();

  const focusManager = useSearchFocusManager({
    resultsLength: state.results.length,
    dialogRef,
  });

  // 初回マウント時に保存された状態を復元
  // biome-ignore lint/correctness/useExhaustiveDependencies: 初回マウント時のみ実行
  useEffect(() => {
    if (!persistSearchState) return;

    const savedState = loadSearchState();
    if (savedState?.query) {
      executeSearch(savedState.query);
      if (savedState.focusedIndex !== undefined) {
        focusManager.state.setFocusedIndex(savedState.focusedIndex);
      }
    }
  }, []);

  // 検索状態が変更されたら保存
  useEffect(() => {
    if (!persistSearchState) return;
    if (!state.query && state.results.length === 0) return;

    saveSearchState({
      query: state.query,
      results: state.results,
      focusedIndex: focusManager.state.focusedIndex,
      isOpen: true, // 検索状態がある場合は常に開いた状態として保存
    });
  }, [persistSearchState, state.query, state.results, focusManager.state.focusedIndex, saveSearchState]);

  const handleCloseDialog = () => {
    focusManager.state.resetAll();
    // ダイアログを閉じる時は検索状態もクリア
    if (persistSearchState) {
      clearSearchState();
    }
    closeDialog();
  };

  const focusedIndexRef = useLatestRef(focusManager.state.focusedIndex);
  const stateRef = useLatestRef(state.results);

  useKeyboardNavigation({
    onNavigate: focusManager.state.navigateToIndex,
    onClose: handleCloseDialog,
    focusedIndexRef,
    resultsRef: stateRef,
  });

  const { handleSearchInput } = useSearchInput({
    currentQuery: state.query,
    focusedIndex: focusManager.state.focusedIndex,
    executeSearch,
    debouncedSearch,
  });

  return {
    results: state.results,
    query: state.query,
    focusedIndex: focusManager.state.focusedIndex,
    onSearchInput: handleSearchInput,
    setFocusedIndex: focusManager.state.setFocusedIndex,
    setResultRef: focusManager.results.setResultRef,
    closeDialog: handleCloseDialog,
    reset,
  };
};
