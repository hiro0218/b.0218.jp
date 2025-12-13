import { useCallback, useState } from 'react';

export interface UseSearchFocusStateReturn {
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  navigateToIndex: (index: number) => void;
  resetFocus: () => void;
  moveUp: () => void;
  moveDown: () => void;
}

interface UseSearchFocusStateProps {
  resultsLength: number;
}

/**
 * 検索結果のフォーカス状態管理
 * キーボードナビゲーションのためのインデックス管理を提供
 */
export const useSearchFocusState = ({ resultsLength }: UseSearchFocusStateProps): UseSearchFocusStateReturn => {
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const navigateToIndex = useCallback(
    (index: number) => {
      setFocusedIndex((prev) => {
        const maxIndex = resultsLength - 1;
        if (index >= -1 && index <= maxIndex) {
          return index;
        }
        return prev;
      });
    },
    [resultsLength],
  );

  const resetFocus = useCallback(() => {
    setFocusedIndex(-1);
  }, []);

  const moveUp = useCallback(() => {
    setFocusedIndex((prev) => (prev > -1 ? prev - 1 : resultsLength - 1));
  }, [resultsLength]);

  const moveDown = useCallback(() => {
    setFocusedIndex((prev) => (prev < resultsLength - 1 ? prev + 1 : -1));
  }, [resultsLength]);

  return {
    focusedIndex,
    setFocusedIndex,
    navigateToIndex,
    resetFocus,
    moveUp,
    moveDown,
  };
};
