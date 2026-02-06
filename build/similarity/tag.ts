import type { Post, TagIndex, TagSimilarityScores } from '@/types/source';

type CoOccurrenceMatrix = Map<string, Map<string, number>>;
type TagDocFrequency = Map<string, number>;
type TagProbability = Map<string, number>;
type TagRelationsMap = Map<string, Map<string, number>>;

/**
 * タグ関連度計算結果のキャッシュ
 * 同一または類似の入力に対する再計算を避けることでパフォーマンスを向上
 */
const tagsRelationCache = new Map<string, TagSimilarityScores>();

const MIN_CO_OCCURRENCE = 2; // 関連性を計算するための最小共起回数 (ノイズ除去)
const MIN_TAG_FREQUENCY = 3; // 関連性を計算するタグの最小出現記事数 (低頻度タグ除外)
const NPMI_THRESHOLD = 0; // 計算結果として保持するNPMIスコアの最小値 (0より大きい関連性のみ)

function generateCacheKey(posts: Post[], tagsList: TagIndex): string {
  const tagsCount = Object.keys(tagsList).length;
  const postsCount = posts.length;

  let maxTagsInPost = 0;
  for (const post of posts) {
    if (post.tags && post.tags.length > maxTagsInPost) {
      maxTagsInPost = post.tags.length;
    }
  }

  return `${postsCount}_${tagsCount}_${maxTagsInPost}`;
}

function buildFrequencyAndCoOccurrence(
  posts: Post[],
  tagsList: TagIndex,
): {
  tagDocFrequency: TagDocFrequency;
  coOccurrenceMatrix: CoOccurrenceMatrix;
} {
  try {
    const tagDocFrequency: TagDocFrequency = new Map();
    const coOccurrenceMatrix: CoOccurrenceMatrix = new Map();

    const validTagKeys = Object.keys(tagsList);
    const tagSet = new Set(validTagKeys);

    for (const tag of validTagKeys) {
      tagDocFrequency.set(tag, 0);
    }

    for (const post of posts) {
      if (!post.tags || post.tags.length === 0) continue;

      const postTags = post.tags;
      const postTagsLength = postTags.length;
      const uniqueTagsInPost: string[] = [];
      const uniqueTagsSet = new Set<string>();

      for (let i = 0; i < postTagsLength; i++) {
        const tag = postTags[i];
        if (tagSet.has(tag) && !uniqueTagsSet.has(tag)) {
          uniqueTagsSet.add(tag);
          uniqueTagsInPost.push(tag);
          tagDocFrequency.set(tag, tagDocFrequency.get(tag)! + 1);
        }
      }

      const tagsLength = uniqueTagsInPost.length;
      if (tagsLength < 2) continue;

      for (let i = 0; i < tagsLength - 1; i++) {
        const tag1 = uniqueTagsInPost[i];
        let tag1Map = coOccurrenceMatrix.get(tag1);
        if (!tag1Map) {
          tag1Map = new Map();
          coOccurrenceMatrix.set(tag1, tag1Map);
        }

        for (let j = i + 1; j < tagsLength; j++) {
          const tag2 = uniqueTagsInPost[j];

          const tag1CurrentCount = tag1Map.get(tag2);
          if (tag1CurrentCount !== undefined) {
            tag1Map.set(tag2, tag1CurrentCount + 1);
            const tag2Map = coOccurrenceMatrix.get(tag2)!;
            tag2Map.set(tag1, tag2Map.get(tag1)! + 1);
          } else {
            let tag2Map = coOccurrenceMatrix.get(tag2);
            if (!tag2Map) {
              tag2Map = new Map();
              coOccurrenceMatrix.set(tag2, tag2Map);
            }
            tag1Map.set(tag2, 1);
            tag2Map.set(tag1, 1);
          }
        }
      }
    }
    return { tagDocFrequency, coOccurrenceMatrix };
  } catch (error) {
    console.error('[build/similarity/tag] 共起行列の構築に失敗:', error);
    throw error;
  }
}

