import { useCallback, useRef } from 'react';

export interface UseSearchResultRefsReturn {
  setResultRef: (index: number, element: HTMLDivElement | null) => void;
  getResultRef: (index: number) => HTMLDivElement | undefined;
  clearResultRefs: () => void;
  clearExcessRefs: (maxSize: number) => void;
}

/**
 * 検索結果要素への参照を管理
 * フォーカス・スクロール処理のために各検索結果要素への参照を保持
 */
export const useSearchResultRefs = (): UseSearchResultRefsReturn => {
  const resultRefs = useRef(new Map<number, HTMLDivElement>());

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

  const clearResultRefs = useCallback(() => {
    resultRefs.current.clear();
  }, []);

  const clearExcessRefs = useCallback((maxSize: number) => {
    const currentSize = resultRefs.current.size;
    if (currentSize > maxSize) {
      for (let i = maxSize; i < currentSize; i++) {
        resultRefs.current.delete(i);
      }
    }
  }, []);

  return {
    setResultRef,
    getResultRef,
    clearResultRefs,
    clearExcessRefs,
  };
};
