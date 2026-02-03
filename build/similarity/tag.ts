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

/**
 * キャッシュキーを生成する
 *
 * @param posts - 全記事リスト
 * @param tagsList - タグごとの記事リスト
 * @returns キャッシュキー（記事数_タグ数_最大タグ数）
 *
 * @remarks
 * 完全な入力内容に基づくハッシュ値よりも計算コストが低い簡易キーを使用
 */
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

/**
 * タグの出現頻度と共起行列を計算
 *
 * @param posts - 全記事リスト
 * @param tagsList - タグごとの記事リスト（有効なタグの確認用）
 * @returns tagDocFrequency と coOccurrenceMatrix を含むオブジェクト
 *
 * @remarks
 * 記事ごとにタグの出現頻度と共起情報を1パスで収集し、メモリ効率と計算効率を最適化
 */
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

/**
 * NPMI (Normalized Pointwise Mutual Information) に基づくタグ関連度を計算
 *
 * @param tagsList - 有効なタグリスト取得用
 * @param coOccurrenceMatrix - 共起回数行列
 * @param tagDocFrequency - 各タグの出現記事数
 * @param totalPosts - 全記事数
 * @returns タグ関連度情報（値はNPMIスコア [-1, 1]）
 *
 * @remarks
 * - 数値計算の安定性とパフォーマンスを考慮した実装
 * - 除算を乗算に変換（invTotalPosts使用）
 * - ゼロ除算・log(0)を回避するため極小値チェックを実施
 * - 対称性を確保（tag1 -> tag2 と tag2 -> tag1 の両方を格納）
 */
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

/**
 * タグ関連度情報を関連度の高い順にソートする
 *
 * @param tagRelationsMap - 計算されたタグ関連度情報（Map形式）
 * @returns ソート済みのタグ関連度情報（通常のオブジェクト形式）
 *
 * @remarks
 * Map形式から通常のオブジェクト形式に変換し、効率的なソート処理を実施
 */
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
 *
 * @remarks
 * **パフォーマンス最適化:**
 * - キャッシュ利用で再計算を回避
 * - Map活用による効率的なデータ構造
 * - 確率の事前計算で除算を削減
 * - 数値計算の安定性を考慮
 *
 * **処理フロー:**
 * 1. 入力検証とキャッシュチェック
 * 2. ドキュメント頻度と共起行列を1パスで構築
 * 3. NPMIに基づくタグ関連度を計算
 * 4. 関連度の高い順にソート
 */
export function getRelatedTags(posts: Post[], tagsList: TagIndex): TagSimilarityScores {
  if (!Array.isArray(posts) || posts.length === 0) {
    console.warn('[getRelatedTags] 記事配列が無効です');
    return {};
  }

  if (typeof tagsList !== 'object' || tagsList === null) {
    console.warn('[getRelatedTags] タグリストが無効です');
    return {};
  }

  const tagsCount = Object.keys(tagsList).length;
  if (tagsCount === 0) {
    console.warn('[getRelatedTags] タグリストが空です');
    return {};
  }

  console.log(`[getRelatedTags] 処理開始 (記事数: ${posts.length}, タグ数: ${tagsCount})`);

  const cacheKey = generateCacheKey(posts, tagsList);
  const cachedResult = tagsRelationCache.get(cacheKey);
  if (cachedResult !== undefined) {
    console.log('[getRelatedTags] キャッシュヒット - 計算をスキップ');
    return cachedResult;
  }

  const totalPosts = posts.length;

  console.log('[getRelatedTags] 共起行列の構築を開始...');
  const { tagDocFrequency, coOccurrenceMatrix } = buildFrequencyAndCoOccurrence(posts, tagsList);
  console.log('[getRelatedTags] 共起行列の構築完了');

  console.log('[getRelatedTags] タグ関連度の計算を開始...');
  const tagRelationsMap = calculateTagRelationsNPMI(tagsList, coOccurrenceMatrix, tagDocFrequency, totalPosts);
  console.log('[getRelatedTags] タグ関連度の計算完了');

  console.log('[getRelatedTags] タグ関連度のソートを開始...');
  const result = sortTagRelations(tagRelationsMap);
  console.log('[getRelatedTags] タグ関連度のソート完了');

  if (Object.keys(result).length > 0) {
    tagsRelationCache.set(cacheKey, result);
  }

  console.log('[getRelatedTags] 処理完了');

  return result;
}