function calculateTagRelationsNPMI(
  tagsList: TagIndex,
  coOccurrenceMatrix: CoOccurrenceMatrix,
  tagDocFrequency: TagDocFrequency,
  totalPosts: number,
): TagRelationsMap {
  try {
    const tagRelations: TagRelationsMap = new Map();
    const validTagsArray: string[] = [];
    const validTagsSet = new Set<string>();
    const tagProbabilities: TagProbability = new Map();
    const invTotalPosts = 1 / totalPosts;

    for (const [tag, frequency] of tagDocFrequency.entries()) {
      if (frequency >= MIN_TAG_FREQUENCY && tag in tagsList) {
        validTagsArray.push(tag);
        validTagsSet.add(tag);
        tagProbabilities.set(tag, frequency * invTotalPosts);
      }
    }

    for (const tag1 of validTagsArray) {
      tagRelations.set(tag1, new Map());
      const pTag1 = tagProbabilities.get(tag1)!;
      const coOccurrences = coOccurrenceMatrix.get(tag1);

      if (coOccurrences) {
        for (const [tag2, coOccurrenceCount] of coOccurrences.entries()) {
          if (validTagsSet.has(tag2) && tag1 < tag2) {
            if (coOccurrenceCount < MIN_CO_OCCURRENCE) continue;

            const pTag2 = tagProbabilities.get(tag2)!;
            const pTag1Tag2 = coOccurrenceCount * invTotalPosts;

            if (pTag1Tag2 < 1e-10) continue;

            const pTag1pTag2 = pTag1 * pTag2;
            const logRatio = Math.log(pTag1Tag2 / pTag1pTag2);

            let npmi: number;
            if (Math.abs(pTag1Tag2 - 1) < 1e-10) {
              npmi = 1;
            } else {
              const denominator = -Math.log(pTag1Tag2);
              if (denominator < 1e-10) {
                npmi = logRatio > 0 ? 1 : logRatio < 0 ? -1 : 0;
              } else {
                npmi = logRatio / denominator;
              }
            }

            if (!isNaN(npmi) && npmi > NPMI_THRESHOLD) {
              const clippedNpmi = Math.min(1, npmi);
              const roundedNpmi = parseFloat(clippedNpmi.toFixed(4));

              tagRelations.get(tag1)!.set(tag2, roundedNpmi);

              let tag2Map = tagRelations.get(tag2);
              if (!tag2Map) {
                tag2Map = new Map();
                tagRelations.set(tag2, tag2Map);
              }
              tag2Map.set(tag1, roundedNpmi);
            }
          }
        }
      }
    }
    return tagRelations;
  } catch (error) {
    console.error('[build/similarity/tag] タグ関連度の計算に失敗:', error);
    throw error;
  }
}

function sortTagRelations(tagRelationsMap: TagRelationsMap): TagSimilarityScores {
  try {
    const sortedTags: TagSimilarityScores = Object.create(null);
    const tagEntries = Array.from(tagRelationsMap.entries());
    const tagsCount = tagEntries.length;

    for (let i = 0; i < tagsCount; i++) {
      const [tag, relatedTagsMap] = tagEntries[i];

      if (relatedTagsMap.size === 0) continue;

      const relatedEntries = Array.from(relatedTagsMap.entries());
      relatedEntries.sort(([, scoreA], [, scoreB]) => scoreB - scoreA);

      const sortedRelatedTags: Record<string, number> = Object.create(null);
      const entriesCount = relatedEntries.length;

      for (let j = 0; j < entriesCount; j++) {
        const [relatedTag, score] = relatedEntries[j];
        sortedRelatedTags[relatedTag] = score;
      }

      sortedTags[tag] = sortedRelatedTags;
    }

    return sortedTags;
  } catch (error) {
    console.error('[build/similarity/tag] タグ関連度のソートに失敗:', error);
    throw error;
  }
}

/**
 * 関連タグを取得する
 *
 * @param posts - 全記事リスト
 * @param tagsList - タグごとの記事リスト
 * @returns 計算・ソート済みのタグ関連度情報
 */
export function getRelatedTags(posts: Post[], tagsList: TagIndex): TagSimilarityScores {
  if (!Array.isArray(posts) || posts.length === 0) {
    console.warn('getRelatedTags: Invalid posts array. Returning empty object.');
    return {};
  }

  if (typeof tagsList !== 'object' || tagsList === null) {
    console.warn('getRelatedTags: Invalid tagsList. Returning empty object.');
    return {};
  }

  const tagsCount = Object.keys(tagsList).length;
  if (tagsCount === 0) {
    return {};
  }

  const cacheKey = generateCacheKey(posts, tagsList);
  const cachedResult = tagsRelationCache.get(cacheKey);
  if (cachedResult !== undefined) {
    return cachedResult;
  }

  const totalPosts = posts.length;

  const { tagDocFrequency, coOccurrenceMatrix } = buildFrequencyAndCoOccurrence(posts, tagsList);
  const tagRelationsMap = calculateTagRelationsNPMI(tagsList, coOccurrenceMatrix, tagDocFrequency, totalPosts);
  const result = sortTagRelations(tagRelationsMap);

  if (Object.keys(result).length > 0) {
    tagsRelationCache.set(cacheKey, result);
  }

  return result;
}
