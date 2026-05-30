import { type RefObject, useRef } from 'react';

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
  const resultRefsStore = useRef<Map<number, HTMLDivElement> | null>(null);
  if (resultRefsStore.current === null) {
    resultRefsStore.current = new Map<number, HTMLDivElement>();
  }
  const resultRefs = resultRefsStore.current;

  const updateDOMRefs = () => {
    const dialog = actualDialogRef.current;
    if (!dialog) return;

    internalDialogRef.current = dialog;

    if (!inputRef.current?.isConnected) {
      const input = dialog.querySelector<HTMLInputElement>('input[type="search"], input[role="searchbox"]');
      if (input) inputRef.current = input;
    }

    // searchResults は条件付きレンダリングのため、要素が存在しない場合は null を許容
    if (!searchResultsRef.current?.isConnected) {
      searchResultsRef.current = dialog.querySelector<HTMLElement>('[data-search-results]');
    }
  };

  const focusInput = () => {
    const input = inputRef.current;
    const dialog = actualDialogRef.current;

    if (input && dialog?.open) {
      input.focus();
      searchResultsRef.current?.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  const scrollToFocusedElement = (targetElement: HTMLElement) => {
    if (!searchResultsRef.current) return;

    targetElement.scrollIntoView({
      block: 'nearest',
      behavior: 'auto',
    });
  };

  const setResultRef = (index: number, element: HTMLDivElement | null) => {
    if (element) {
      resultRefs.set(index, element);
    } else {
      resultRefs.delete(index);
    }
  };

  const getResultRef = (index: number) => {
    return resultRefs.get(index);
  };

  const clearExcessRefs = (maxSize: number) => {
    const currentSize = resultRefs.size;
    if (currentSize <= maxSize) return;

    for (let i = maxSize; i < currentSize; i++) {
      resultRefs.delete(i);
    }
  };

  return {
    updateDOMRefs,
    focusInput,
    scrollToFocusedElement,
    setResultRef,
    getResultRef,
    clearExcessRefs,
  };
};
