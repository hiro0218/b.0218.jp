import type { Props as PostTagProps } from '@/components/UI/Tag';

const MAX_CACHE_SIZE = 100;
const sortedTagsCache = new Map<string, PostTagProps[]>();

/**
 * タグを関連性順にソートする
 *
 * @param tags - ソート対象のタグリスト
 * @param sortKey - ソートの基準となるプロパティ（デフォルト: 'count'）
 * @returns ソートされたタグのリスト
 */
export function sortTagsByRelevance(tags: PostTagProps[], sortKey: keyof PostTagProps = 'count'): PostTagProps[] {
  if (!tags || tags.length === 0) {
    return [];
  }

  const cacheKey = `${tags.map((tag) => tag.slug).join('_')}_${sortKey}`;

  if (sortedTagsCache.has(cacheKey)) {
    return sortedTagsCache.get(cacheKey) || [];
  }

  if (sortedTagsCache.size >= MAX_CACHE_SIZE) {
    const oldestKey = sortedTagsCache.keys().next().value;
    sortedTagsCache.delete(oldestKey);
  }

  const sortedTags = tags.toSorted((a, b) => {
    if (typeof a[sortKey] === 'number' && typeof b[sortKey] === 'number') {
      return (b[sortKey] as number) - (a[sortKey] as number);
    }

    return String(b[sortKey]).localeCompare(String(a[sortKey]));
  });

  sortedTagsCache.set(cacheKey, sortedTags);

  return sortedTags;
}
