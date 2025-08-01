'use client';

import { useCallback, useEffect } from 'react';
import { convertPostSlugToPath } from '@/lib/url';
import type { KeyboardNavigationReturn, SearchResultData } from '../type';
import type { useSearchDOMRefs } from './useSearchDOMRefs';

type KeyboardNavigationParams = {
  // biome-ignore lint/suspicious/noExplicitAny: legacy callback type needs refactoring
  setSearchResult: any;
  // biome-ignore lint/suspicious/noExplicitAny: legacy callback type needs refactoring
  closeDialog: any;
  domRefs: ReturnType<typeof useSearchDOMRefs>;
};

/**
 * 検索ダイアログでのキーボードナビゲーション機能を提供するフック
 * @param params - 検索結果、状態更新関数、ダイアログ制御関数、DOM参照
 * @returns キーボードイベントハンドラーとナビゲーションキー判定関数
 */
export const useKeyboardNavigation = ({
  setSearchResult,
  closeDialog,
  domRefs,
}: KeyboardNavigationParams): KeyboardNavigationReturn => {
  /**
   * ナビゲーションキーかどうかを判定する
   * @param key - キーボードイベントのキー値
   * @returns ナビゲーションキーの場合はtrue
   */
  const isNavigationKey = useCallback((key: string): boolean => {
    return key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter' || key === 'Escape' || key === 'Esc';
  }, []);

  /**
   * グローバルキーボードイベントを処理し、検索結果間のナビゲーションを制御する
   * @note DOM参照の無効化を検出し、必要に応じて参照を更新
   */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // ダイアログが存在しない場合は参照を更新し、それでも存在しなければ処理を中断
      if (!domRefs.dialogRef.current) {
        domRefs.updateDOMRefs();
        if (!domRefs.dialogRef.current) return;
      }

      // 下矢印キー: 次の検索結果項目にフォーカスを移動
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSearchResult((prev: SearchResultData) => {
          // 最後の項目でなければフォーカスインデックスを1つ増加
          if (prev.focusedIndex < prev.suggestions.length - 1) {
            return {
              ...prev,
              focusedIndex: prev.focusedIndex + 1,
            };
          }
          return prev;
        });
        return;
      }

      // 上矢印キー: 前の検索結果項目にフォーカスを移動（入力フィールドに戻る場合も含む）
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSearchResult((prev: SearchResultData) => {
          // フォーカスインデックスが-1より大きければ1つ減少（-1は入力フィールドのフォーカス状態）
          if (prev.focusedIndex > -1) {
            return {
              ...prev,
              focusedIndex: prev.focusedIndex - 1,
            };
          }
          return prev;
        });
        return;
      }

      // Enterキー: フォーカスされている検索結果項目に移動
      if (e.key === 'Enter') {
        setSearchResult((prev: SearchResultData) => {
          // 有効な範囲内でフォーカスされている項目があれば、その記事ページに遷移
          if (prev.focusedIndex >= 0 && prev.focusedIndex < prev.suggestions.length) {
            const suggestion = prev.suggestions[prev.focusedIndex];
            if (suggestion) {
              closeDialog();
              const link = convertPostSlugToPath(suggestion.slug);
              window.location.href = link;
            }
          }
          return prev;
        });
        return;
      }

      // Escapeキー: 検索ダイアログを閉じる
      if (e.key === 'Escape' || e.key === 'Esc') {
        closeDialog();
        return;
      }
    },
    [domRefs, setSearchResult, closeDialog],
  );

  // グローバルキーボードイベントリスナーの登録・削除
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // 入力フォームのフォーカス時に検索結果項目のフォーカスを外す
  useEffect(() => {
    const inputElement = domRefs.inputRef.current;

    const handleFocus = () => {
      // 検索結果項目のフォーカスを外す（focusedIndexを-1に設定して入力フィールドにフォーカス状態を戻す）
      setSearchResult((prev: SearchResultData) => ({
        ...prev,
        focusedIndex: -1,
      }));
    };

    // 入力要素が存在する場合のみイベントリスナーを登録
    if (inputElement) {
      inputElement.addEventListener('focus', handleFocus);
    }

    return () => {
      // クリーンアップ: イベントリスナーを削除
      if (inputElement) {
        inputElement.removeEventListener('focus', handleFocus);
      }
    };
  }, [domRefs.inputRef, setSearchResult]);

  return {
    handleKeyDown,
    isNavigationKey,
  };
};
