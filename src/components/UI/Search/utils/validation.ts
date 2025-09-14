/**
 * 検索クエリが空かどうかをチェックする
 * @param query - 検索クエリ文字列
 * @returns クエリが空または空白文字のみの場合true
 */
export const isEmptyQuery = (query: string | undefined | null): boolean => {
  return !query?.trim();
};

/**
 * 値が有効かどうかをチェックする
 * @param value - チェック対象の値
 * @returns 値がnull、undefined、空文字の場合false
 */
export const isValidValue = <T>(value: T | null | undefined): value is T => {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return true;
};

/**
 * 複数の値がすべて有効かチェックする
 * @param values - チェック対象の値の配列
 * @returns すべての値が有効な場合true
 */
export const areAllValid = (...values: unknown[]): boolean => {
  return values.every((value) => isValidValue(value));
};
