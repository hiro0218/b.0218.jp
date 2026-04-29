/**
 * value が string[] であるかを判定する。空配列も true。
 */
export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}
