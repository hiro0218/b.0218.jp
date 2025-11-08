/**
 * 型安全な JSON ユーティリティ
 * すべての JSON パース・stringify 操作で使用
 */

/**
 * JSON 文字列を安全にパース
 * @param value パースする JSON 文字列
 * @returns パースした値、失敗時は null
 * @example
 * const data = safeJsonParse<MyType>('{"key": "value"}');
 * if (data === null) {
 *   // パース失敗時の処理
 * }
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
 * 値を安全に JSON 文字列化
 * @param value stringify する値
 * @returns JSON 文字列、失敗時は null
 * @example
 * const json = safeJsonStringify(myData);
 * if (json === null) {
 *   // stringify 失敗時の処理
 * }
 */
export const safeJsonStringify = <T>(value: T): string | null => {
  // undefined, function, symbol は JSON.stringify で undefined を返す
  if (value === undefined || typeof value === 'function' || typeof value === 'symbol') {
    return null;
  }

  try {
    const result = JSON.stringify(value);
    return result ?? null;
  } catch (error) {
    console.error('Failed to stringify JSON:', error);
    return null;
  }
};
