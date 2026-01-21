import { useCallback, useState } from 'react';

export interface UseSearchFocusStateReturn {
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  resetFocus: () => void;
  moveUp: () => void;
  moveDown: () => void;
  moveToFirst: () => void;
  moveToLast: () => void;
}

interface UseSearchFocusStateProps {
  resultsLength: number;
  /**
   * ループナビゲーションを有効化（デフォルト: true）
   * - true: 最後の次 → 最初、最初の前 → 最後
   * - false: 境界で停止
   */
  loop?: boolean;
}

/**
 * 検索結果のフォーカスインデックス管理
 * @description
 * キーボードナビゲーション用のフォーカス状態を管理する
 */
export const useSearchFocusState = ({
  resultsLength,
  loop = true,
}: UseSearchFocusStateProps): UseSearchFocusStateReturn => {
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const resetFocus = useCallback(() => {
    setFocusedIndex(-1);
  }, []);

  const moveUp = useCallback(() => {
    setFocusedIndex((prev) => {
      if (loop) {
        return prev > -1 ? prev - 1 : resultsLength - 1;
      }
      return Math.max(-1, prev - 1);
    });
  }, [resultsLength, loop]);

  const moveDown = useCallback(() => {
    setFocusedIndex((prev) => {
      if (loop) {
        return prev < resultsLength - 1 ? prev + 1 : -1;
      }
      return Math.min(resultsLength - 1, prev + 1);
    });
  }, [resultsLength, loop]);

  const moveToFirst = useCallback(() => {
    setFocusedIndex(resultsLength > 0 ? 0 : -1);
  }, [resultsLength]);

  const moveToLast = useCallback(() => {
    setFocusedIndex(resultsLength > 0 ? resultsLength - 1 : -1);
  }, [resultsLength]);

  return {
    focusedIndex,
    setFocusedIndex,
    resetFocus,
    moveUp,
    moveDown,
    moveToFirst,
    moveToLast,
  };
};
