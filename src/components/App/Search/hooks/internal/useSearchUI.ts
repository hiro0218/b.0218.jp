'use client';

import { type RefObject, useLayoutEffect } from 'react';
import { useSearchDOMRefs } from './useSearchDOMRefs';

/**
 * useSearchUI のオプション
 */
export interface UseSearchUIOptions {
  /** ダイアログの ref（オプション） */
  dialogRef?: RefObject<HTMLDialogElement>;

  /** 現在フォーカスされているインデックス */
  focusedIndex: number;

  /** 検索結果の件数 */
  resultsLength: number;
}

/**
 * useSearchUI の戻り値
 */
export interface UseSearchUIReturn {
  /** 検索結果要素の ref を設定 */
  setResultRef: (index: number, element: HTMLDivElement | null) => void;

  /** 検索結果要素の ref を取得 */
  getResultRef: (index: number) => HTMLDivElement | undefined;

  /** 入力欄にフォーカスを当てる */
  focusInput: () => void;

  /** フォーカスされた要素にスクロールする */
  scrollToFocusedElement: (element: HTMLElement) => void;
}

/**
 * DOM 参照管理、フォーカス操作、スクロール制御を統合
 *
 * @description
 * focusedIndex の変更を監視して DOM 操作を実行:
 * - focusedIndex が -1 → 入力欄にフォーカス
 * - focusedIndex が 0 以上 → 該当要素にフォーカス + スクロール
 */
export const useSearchUI = ({ dialogRef, focusedIndex, resultsLength }: UseSearchUIOptions): UseSearchUIReturn => {
  // ===== DOM 参照管理 =====
  const { updateDOMRefs, focusInput, scrollToFocusedElement, setResultRef, getResultRef, clearExcessRefs } =
    useSearchDOMRefs({
      dialogRef,
    });

  // focusedIndex の変更を監視して DOM 操作を実行
  useLayoutEffect(() => {
    updateDOMRefs();
    clearExcessRefs(resultsLength);

    if (focusedIndex === -1) {
      focusInput();
      return;
    }

    const targetElement = getResultRef(focusedIndex);
    if (targetElement) {
      targetElement.focus();
      scrollToFocusedElement(targetElement);
    }
  }, [resultsLength, focusedIndex, updateDOMRefs, clearExcessRefs, getResultRef, focusInput, scrollToFocusedElement]);

  return {
    setResultRef,
    getResultRef,
    focusInput,
    scrollToFocusedElement,
  };
};
