import type { PostProps, TagSimilarProps, TagsListProps } from '@/types/source';

type CoOccurrenceMatrix = Map<string, Map<string, number>>; // tag1 -> Map<tag2, count>
type TagDocFrequency = Map<string, number>; // tag -> count
type TagProbability = Map<string, number>; // tag -> probability P(tag)
type TagRelationsMap = Map<string, Map<string, number>>; // tag1 -> Map<tag2, npmi_score>

const MIN_CO_OCCURRENCE = 2; // 関連性を計算するための最小共起回数 (ノイズ除去)
const MIN_TAG_FREQUENCY = 3; // 関連性を計算するタグの最小出現記事数 (低頻度タグ除外)
const NPMI_THRESHOLD = 0; // 計算結果として保持するNPMIスコアの最小値 (0より大きい関連性のみ)

/**
 * タグの出現頻度と共起行列を計算
 * @param posts 全記事リスト
 * @param tagsList タグごとの記事リスト - 有効なタグの確認用
 * @returns tagDocFrequency と coOccurrenceMatrix を含むオブジェクト
 */
function buildFrequencyAndCoOccurrence(
  posts: PostProps[],
  tagsList: TagsListProps,
): {
  tagDocFrequency: TagDocFrequency;
  coOccurrenceMatrix: CoOccurrenceMatrix;
} {
  const tagDocFrequency: TagDocFrequency = new Map();
  const coOccurrenceMatrix: CoOccurrenceMatrix = new Map();
  const tagSet = new Set(Object.keys(tagsList)); // 有効なタグのみを処理対象とする

  for (const post of posts) {
    // 記事内のユニークで有効なタグリストを取得
    const uniqueTagsInPost = Array.from(new Set(post.tags?.filter((tag) => tagSet.has(tag)) || []));

    // タグごとの出現記事数を更新
    uniqueTagsInPost.forEach((tag) => {
      tagDocFrequency.set(tag, (tagDocFrequency.get(tag) || 0) + 1);
    });

    // 共起行列の更新
    if (uniqueTagsInPost.length < 2) {
      continue; // 1つのタグしかない場合は共起がないためスキップ
    }
    for (let i = 0; i < uniqueTagsInPost.length; i++) {
      const tag1 = uniqueTagsInPost[i];
      // tag1 の内部 Map がなければ初期化
      if (!coOccurrenceMatrix.has(tag1)) {
        coOccurrenceMatrix.set(tag1, new Map());
      }
      const tag1Map = coOccurrenceMatrix.get(tag1)!;

      // tag1 とそれ以降のタグ(tag2)のペアについて共起をカウント
      for (let j = i + 1; j < uniqueTagsInPost.length; j++) {
        const tag2 = uniqueTagsInPost[j];
        // tag2 の内部 Map がなければ初期化
        if (!coOccurrenceMatrix.has(tag2)) {
          coOccurrenceMatrix.set(tag2, new Map());
        }
        const tag2Map = coOccurrenceMatrix.get(tag2)!;

        // 共起回数をインクリメント (対称性を確保)
        tag1Map.set(tag2, (tag1Map.get(tag2) || 0) + 1);
        tag2Map.set(tag1, (tag2Map.get(tag1) || 0) + 1);
      }
    }
  }
  return { tagDocFrequency, coOccurrenceMatrix };
}

/**
 * NPMI (Normalized Pointwise Mutual Information) に基づくタグ関連度を計算
 * @param tagsList 有効なタグリスト取得用
 * @param coOccurrenceMatrix 共起回数行列
 * @param tagDocFrequency 各タグの出現記事数
 * @param totalPosts 全記事数
 * @returns タグ関連度情報 - 値はNPMIスコア [-1, 1]
 */
