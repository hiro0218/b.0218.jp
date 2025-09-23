import { useMemo } from 'react';
import { ARCHIVE_CONFIG } from '../../constants';

type Props = {
  totalCount: number;
  pageSize: number;
  totalPages: number;
  siblingCount?: number;
  currentPage: number;
};

const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, idx) => idx + start);

type PaginationResult = {
  paginationRange: (string | number)[];
};

/**
 * ページネーション範囲計算フック
 * @param totalCount 総アイテム数
 * @param pageSize ページサイズ
 * @param totalPages 総ページ数
 * @param siblingCount 現在ページの両側に表示する兄弟ページ数
 * @param currentPage 現在のページ番号
 * @returns ページネーション表示範囲（数値またはドット文字列の配列）
 */
export const usePagination = ({
  totalCount,
  pageSize,
  totalPages,
  siblingCount = 1,
  currentPage,
}: Props): PaginationResult => {
  const safeCurrentPage = useMemo(() => {
    return Math.max(1, Math.min(currentPage, Math.max(1, totalPages)));
  }, [currentPage, totalPages]);

  const paginationRange = useMemo(() => {
    if (totalCount === 0 || pageSize === 0) {
      return [];
    }
    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= totalPages) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(safeCurrentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(safeCurrentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);

      return [...leftRange, ARCHIVE_CONFIG.dots, lastPageIndex];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [firstPageIndex, ARCHIVE_CONFIG.dots, ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, ARCHIVE_CONFIG.dots, ...middleRange, ARCHIVE_CONFIG.dots, lastPageIndex];
    }

    return range(1, totalPages);
  }, [totalCount, pageSize, siblingCount, safeCurrentPage, totalPages]);

  return {
    paginationRange,
  };
};
