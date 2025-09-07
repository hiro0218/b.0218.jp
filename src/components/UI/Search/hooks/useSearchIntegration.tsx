import { useCallback, useEffect, useRef, useState } from 'react';
import { useKeyboardNavigation } from './useKeyboardNavigation';
import { useLatestRef } from './useLatestRef';
import { usePostsList } from './usePostsList';
import { useSearchDOMRefs } from './useSearchDOMRefs';
import { useSearchManager } from './useSearchManager';

// パフォーマンス最適化: ナビゲーションキーをSetで管理
const NAV_KEYS = new Set(['ArrowDown', 'ArrowUp', 'Enter', 'Escape']);

type UseSearchIntegrationProps = {
  closeDialog: () => void;
};

/**
 * 検索機能の全体的な統合を管理し、各フックの協調動作を実現する
 * 状態管理、API呼び出し、UIインタラクションを統一されたインターフェースで提供
 * @param props - ダイアログ閉じ関数を含む設定オブジェクト
 * @param props.closeDialog - 検索ダイアログを閉じる関数
 * @returns 検索状態、イベントハンドラー、参照設定関数を含む統合オブジェクト
 * @performance デバウンス処理により過度なAPI呼び出しを防止し、Mapベースの参照管理でメモリ効率を最適化
 */
export const useSearchIntegration = ({ closeDialog }: UseSearchIntegrationProps) => {
  const archives = usePostsList();
  const { state, debouncedSearch, executeSearch, reset } = useSearchManager({ archives });
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const domRefs = useSearchDOMRefs();

  // 最新の値を常に参照できるref（クロージャー問題を回避）
  const focusedIndexRef = useLatestRef(focusedIndex);
  const stateRef = useLatestRef(state.results);

  // 検索結果要素への参照をMapで管理（メモリ効率向上）
  const resultRefs = useRef(new Map<number, HTMLDivElement>());

  const setResultRef = useCallback((index: number, element: HTMLDivElement | null) => {
    if (element) {
      resultRefs.current.set(index, element);
    } else {
      resultRefs.current.delete(index);
    }
  }, []);

  // ナビゲーション処理（最適化: 依存配列なし）
  const navigateToIndex = useCallback(
    (index: number) => {
      setFocusedIndex((prev) => {
        // stateRefから最新の長さを取得
        const maxIndex = stateRef.current.length - 1;
        if (index >= -1 && index <= maxIndex) {
          return index;
        }
        return prev;
      });
    },
    [stateRef.current.length],
  ); // 依存配列なし - 再生成を防止

  // キーボードナビゲーションの統合
  useKeyboardNavigation({
    onNavigate: navigateToIndex,
    onClose: closeDialog,
    focusedIndexRef,
    resultsRef: stateRef,
  });

  // 入力値の変更を検知してデバウンス検索を実行（旧handleKeyUpから統合して命名を改善）
  const handleSearchInput = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!(e.currentTarget instanceof HTMLInputElement) || e.nativeEvent.isComposing) {
        return;
      }

      const value = e.currentTarget.value.trim();
      if (value === state.query) {
        return;
      }

      // Enterキーで即時検索（フォーカスがinputにある場合）
      if (e.key === 'Enter' && focusedIndex === -1) {
        executeSearch(value);
        return;
      }

      // ナビゲーションキー以外の場合はデバウンス検索（Set使用で高速化）
      if (!NAV_KEYS.has(e.key)) {
        debouncedSearch(value);
      }
    },
    [state.query, focusedIndex, executeSearch, debouncedSearch],
  );

  // DOM参照更新と結果Mapの最適化されたクリーンアップ
  useEffect(() => {
    domRefs.updateDOMRefs();

    // パフォーマンス最適化: 必要な分だけMapから削除
    const prevSize = resultRefs.current.size;
    const newSize = state.results.length;

    // 結果が減った場合のみ、余分な要素を削除
    if (prevSize > newSize) {
      for (let i = newSize; i < prevSize; i++) {
        resultRefs.current.delete(i);
      }
    }

    // クリーンアップ: コンポーネントアンマウント時のみ全クリア
    return () => {
      // アンマウント時のチェック（resultsが空の場合）
      if (state.results.length === 0) {
        resultRefs.current.clear();
      }
    };
  }, [state.results.length, domRefs]); // resultsではなくlengthのみ監視

  // フォーカス制御とスクロール処理の統合
  useEffect(() => {
    if (focusedIndex === -1) {
      domRefs.focusInput();
      return;
    }

    const targetElement = resultRefs.current.get(focusedIndex);
    if (targetElement) {
      targetElement.focus();
      domRefs.scrollToFocusedElement(targetElement);
    }
  }, [focusedIndex, domRefs]);

  // クリーンなAPIを提供（後方互換を削除）
  return {
    // 状態
    results: state.results,
    query: state.query,
    focusedIndex,

    // アクション
    onSearchInput: handleSearchInput,
    setFocusedIndex,
    setResultRef,
    closeDialog,
    reset,
  };
};
