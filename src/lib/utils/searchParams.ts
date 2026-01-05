/**
 * Next.js の searchParams から特定のキーの値を安全に取得
 *
 * searchParams の値は string | string[] | undefined の可能性があるため、
 * 安全に単一の string | null に変換する
 *
 * @param searchParams Next.js の searchParams オブジェクト
 * @param key 取得するクエリパラメータのキー
 * @returns 文字列値、または存在しない場合は null
 *
 * @example
 * const searchParams = { p: '2' };
 * const page = getSearchParam(searchParams, 'p'); // '2'
 *
 * @example
 * const searchParams = { p: ['2', '3'] };
 * const page = getSearchParam(searchParams, 'p'); // '2' (最初の値)
 *
 * @example
 * const searchParams = {};
 * const page = getSearchParam(searchParams, 'p'); // null
 */
export function getSearchParam(
  searchParams: { [key: string]: string | string[] | undefined },
  key: string,
): string | null {
  const value = searchParams[key];

  if (value === undefined) {
    return null;
  }

  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value;
}
