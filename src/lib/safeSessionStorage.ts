/**
 * sessionStorage 専用の型安全なユーティリティ
 *
 * Safari プライベートモードなどストレージアクセス拒否環境では
 * すべての関数が false/null を返します
 */

/**
 * JSON.parseを型安全に実行
 * @returns 失敗時はnull
 */
export const safeJsonParse = <T>(value: string | null): T | null => {
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return null;
  }
};

/**
 * JSON.stringifyを安全に実行
 * @returns 失敗時はnull
 */
export const safeJsonStringify = <T>(value: T): string | null => {
  try {
    const result = JSON.stringify(value);
    return result ?? null;
  } catch (error) {
    console.error('Failed to stringify JSON:', error);
    return null;
  }
};

/**
 * sessionStorageから値を取得してパース
 * @returns 失敗時・サーバーサイド・ストレージアクセス拒否時はnull
 * @example
 * const data = getFromSession<MyData>('key');
 * if (data === null) {
 *   return defaultData;
 * }
 */
export const getFromSession = <T>(key: string): T | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = sessionStorage.getItem(key);
    return safeJsonParse<T>(stored);
  } catch (error) {
    console.error(`Failed to get item from storage (${key}):`, error);
    return null;
  }
};

/**
 * sessionStorageに値を保存
 * @returns サーバーサイド・ストレージアクセス拒否時はfalse
 * @example
 * if (!setToSession('key', data)) {
 *   console.warn('Storage unavailable, using memory cache');
 * }
 */
export const setToSession = <T>(key: string, value: T): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  const serialized = safeJsonStringify(value);
  if (!serialized) return false;

  try {
    sessionStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error(`Failed to set item to storage (${key}):`, error);
    return false;
  }
};

/**
 * sessionStorageから値を削除
 * @returns サーバーサイド・ストレージアクセス拒否時はfalse
 * @example
 * if (!removeFromSession('key')) {
 *   console.info('Storage clear skipped');
 * }
 */
export const removeFromSession = (key: string): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    sessionStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Failed to remove item from storage (${key}):`, error);
    return false;
  }
};
