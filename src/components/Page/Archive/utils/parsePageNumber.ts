/**
 * URLパラメータからページ番号を検証・正規化
 * @param param URLパラメータ文字列
 * @param min 最小ページ番号（デフォルト: 1）
 * @param max 最大ページ番号（省略可）
 * @returns 検証済みページ番号
 */
export function parsePageNumber(param: string | null | undefined, min: number = 1, max?: number): number {
  const parsed = parseInt(param ?? min.toString(), 10);

  if (!Number.isInteger(parsed) || parsed < min) {
    return min;
  }

  if (max !== undefined && parsed > max) {
    return max;
  }

  return parsed;
}

/**
 * 総ページ数を計算
 * @param totalItems 総アイテム数
 * @param itemsPerPage ページあたりのアイテム数
 * @returns 総ページ数（最小1）
 */
export function calculateTotalPages(totalItems: number, itemsPerPage: number): number {
  if (totalItems <= 0 || itemsPerPage <= 0) {
    return 1;
  }

  return Math.ceil(totalItems / itemsPerPage);
}
