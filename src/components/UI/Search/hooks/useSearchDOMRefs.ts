import { useCallback, useRef } from 'react';
import type { SearchDOMRefsReturn } from '../type';

/**
 * 検索ダイアログのDOM参照管理とフォーカス制御を提供するフック
 * @returns DOM参照の更新、フォーカス制御、スクロール制御の関数と参照オブジェクト
 */
export const useSearchDOMRefs = (): SearchDOMRefsReturn => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  /**
   * ダイアログとインプット要素のDOM参照を更新する
   * @note 検索ダイアログが開いている状態でのみ有効な参照を取得
   */
  const updateDOMRefs = useCallback(() => {
    const dialog = document.querySelector('dialog[open]') as HTMLDialogElement;
    const input = dialog?.querySelector('input[role="searchbox"]') as HTMLInputElement;

    dialogRef.current = dialog;
    inputRef.current = input;
  }, []);

  /**
   * インプットフィールドにフォーカスを戻し、検索結果リストを先頭にスクロールする
   * @note キャッシュされた参照を優先し、無効時のみDOM検索を実行
   */
  const focusInput = useCallback(() => {
    const input = inputRef.current;
    const container = dialogRef.current?.querySelector('[data-search-results]') as HTMLElement;

    if (input && container) {
      input.focus();
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  /**
   * フォーカスされた要素が画面内に見えるようにスムーズスクロールを実行する
   * @param targetElement - スクロール対象の要素
   * @note 要素が表示範囲外にある場合のみスクロールを実行し、8pxのマージンを確保
   */
  const scrollToFocusedElement = useCallback((targetElement: HTMLElement) => {
    const searchResultsContainer = dialogRef.current?.querySelector('[data-search-results]') as HTMLElement;
    if (!searchResultsContainer) return;

    const containerRect = searchResultsContainer.getBoundingClientRect();
    const elementRect = targetElement.getBoundingClientRect();

    // スクロールが必要かどうかを判定
    const isAboveContainer = elementRect.top < containerRect.top;
    const isBelowContainer = elementRect.bottom > containerRect.bottom;

    if (isAboveContainer || isBelowContainer) {
      const elementOffsetTop = targetElement.offsetTop;
      const containerHeight = searchResultsContainer.clientHeight;
      const elementHeight = targetElement.offsetHeight;

      searchResultsContainer.scrollTo({
        top: isAboveContainer ? elementOffsetTop - 8 : elementOffsetTop - containerHeight + elementHeight + 8,
        behavior: 'smooth',
      });
    }
  }, []);

  return {
    updateDOMRefs,
    focusInput,
    scrollToFocusedElement,
    dialogRef,
    inputRef,
  };
};
