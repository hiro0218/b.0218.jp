/**
 * value が null でないオブジェクトであるかを判定し、Record<string, unknown> として narrow する。
 * 型ガード後はキャストなしでプロパティアクセスできる。
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
