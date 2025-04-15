import { useMemo } from 'react';
import { DOTS } from '../constant';

type Props = {
  totalCount: number;
  pageSize: number;
  siblingCount?: number;
  currentPage: number;
};

const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, idx) => idx + start);

export const usePagination = ({ totalCount, pageSize, siblingCount = 1, currentPage }: Props): (string | number)[] => {
  const totalPageCount = useMemo(() => Math.ceil(totalCount / pageSize), [totalCount, pageSize]);

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  const paginationRange = useMemo(() => {
    if (totalCount === 0 || pageSize === 0) {
      return [];
    }
    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPageCount);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);

      return [...leftRange, DOTS, totalPageCount];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPageCount - rightItemCount + 1, totalPageCount);
      return [firstPageIndex, DOTS, ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }

    return [];
  }, [totalCount, pageSize, siblingCount, currentPage]);

  return paginationRange;
};
