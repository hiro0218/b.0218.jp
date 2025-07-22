import type { Props as PostTagProps } from '@/components/UI/Tag';

/** キャッシュのエントリ数上限 */
const MAX_CACHE_SIZE = 100;

/** タグのソート結果をキャッシュするMap */
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

  // キャッシュキーの生成（全タグのスラッグとソートキーの組み合わせ）
  const cacheKey = `${tags.map((tag) => tag.slug).join('_')}_${sortKey}`;

  if (sortedTagsCache.has(cacheKey)) {
    return sortedTagsCache.get(cacheKey) || [];
  }

  // キャッシュサイズが上限に達した場合、最も古いエントリを削除
  if (sortedTagsCache.size >= MAX_CACHE_SIZE) {
    const oldestKey = sortedTagsCache.keys().next().value;
    sortedTagsCache.delete(oldestKey);
  }

  // 元の配列を変更せず、コピーしてからソートを適用
  const sortedTags = [...tags].sort((a, b) => {
    // プロパティの型に応じて適切な比較方法を選択
    if (typeof a[sortKey] === 'number' && typeof b[sortKey] === 'number') {
      // 数値型の場合は単純な減算で降順ソート
      return (b[sortKey] as number) - (a[sortKey] as number);
    }

    // 文字列型の場合はlocaleCompareで言語対応したソート
    return String(b[sortKey]).localeCompare(String(a[sortKey]));
  });

  // 結果をキャッシュに保存して再利用可能にする
  sortedTagsCache.set(cacheKey, sortedTags);

  return sortedTags;
}
