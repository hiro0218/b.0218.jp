'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchDOMRefs } from './hooks/useSearchDOMRefs';
import { useSearchExecution } from './hooks/useSearchExecution';
import { useKeyboardNavigation } from './hooks/useSearchKeyboardNavigation';
import type { onCloseDialogProps, onKeyupEventProps, SearchProps, SearchResultData } from './type';

const initialSearchResult: SearchResultData = {
  keyword: '',
  suggestions: [],
  focusedIndex: -1,
};

/**
 * 検索ダイアログでのキーボードナビゲーションとスクロール制御を提供するカスタムフック
 * @param archives - 検索対象の記事データ配列
 * @param closeDialog - ダイアログを閉じる関数
 * @returns 検索データ、キーボードイベントハンドラー、結果要素への参照設定関数
 */
export const useSearchData = (
  archives: SearchProps[],
  closeDialog: onCloseDialogProps,
): {
  searchData: SearchResultData;
  onKeyup: (e: onKeyupEventProps) => void;
  setResultRef: (index: number, element: HTMLDivElement | null) => void;
} => {
  const [searchResult, setSearchResult] = useState<SearchResultData>(initialSearchResult);
  const resultRefs = useRef<(HTMLDivElement | null)[]>([]);
  const domRefs = useSearchDOMRefs();
  const { isNavigationKey } = useKeyboardNavigation({
    searchResult,
    setSearchResult,
    closeDialog,
    domRefs,
  });
  const { debouncedSearch } = useSearchExecution({
    archives,
    setSearchResult,
  });

  // DOM参照更新とref配列初期化（配列長変更時のみ再作成）
  useEffect(() => {
    domRefs.updateDOMRefs();

    const currentLength = resultRefs.current.length;
    const newLength = searchResult.suggestions.length;

    if (currentLength !== newLength) {
      resultRefs.current = new Array(newLength).fill(null);
    }
  }, [searchResult.suggestions.length, domRefs]);

  // フォーカス制御とスクロール処理
  useEffect(() => {
    if (searchResult.focusedIndex === -1) {
      domRefs.focusInput();
    } else if (searchResult.focusedIndex >= 0 && searchResult.focusedIndex < searchResult.suggestions.length) {
      const targetElement = resultRefs.current[searchResult.focusedIndex];
      if (targetElement) {
        targetElement.focus();
        domRefs.scrollToFocusedElement(targetElement);
      }
    }
  }, [searchResult, domRefs]);

  /**
   * インプットフィールドでのキーアップイベントを処理する
   * @param e - キーボードイベント
   * @note 日本語入力中や値が変更されていない場合は処理をスキップ
   */
  const onKeyup = useCallback(
    (e: onKeyupEventProps): void => {
      if (!(e.currentTarget instanceof HTMLInputElement)) {
        return;
      }

      const value = e.currentTarget.value.trim();

      if (e.nativeEvent.isComposing) {
        return;
      }

      if (value === searchResult.keyword) {
        return;
      }

      // フォーカスがinputにある場合のEnterキーは即時検索
      if (e.key === 'Enter' && searchResult.focusedIndex === -1) {
        debouncedSearch(value);
        return;
      }

      if (!isNavigationKey(e.key)) {
        debouncedSearch(value);
      }
    },
    [searchResult.keyword, searchResult.focusedIndex, debouncedSearch, isNavigationKey],
  );

  /**
   * 検索結果要素への参照を設定する
   * @param index - 要素のインデックス
   * @param element - DOM要素またはnull
   */
  const setResultRef = useCallback((index: number, element: HTMLDivElement | null) => {
    resultRefs.current[index] = element;
  }, []);

  return {
    searchData: searchResult,
    onKeyup,
    setResultRef,
  };
};
