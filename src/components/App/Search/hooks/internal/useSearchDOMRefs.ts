import { type RefObject, useCallback, useRef } from 'react';

interface UseSearchDOMRefsProps {
  dialogRef?: RefObject<HTMLDialogElement>;
}

/**
 * 検索UI用のDOM参照と操作を管理
 * @description
 * - DOM参照管理（dialog, input, searchResults）
 * - DOM操作（入力フォーカス、スクロール）
 * - 検索結果要素への参照管理（Map）
 */
export const useSearchDOMRefs = ({ dialogRef }: UseSearchDOMRefsProps) => {
  const internalDialogRef = useRef<HTMLDialogElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const searchResultsRef = useRef<HTMLElement | null>(null);
  const actualDialogRef = dialogRef || internalDialogRef;
  const resultRefs = useRef(new Map<number, HTMLDivElement>());

  const updateDOMRefs = useCallback(() => {
    const dialog = actualDialogRef.current;
    if (!dialog) return;

    if (inputRef.current && searchResultsRef.current) {
      return;
    }

    internalDialogRef.current = dialog;
    const input = dialog.querySelector('input[role="searchbox"]') as HTMLInputElement;
    const results = dialog.querySelector('[data-search-results]') as HTMLElement;

    if (input) inputRef.current = input;
    if (results) searchResultsRef.current = results;
  }, [actualDialogRef]);

  const focusInput = useCallback(() => {
    const input = inputRef.current;
    const container = searchResultsRef.current;
    const dialog = actualDialogRef.current;

    if (input && container && dialog?.open) {
      input.focus();
      container.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [actualDialogRef]);

  const scrollToFocusedElement = useCallback((targetElement: HTMLElement) => {
    if (!searchResultsRef.current) return;

    targetElement.scrollIntoView({
      block: 'nearest',
      behavior: 'auto',
    });
  }, []);

  const setResultRef = useCallback((index: number, element: HTMLDivElement | null) => {
    if (element) {
      resultRefs.current.set(index, element);
    } else {
      resultRefs.current.delete(index);
    }
  }, []);

  const getResultRef = useCallback((index: number) => {
    return resultRefs.current.get(index);
  }, []);

  const clearExcessRefs = useCallback((maxSize: number) => {
    const currentSize = resultRefs.current.size;
    if (currentSize <= maxSize) return;

    for (let i = maxSize; i < currentSize; i++) {
      resultRefs.current.delete(i);
    }
  }, []);

  return {
    updateDOMRefs,
    focusInput,
    scrollToFocusedElement,
    setResultRef,
    getResultRef,
    clearExcessRefs,
  };
};
