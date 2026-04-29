/**
 * value が plain object（配列を除く）であるかを判定し、Record<string, unknown> として narrow する。
 * 型ガード後はキャストなしでプロパティアクセスできる。
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
