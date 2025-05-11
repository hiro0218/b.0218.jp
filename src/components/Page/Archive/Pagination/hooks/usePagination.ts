import { useMemo } from 'react';
import { DOTS } from '../constant';

/**
 * ページネーション機能のProps型定義
 */
type Props = {
  /** アイテムの総数 */
  totalCount: number;
  /** 1ページあたりのアイテム数 */
  pageSize: number;
  /** 現在のページの前後に表示するページ数 */
  siblingCount?: number;
  /** 現在のページ番号 */
  currentPage: number;
};

/**
 * 指定された範囲の数値配列を生成する
 * @param start - 開始数値（含む）
 * @param end - 終了数値（含む）
 * @returns 指定範囲の連続した数値の配列
 */
const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, idx) => idx + start);

/**
 * ページネーション表示に必要なページ番号の配列を生成するカスタムフック
 * 現在のページを中心に、前後のページ番号と省略記号（...）を適切に配置する
 * @returns ページ番号または省略記号（...）の配列
 */
export const usePagination = ({ totalCount, pageSize, siblingCount = 1, currentPage }: Props): (string | number)[] => {
  // 総ページ数を計算
  const totalPageCount = useMemo(() => Math.ceil(totalCount / pageSize), [totalCount, pageSize]);

  // 現在のページが有効範囲内に収まるように調整
  const safeCurrentPage = useMemo(() => {
    return Math.max(1, Math.min(currentPage, Math.max(1, totalPageCount)));
  }, [currentPage, totalPageCount]);

  const paginationRange = useMemo(() => {
    // アイテムがない場合や無効なページサイズの場合は空配列を返す
    if (totalCount === 0 || pageSize === 0) {
      return [];
    }
    const totalPageNumbers = siblingCount + 5;

    // ページ総数が表示可能なページ数以下の場合は全ページを表示
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    // 現在のページを中心としたページ番号の範囲を計算
    const leftSiblingIndex = Math.max(safeCurrentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(safeCurrentPage + siblingCount, totalPageCount);

    // 左右の省略記号（...）を表示するかどうかを判定
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    // ケース1: 左側に省略記号なし、右側に省略記号あり
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);

      return [...leftRange, DOTS, lastPageIndex];
    }

    // ケース2: 左側に省略記号あり、右側に省略記号なし
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPageCount - rightItemCount + 1, totalPageCount);
      return [firstPageIndex, DOTS, ...rightRange];
    }

    // ケース3: 左右両方に省略記号あり
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }

    // ケース4: 左右両方に省略記号なし
    return range(1, totalPageCount);
  }, [totalCount, pageSize, siblingCount, safeCurrentPage, totalPageCount]);

  return paginationRange;
};
