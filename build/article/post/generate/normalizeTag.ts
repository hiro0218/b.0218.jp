import type { Post } from '@/types/source';

/**
 * タグの正規化エントリー
 * 異なる表記（'Bash', 'bash'など）の出現回数を管理
 */
interface TagVariants {
  variants: Map<string, number>; // 表記 -> 出現回数
}

/**
 * 最も出現回数が多い表記を返す
 * 同数の場合は最初に出現した表記を優先
 */
function getMostFrequentVariant(variants: Map<string, number>): string {
  let maxCount = 0;
  let mostFrequent = '';

  for (const [variant, count] of variants) {
    if (count > maxCount) {
      maxCount = count;
      mostFrequent = variant;
    }
  }

  return mostFrequent;
}

/**
 * 全記事からタグの正規化マップを構築
 * @param posts 記事の配列
 * @returns 正規化キー（小文字）から最頻出表記へのマップ
 */
export function buildTagNormalizationMap(posts: Partial<Post>[]): Map<string, string> {
  const tagVariantsMap = new Map<string, TagVariants>();

  // 全記事のタグを収集し、表記ごとの出現回数をカウント
  for (const post of posts) {
    const { tags } = post;

    if (!tags) {
      continue;
    }

    for (const tag of tags) {
      const normalizedKey = tag.toLowerCase();

      let entry = tagVariantsMap.get(normalizedKey);

      if (!entry) {
        entry = {
          variants: new Map<string, number>(),
        };
        tagVariantsMap.set(normalizedKey, entry);
      }

      // 表記の出現回数をカウント
      const currentCount = entry.variants.get(tag) || 0;
      entry.variants.set(tag, currentCount + 1);
    }
  }

  // 最頻出の表記を選択してマップを構築
  const normalizationMap = new Map<string, string>();

  for (const [normalizedKey, entry] of tagVariantsMap) {
    const displayName = getMostFrequentVariant(entry.variants);
    normalizationMap.set(normalizedKey, displayName);
  }

  return normalizationMap;
}

/**
 * タグ配列を正規化マップを使って正規化
 * @param tags タグの配列
 * @param normalizationMap 正規化マップ
 * @returns 正規化されたタグの配列
 */
export function normalizeTags(tags: string[], normalizationMap: Map<string, string>): string[] {
  return tags.map((tag) => {
    const normalizedKey = tag.toLowerCase();
    return normalizationMap.get(normalizedKey) || tag;
  });
}
