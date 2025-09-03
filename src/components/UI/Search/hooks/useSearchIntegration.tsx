import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePostsList } from './usePostsList';
import { useSearchDOMRefs } from './useSearchDOMRefs';
import { useSearchManager } from './useSearchManager';

interface UseSearchIntegrationProps {
  closeDialog: () => void;
}

/**
 * 検索機能の全体的な統合を管理し、各フックの協調動作を実現する
 * 状態管理、API呼び出し、UIインタラクションを統一されたインターフェースで提供
 */
export const useSearchIntegration = ({ closeDialog }: UseSearchIntegrationProps) => {
  const router = useRouter();
  const archives = usePostsList();
  const { state, debouncedSearch, immediateSearch, reset } = useSearchManager({ archives });
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const domRefs = useSearchDOMRefs();

  // refを使って最新の値を参照できるようにする
  const focusedIndexRef = useRef(focusedIndex);
  const stateRef = useRef(state);

  // refを更新
  useEffect(() => {
    focusedIndexRef.current = focusedIndex;
  }, [focusedIndex]);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // ナビゲーションキーかどうかを判定
  const isNavigationKey = useCallback((key: string): boolean => {
    return ['ArrowDown', 'ArrowUp', 'Enter', 'Escape', 'Home', 'End', 'PageUp', 'PageDown'].includes(key);
  }, []);

  // キーアップイベントの処理
  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!(e.currentTarget instanceof HTMLInputElement)) {
        return;
      }

      const value = e.currentTarget.value.trim();

      if (e.nativeEvent.isComposing) {
        return;
      }

      if (value === state.query) {
        return;
      }

      // フォーカスがinputにある場合のEnterキーは即時検索
      if (e.key === 'Enter' && focusedIndex === -1) {
        immediateSearch(value);
        return;
      }

      if (!isNavigationKey(e.key)) {
        debouncedSearch(value);
      }
    },
    [state.query, focusedIndex, immediateSearch, debouncedSearch, isNavigationKey],
  );

  // 検索結果要素への参照を管理
  const resultRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setResultRef = useCallback((index: number, element: HTMLDivElement | null) => {
    resultRefs.current[index] = element;
  }, []);

  // DOM参照更新とref配列初期化（配列長変更時のみ再作成）
  useEffect(() => {
    domRefs.updateDOMRefs();

    const currentLength = resultRefs.current.length;
    const newLength = state.results.length;

    if (currentLength !== newLength) {
      resultRefs.current = new Array(newLength).fill(null);
    }
  }, [state.results.length, domRefs]);

  // フォーカス制御とスクロール処理
  useEffect(() => {
    if (focusedIndex === -1) {
      domRefs.focusInput();
    } else if (focusedIndex >= 0 && focusedIndex < state.results.length) {
      const targetElement = resultRefs.current[focusedIndex];
      if (targetElement) {
        targetElement.focus();
        domRefs.scrollToFocusedElement(targetElement);
      }
    }
  }, [focusedIndex, state.results.length, domRefs]);

  // グローバルキーダウンイベントの処理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 検索ダイアログが開いていて、inputまたは検索結果にフォーカスがある場合のみ処理
      const target = e.target as HTMLElement;
      const isSearchInput = target.tagName === 'INPUT' && target.getAttribute('role') === 'searchbox';
      const isSearchResult = target.closest('[data-search-results]') !== null;

      if (!isSearchInput && !isSearchResult) {
        return;
      }

      // 最新の値を取得
      const currentFocusedIndex = focusedIndexRef.current;
      const currentState = stateRef.current;
      const resultsCount = currentState.results.length;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (resultsCount > 0) {
            // インプットから最初の結果、または次の結果へ移動
            const nextIndex = currentFocusedIndex + 1;
            if (nextIndex < resultsCount) {
              setFocusedIndex(nextIndex);
            }
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          // 前の結果、またはインプットへ戻る
          const prevIndex = currentFocusedIndex - 1;
          if (prevIndex >= -1) {
            setFocusedIndex(prevIndex);
          }
          break;

        case 'Enter':
          if (currentFocusedIndex >= 0 && currentFocusedIndex < resultsCount) {
            e.preventDefault();
            const result = currentState.results[currentFocusedIndex];
            if (result) {
              router.push(`/${result.slug}`);
              closeDialog();
            }
          }
          break;

        case 'Escape':
          e.preventDefault();
          closeDialog();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [router, closeDialog]); // 依存配列を最小限に

  // フォーカスインデックスのリセット（新しい検索時）
  useEffect(() => {
    setFocusedIndex(-1);
  }, []);

  return {
    // SearchPanel用のProps
    searchPanelProps: {
      results: state.results,
      searchQuery: state.query,
      focusedIndex,
      closeDialog,
      setResultRef,
    },
    // SearchHeader用のProps
    searchHeaderProps: {
      onKeyUp: handleKeyUp,
      searchQuery: state.query,
    },
    // その他の関数
    setFocusedIndex,
    reset,
  };
};
