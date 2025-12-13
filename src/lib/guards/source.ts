import type { Post, PostSummary } from '@/types/source';

/**
 * Post型ガード
 */
export function isPost(value: unknown): value is Post {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;

  // 最小限の型チェック
  return (
    typeof obj.title === 'string' &&
    typeof obj.slug === 'string' &&
    typeof obj.date === 'string' &&
    typeof obj.content === 'string' &&
    Array.isArray(obj.tags)
  );
}

/**
 * PostSummary型ガード
 */
function isPostSummary(value: unknown): value is PostSummary {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;

  // 最小限の型チェック
  return (
    typeof obj.title === 'string' &&
    typeof obj.slug === 'string' &&
    typeof obj.date === 'string' &&
    Array.isArray(obj.tags)
  );
}

/**
 * Post配列型ガード
 */
export function isPostArray(value: unknown): value is Post[] {
  if (!Array.isArray(value)) {
    return false;
  }

  return value.length === 0 || isPost(value[0]);
}

/**
 * PostSummary配列型ガード
 */
export function isPostSummaryArray(value: unknown): value is PostSummary[] {
  if (!Array.isArray(value)) {
    return false;
  }

  return value.length === 0 || isPostSummary(value[0]);
}
