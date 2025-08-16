import { useMemo } from 'react';
import { DOTS } from './constant';

/**
 * Props type definition for pagination functionality
 */
type Props = {
  /** Total number of items */
  totalCount: number;
  /** Number of items per page */
  pageSize: number;
  /** Number of sibling pages to show on each side */
  siblingCount?: number;
  /** Current page number */
  currentPage: number;
};

/**
 * Generate an array of consecutive numbers within the specified range
 * @param start - Start number (inclusive)
 * @param end - End number (inclusive)
 * @returns Array of consecutive numbers within the specified range
 */
const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, idx) => idx + start);

/**
 * ページネーション結果の型定義
 */
type PaginationResult = {
  /** Array of page numbers or ellipsis (...) */
  paginationRange: (string | number)[];
  /** Total page count */
  totalPageCount: number;
  /** Last page number */
  lastPageNumber: number;
  /** Safe current page number (clamped to valid range) */
  safeCurrentPage: number;
};

/**
 * Custom hook to generate an array of page numbers needed for pagination display
 * Arranges page numbers and ellipsis (...) appropriately around the current page
 * @param props - Pagination configuration
 * @param props.totalCount - Total number of items
 * @param props.pageSize - Number of items per page
 * @param props.siblingCount - Number of sibling pages to show on each side
 * @param props.currentPage - Current page number
 * @returns Object containing pagination information
 */
export const usePagination = ({ totalCount, pageSize, siblingCount = 1, currentPage }: Props): PaginationResult => {
  // 総ページ数を計算
  const totalPageCount = useMemo(() => Math.ceil(totalCount / pageSize), [totalCount, pageSize]);

  // 現在のページが有効範囲内に収まるように調整
  const safeCurrentPage = useMemo(() => {
    return Math.max(1, Math.min(currentPage, Math.max(1, totalPageCount)));
  }, [currentPage, totalPageCount]);

  const paginationRange = useMemo(() => {
    // Return empty array if no items or invalid page size
    if (totalCount === 0 || pageSize === 0) {
      return [];
    }
    const totalPageNumbers = siblingCount + 5;

    // Show all pages if total is within displayable range
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    // Calculate page number range centered around current page
    const leftSiblingIndex = Math.max(safeCurrentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(safeCurrentPage + siblingCount, totalPageCount);

    // Determine whether to show left/right ellipsis (...)
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    // Case 1: No left ellipsis, right ellipsis
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);

      return [...leftRange, DOTS, lastPageIndex];
    }

    // Case 2: Left ellipsis, no right ellipsis
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPageCount - rightItemCount + 1, totalPageCount);
      return [firstPageIndex, DOTS, ...rightRange];
    }

    // Case 3: Both left and right ellipsis
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }

    // Case 4: No ellipsis on either side
    return range(1, totalPageCount);
  }, [totalCount, pageSize, siblingCount, safeCurrentPage, totalPageCount]);

  return {
    paginationRange,
    totalPageCount,
    lastPageNumber: totalPageCount,
    safeCurrentPage,
  };
};
