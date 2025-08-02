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
 * @note アクセシビリティ向上のため、矢印キーでの項目移動とEnterキーでの選択を実装
 * @param setSearchResult - 検索結果状態の更新関数
 * @param closeDialog - ダイアログを閉じる関数
 * @param domRefs - 入力フィールドとダイアログのDOM参照
 * @returns キーボードイベントハンドラーとナビゲーションキー判定関数
 */
export const useKeyboardNavigation = ({
  setSearchResult,
  closeDialog,
  domRefs,
}: KeyboardNavigationParams): KeyboardNavigationReturn => {
  /**
   * ナビゲーションキーかどうかを判定する
   * @note 検索入力での不要なイベント処理を回避するために使用
   */
  const isNavigationKey = useCallback((key: string): boolean => {
    return key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter' || key === 'Escape' || key === 'Esc';
  }, []);

  /**
   * グローバルキーボードイベントを処理し、検索結果間のナビゲーションを制御する
   * @note DOM参照の無効化を検出し、必要に応じて参照を更新してイベント処理の継続性を保つ
   */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // DOM参照が無効化された場合の復旧処理（React StrictModeでの再マウント対応）
      if (!domRefs.dialogRef.current) {
        domRefs.updateDOMRefs();
        if (!domRefs.dialogRef.current) return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSearchResult((prev: SearchResultData) => {
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

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSearchResult((prev: SearchResultData) => {
          // -1は入力フィールドのフォーカス状態を表す
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

      if (e.key === 'Enter') {
        setSearchResult((prev: SearchResultData) => {
          if (prev.focusedIndex >= 0 && prev.focusedIndex < prev.suggestions.length) {
            const suggestion = prev.suggestions[prev.focusedIndex];
            if (suggestion) {
              closeDialog();
              const link = convertPostSlugToPath(suggestion.slug);
              // Next.js App Routerでの確実なページ遷移のためwindow.location.hrefを使用
              window.location.href = link;
            }
          }
          return prev;
        });
        return;
      }

      if (e.key === 'Escape' || e.key === 'Esc') {
        closeDialog();
        return;
      }
    },
    [domRefs, setSearchResult, closeDialog],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  /**
   * 入力フィールドにフォーカスが戻った際の状態リセット処理
   * @note ユーザーが検索語を変更する際に、以前の選択状態を引き継がないようにする
   */
  useEffect(() => {
    const inputElement = domRefs.inputRef.current;

    const handleFocus = () => {
      // focusedIndexを-1にリセットして入力フィールドのフォーカス状態を示す
      setSearchResult((prev: SearchResultData) => ({
        ...prev,
        focusedIndex: -1,
      }));
    };

    if (inputElement) {
      inputElement.addEventListener('focus', handleFocus);
    }

    return () => {
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
