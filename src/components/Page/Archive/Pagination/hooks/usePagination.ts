import { useMemo } from 'react';
import { ARCHIVE_CONFIG } from '../../constants';

type UsePaginationOptions = {
  totalPages: number;
  currentPage: number;
  siblingCount?: number;
};

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, idx) => idx + start);
}

/**
 * ページネーション範囲計算フック
 * @param totalPages 総ページ数
 * @param currentPage 現在のページ番号（useCurrentPageで既に正規化済み）
 * @param siblingCount 現在ページの両側に表示する兄弟ページ数
 * @returns ページネーション表示範囲（数値またはドット文字列の配列）
 */
export function usePagination({
  totalPages,
  currentPage,
  siblingCount = 1,
}: UsePaginationOptions): (string | number)[] {
  return useMemo(() => {
    if (totalPages <= 0) {
      return [];
    }

    const totalPageNumbers = siblingCount + 5;
    if (totalPageNumbers >= totalPages) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    // 左側のドットのみ表示
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      return [...range(1, leftItemCount), ARCHIVE_CONFIG.dots, totalPages];
    }

    // 右側のドットのみ表示
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      return [1, ARCHIVE_CONFIG.dots, ...range(totalPages - rightItemCount + 1, totalPages)];
    }

    // 両側のドットを表示
    if (shouldShowLeftDots && shouldShowRightDots) {
      return [1, ARCHIVE_CONFIG.dots, ...range(leftSiblingIndex, rightSiblingIndex), ARCHIVE_CONFIG.dots, totalPages];
    }

    return range(1, totalPages);
  }, [siblingCount, currentPage, totalPages]);
}
