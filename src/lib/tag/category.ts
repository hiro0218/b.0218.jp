import type { TagCategoryMap, TagCategoryName } from '@/types/source';

/**
 * タグ配列から最初にマッチするカテゴリを取得する
 * @param tags - タグの配列
 * @param categoryMap - タグ→カテゴリのマッピング
 * @returns 最初にマッチしたカテゴリ名。マッチなしの場合はundefined
 */
export function getPrimaryCategory(
  tags: string[] | undefined,
  categoryMap: TagCategoryMap,
): TagCategoryName | undefined {
  if (!tags || tags.length === 0) return undefined;

  for (const tag of tags) {
    const category = categoryMap[tag];
    if (category !== undefined) return category;
  }

  return undefined;
}
