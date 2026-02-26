import type { TagIndex } from '@/types/source';

/**
 * タグ間の Jaccard 類似度を計算し、隣接マップを構築する
 *
 * @param tagIndex - タグ名 → 記事スラッグ配列のマッピング
 * @returns タグ間の Jaccard スコアを格納した隣接マップ
 */
export function buildJaccardAdjacency(tagIndex: TagIndex): Map<string, Map<string, number>> {
  const tagNames = Object.keys(tagIndex);
  const tagArticleSets = new Map(tagNames.map((t) => [t, new Set(tagIndex[t])]));

  const adjMap = new Map<string, Map<string, number>>();
  for (const tag of tagNames) {
    adjMap.set(tag, new Map());
  }

  for (let i = 0; i < tagNames.length; i++) {
    const a = tagNames[i];
    const setA = tagArticleSets.get(a)!;

    for (let j = i + 1; j < tagNames.length; j++) {
      const b = tagNames[j];
      const setB = tagArticleSets.get(b)!;

      let intersection = 0;
      for (const item of setA) {
        if (setB.has(item)) intersection++;
      }

      const union = setA.size + setB.size - intersection;
      if (union === 0) continue;

      const score = intersection / union;
      if (score > 0) {
        adjMap.get(a)!.set(b, score);
        adjMap.get(b)!.set(a, score);
      }
    }
  }

  return adjMap;
}