function calculateTagRelationsNPMI(
  tagsList: TagsListProps,
  coOccurrenceMatrix: CoOccurrenceMatrix,
  tagDocFrequency: TagDocFrequency,
  totalPosts: number,
): TagRelationsMap {
  const tagRelations: TagRelationsMap = new Map();
  // 最小出現頻度を満たす有効なタグのみを対象とする
  const validTags = Object.keys(tagsList).filter((tag) => (tagDocFrequency.get(tag) || 0) >= MIN_TAG_FREQUENCY);
  const validTagsSet = new Set(validTags); // 高速な存在チェック用

  // --- 確率 P(tag) の事前計算 ---
  const tagProbabilities: TagProbability = new Map();
  validTags.forEach((tag) => {
    tagProbabilities.set(tag, (tagDocFrequency.get(tag) || 0) / totalPosts);
  });

  // 有効なタグについてループ
  for (const tag1 of validTags) {
    tagRelations.set(tag1, new Map()); // tag1の結果用内部Mapを初期化
    const pTag1 = tagProbabilities.get(tag1)!; // 事前計算した確率を使用
    const coOccurrences = coOccurrenceMatrix.get(tag1); // tag1と共起するタグの情報 (Map | undefined)

    // tag1と共起するタグが存在する場合のみ処理
    if (coOccurrences) {
      // tag1 と共起したタグ (tag2) についてのみループ
      for (const [tag2, coOccurrenceCount] of coOccurrences.entries()) {
        // tag2 も有効なタグであり、かつ重複計算を避けるため辞書順で tag1 < tag2 のペアのみ処理
        if (validTagsSet.has(tag2) && tag1 < tag2) {
          // 最小共起回数を満たさない場合はスキップ
          if (coOccurrenceCount < MIN_CO_OCCURRENCE) {
            continue;
          }

          const pTag2 = tagProbabilities.get(tag2)!; // 事前計算した確率を使用
          const pTag1Tag2 = coOccurrenceCount / totalPosts; // P(tag1, tag2)

          // --- PMI と NPMI の計算 ---
          if (pTag1Tag2 === 0) continue; // ゼロ除算・log(0)回避

          const pmi = Math.log(pTag1Tag2 / (pTag1 * pTag2));

          let npmi: number;
          if (pTag1Tag2 === 1) {
            npmi = 1; // P(x,y)=1 なら完全に依存
          } else {
            const denominator = -Math.log(pTag1Tag2);
            // 分母が非常に小さい場合の数値安定性対策
            if (denominator < 1e-10) {
              npmi = pmi > 0 ? 1 : pmi < 0 ? -1 : 0;
            } else {
              npmi = pmi / denominator;
            }
          }

          // NPMIスコアが計算可能で、かつ閾値以上の場合のみ結果を格納
          if (!isNaN(npmi) && npmi > NPMI_THRESHOLD) {
            // 結果が1をわずかに超える可能性を考慮してクリッピング
            const clippedNpmi = Math.min(1, npmi);
            const roundedNpmi = parseFloat(clippedNpmi.toFixed(4)); // 小数点以下4桁に丸める

            // tag1 -> tag2 を格納
            tagRelations.get(tag1)!.set(tag2, roundedNpmi);

            // 対称性を確保するため tag2 -> tag1 も格納
            if (!tagRelations.has(tag2)) {
              tagRelations.set(tag2, new Map());
            }
            tagRelations.get(tag2)!.set(tag1, roundedNpmi);
          }
        }
      }
    }
  }
  return tagRelations;
}

/**
 * タグ関連度情報を関連度の高い順にソートする (Map入力 -> 通常オブジェクト出力)
 * @param tagRelationsMap 計算されたタグ関連度情報 (Map)
 * @returns ソート済みのタグ関連度情報 (通常のオブジェクト形式 TagSimilarProps)
 */
function sortTagRelations(tagRelationsMap: TagRelationsMap): TagSimilarProps {
  const sortedTags: TagSimilarProps = {};

  for (const [tag, relatedTagsMap] of tagRelationsMap.entries()) {
    // 関連度スコア(NPMI)で降順ソート
    const sortedEntries = Array.from(relatedTagsMap.entries()).sort(([, scoreA], [, scoreB]) => scoreB - scoreA); // スコアB - スコアA で降順

    // ソート結果を新しいオブジェクトに格納
    if (sortedEntries.length > 0) {
      // ソート結果が空でない場合のみ格納
      const sortedRelatedTags: Record<string, number> = {};
      for (const [relatedTag, score] of sortedEntries) {
        sortedRelatedTags[relatedTag] = score;
      }
      sortedTags[tag] = sortedRelatedTags; // 通常のオブジェクト形式で格納
    }
  }
  return sortedTags;
}

/**
 * 関連タグを取得する主要関数 (パフォーマンス改善: Map利用・確率事前計算版)
 * @param posts 全記事リスト
 * @param tagsList タグごとの記事リスト (TagsListProps)
 * @returns 計算・ソート済みのタグ関連度情報 (通常のオブジェクト形式 TagSimilarProps)
 */
export function getRelatedTags(posts: PostProps[], tagsList: TagsListProps): TagSimilarProps {
  // 入力チェック
  if (!Array.isArray(posts) || posts.length === 0 || typeof tagsList !== 'object' || tagsList === null) {
    console.warn('getRelatedTags: Invalid input provided (posts or tagsList). Returning empty object.'); // 警告ログは保持
    return {};
  }

  const totalPosts = posts.length;

  // 1. ドキュメント頻度と共起行列を1回のループで作成
  const { tagDocFrequency, coOccurrenceMatrix } = buildFrequencyAndCoOccurrence(posts, tagsList);

  // 2. NPMIに基づいてタグ関連度を計算 (確率事前計算)
  const tagRelationsMap = calculateTagRelationsNPMI(
    tagsList, // 有効タグリストの元として必要
    coOccurrenceMatrix,
    tagDocFrequency,
    totalPosts,
  );

  // 3. 関連度の高い順にソート (結果は通常のオブジェクト形式に戻す)
  const sortedTags = sortTagRelations(tagRelationsMap);

  return sortedTags;
}
