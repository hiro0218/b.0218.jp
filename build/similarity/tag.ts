import type { PostProps, TagSimilarProps, TagsListProps } from '@/types/source';
import { LRUCache } from './lru-cache';
import { createError, type ErrorInfo, ErrorKind, failure, type Result, success } from './result';

type CoOccurrenceMatrix = Map<string, Map<string, number>>; // tag1 -> Map<tag2, count>
type TagDocFrequency = Map<string, number>; // tag -> count
type TagProbability = Map<string, number>; // tag -> probability P(tag)
type TagRelationsMap = Map<string, Map<string, number>>; // tag1 -> Map<tag2, npmi_score>

/**
 * タグ関連度計算結果のキャッシュ
 * 同一または類似の入力に対する再計算を避けることでパフォーマンスを向上
 */
const tagsRelationCache = new LRUCache<string, TagSimilarProps>(20);

const MIN_CO_OCCURRENCE = 2; // 関連性を計算するための最小共起回数 (ノイズ除去)
const MIN_TAG_FREQUENCY = 3; // 関連性を計算するタグの最小出現記事数 (低頻度タグ除外)
const NPMI_THRESHOLD = 0; // 計算結果として保持するNPMIスコアの最小値 (0より大きい関連性のみ)

/**
 * キャッシュキーを生成する関数
 * 入力データの特性に基づいたユニークなキーを生成
 * @param posts 全記事リスト
 * @param tagsList タグごとの記事リスト
 * @returns キャッシュキー
 */
function generateCacheKey(posts: PostProps[], tagsList: TagsListProps): string {
  // 記事数、タグ数、記事内の最大タグ数を組み合わせたキャッシュキーを生成
  // 完全な入力内容に基づくハッシュ値よりも計算コストが低い
  const tagsCount = Object.keys(tagsList).length;
  const postsCount = posts.length;

  // 最大タグ数を算出（入力データの特性を反映するために含める）
  let maxTagsInPost = 0;
  for (const post of posts) {
    if (post.tags && post.tags.length > maxTagsInPost) {
      maxTagsInPost = post.tags.length;
    }
  }

  return `${postsCount}_${tagsCount}_${maxTagsInPost}`;
}

// エラー定義
export const TagError = {
  // biome-ignore lint/style/useNamingConvention: エラー型の命名規則を維持
  InvalidInput: (message: string): ErrorInfo => createError(ErrorKind.INVALID_INPUT, message),
  // biome-ignore lint/style/useNamingConvention: エラー型の命名規則を維持
  ProcessingError: (message: string, cause?: unknown): ErrorInfo =>
    createError(ErrorKind.PROCESSING_ERROR, message, cause),
};

/**
 * タグの出現頻度と共起行列を計算
 * 記事ごとにタグの出現頻度と共起情報を1パスで収集し、メモリ効率と計算効率を最適化
 * @param posts 全記事リスト
 * @param tagsList タグごとの記事リスト - 有効なタグの確認用
 * @returns tagDocFrequency と coOccurrenceMatrix を含むオブジェクトのResult
 */
function buildFrequencyAndCoOccurrence(
  posts: PostProps[],
  tagsList: TagsListProps,
): Result<
  {
    tagDocFrequency: TagDocFrequency;
    coOccurrenceMatrix: CoOccurrenceMatrix;
  },
  ErrorInfo
> {
  try {
    const tagDocFrequency: TagDocFrequency = new Map();
    const coOccurrenceMatrix: CoOccurrenceMatrix = new Map();

    // 有効タグの事前チェック用セット（オブジェクトキー配列化の前処理）
    const validTagKeys = Object.keys(tagsList);
    const tagSet = new Set(validTagKeys); // 有効なタグのみを処理対象とする

    // タグ数に基づいた初期容量でMapsを初期化（メモリアロケーション最適化）
    // タグの多くは少なくとも1記事には登場するという想定
    for (const tag of validTagKeys) {
      tagDocFrequency.set(tag, 0); // ゼロで初期化
    }

    for (const post of posts) {
      // タグがない記事は早期スキップ
      if (!post.tags || post.tags.length === 0) continue;

      // 記事内のユニークで有効なタグリストを取得（一時Set作成を最小化）
      const postTags = post.tags;
      const postTagsLength = postTags.length;
      const uniqueTagsInPost: string[] = [];
      const uniqueTagsSet = new Set<string>();

      for (let i = 0; i < postTagsLength; i++) {
        const tag = postTags[i];
        if (tagSet.has(tag) && !uniqueTagsSet.has(tag)) {
          uniqueTagsSet.add(tag);
          uniqueTagsInPost.push(tag);
          // タグ出現頻度をインラインで更新（ルックアップ回数削減）
          tagDocFrequency.set(tag, tagDocFrequency.get(tag)! + 1);
        }
      }

      // 共起行列の更新
      const tagsLength = uniqueTagsInPost.length;
      if (tagsLength < 2) {
        continue; // 1つのタグしかない場合は共起がないためスキップ
      }

      // 内部ループの最適化のため、タグの共起ペアを効率的に処理
      for (let i = 0; i < tagsLength - 1; i++) {
        const tag1 = uniqueTagsInPost[i];
        // tag1 の内部 Map 取得（なければ初期化）- タグ数に応じた予想共起数で初期化
        let tag1Map = coOccurrenceMatrix.get(tag1);
        if (!tag1Map) {
          tag1Map = new Map();
          coOccurrenceMatrix.set(tag1, tag1Map);
        }

        // インナーループの境界条件を事前計算
        const innerLoopEnd = tagsLength;

        // tag1 とそれ以降のタグ(tag2)のペアについて共起をカウント
        for (let j = i + 1; j < innerLoopEnd; j++) {
          const tag2 = uniqueTagsInPost[j];

          // 最も頻繁なケース（既に両方向にMapが存在）を最初に処理
          const tag1CurrentCount = tag1Map.get(tag2);
          if (tag1CurrentCount !== undefined) {
            tag1Map.set(tag2, tag1CurrentCount + 1);

            // 対称性のある方向も更新
            const tag2Map = coOccurrenceMatrix.get(tag2)!;
            tag2Map.set(tag1, tag2Map.get(tag1)! + 1);
          } else {
            // 初めての共起の場合、両方向のMapを確認して初期化
            // tag2 の内部 Map 取得（なければ初期化）
            let tag2Map = coOccurrenceMatrix.get(tag2);
            if (!tag2Map) {
              tag2Map = new Map();
              coOccurrenceMatrix.set(tag2, tag2Map);
            }

            // 共起回数を設定 (対称性を確保)
            tag1Map.set(tag2, 1);
            tag2Map.set(tag1, 1);
          }
        }
      }
    }
    return success({ tagDocFrequency, coOccurrenceMatrix });
  } catch (error) {
    return failure(TagError.ProcessingError('共起行列の構築に失敗しました', error));
  }
}

/**
 * NPMI (Normalized Pointwise Mutual Information: 正規化相互情報量) に基づくタグ関連度を計算
 * 数値計算の安定性とパフォーマンスを考慮した実装
 * @param tagsList 有効なタグリスト取得用
 * @param coOccurrenceMatrix 共起回数行列
 * @param tagDocFrequency 各タグの出現記事数
 * @param totalPosts 全記事数
 * @returns タグ関連度情報 - 値はNPMIスコア [-1, 1] のResult
 */
function calculateTagRelationsNPMI(
  tagsList: TagsListProps,
  coOccurrenceMatrix: CoOccurrenceMatrix,
  tagDocFrequency: TagDocFrequency,
  totalPosts: number,
): Result<TagRelationsMap, ErrorInfo> {
  try {
    const tagRelations: TagRelationsMap = new Map();

    // 最小出現頻度を満たす有効なタグのみを対象とする (フィルタリング処理最適化)
    const validTagsArray: string[] = [];
    const validTagsSet = new Set<string>(); // 高速な存在チェック用
    const tagProbabilities: TagProbability = new Map(); // P(tag) の事前計算

    // トータルポスト数の逆数を一度だけ計算（除算を乗算に変換）
    const invTotalPosts = 1 / totalPosts;

    // タグの有効性チェックと確率計算を一度のループで処理
    for (const [tag, frequency] of tagDocFrequency.entries()) {
      if (frequency >= MIN_TAG_FREQUENCY && tag in tagsList) {
        validTagsArray.push(tag);
        validTagsSet.add(tag);
        // 確率 P(tag) の事前計算（除算を乗算に変換）
        tagProbabilities.set(tag, frequency * invTotalPosts);
      }
    }

    // 有効なタグについてループ
    for (const tag1 of validTagsArray) {
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
            const pTag1Tag2 = coOccurrenceCount * invTotalPosts; // P(tag1, tag2) - 除算を乗算に変換

            // 数値計算の安定性のため、極小値をチェック
            if (pTag1Tag2 < 1e-10) continue; // ゼロ除算・log(0)回避

            // 対数計算が重いため、必要な場合のみ実行
            const pTag1pTag2 = pTag1 * pTag2;
            const logRatio = Math.log(pTag1Tag2 / pTag1pTag2);

            // NPMI計算
            let npmi: number;
            if (Math.abs(pTag1Tag2 - 1) < 1e-10) {
              npmi = 1; // P(x,y)≈1 なら完全に依存
            } else {
              const denominator = -Math.log(pTag1Tag2);
              // 分母が非常に小さい場合の数値安定性対策
              if (denominator < 1e-10) {
                npmi = logRatio > 0 ? 1 : logRatio < 0 ? -1 : 0;
              } else {
                npmi = logRatio / denominator;
              }
            }

            // NPMIスコアが計算可能で、かつ閾値以上の場合のみ結果を格納
            if (!isNaN(npmi) && npmi > NPMI_THRESHOLD) {
              // 結果が1をわずかに超える可能性を考慮してクリッピング
              const clippedNpmi = Math.min(1, npmi);
              const roundedNpmi = parseFloat(clippedNpmi.toFixed(4)); // 小数点以下4桁に丸める

              // tag1 -> tag2 を格納
              tagRelations.get(tag1)!.set(tag2, roundedNpmi);

              // 対称性を確保するため tag2 -> tag1 も格納（処理効率化のためMapの存在チェックを最小化）
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
    return success(tagRelations);
  } catch (error) {
    return failure(TagError.ProcessingError('タグ関連度の計算に失敗しました', error));
  }
}

/**
 * タグ関連度情報を関連度の高い順にソートする (Map入力 -> 通常オブジェクト出力)
 * 最適化されたデータ構造変換と効率的なソート処理
 * @param tagRelationsMap 計算されたタグ関連度情報 (Map)
 * @returns ソート済みのタグ関連度情報 (通常のオブジェクト形式 TagSimilarProps) のResult
 */
function sortTagRelations(tagRelationsMap: TagRelationsMap): Result<TagSimilarProps, ErrorInfo> {
  try {
    // 結果オブジェクトの事前割り当て - タグ数に基づく適切なサイズ
    const sortedTags: TagSimilarProps = Object.create(null); // プロトタイプチェーンのないオブジェクト

    // Map エントリを事前に配列化して反復処理を最適化
    const tagEntries = Array.from(tagRelationsMap.entries());
    const tagsCount = tagEntries.length;

    // インデックスベースのループで配列アクセスを最適化
    for (let i = 0; i < tagsCount; i++) {
      const [tag, relatedTagsMap] = tagEntries[i];

      // 関連タグがない場合は早期スキップ
      if (relatedTagsMap.size === 0) continue;

      // 関連度スコア(NPMI)で降順ソート（配列として一度に処理）
      const relatedEntries = Array.from(relatedTagsMap.entries());

      // スコアで降順ソート - 比較関数をインライン化
      relatedEntries.sort(([, scoreA], [, scoreB]) => scoreB - scoreA);

      // オブジェクト構築を最適化 - プロトタイプチェーンのないオブジェクト使用
      const sortedRelatedTags: Record<string, number> = Object.create(null);
      const entriesCount = relatedEntries.length;

      for (let j = 0; j < entriesCount; j++) {
        const [relatedTag, score] = relatedEntries[j];
        sortedRelatedTags[relatedTag] = score;
      }

      sortedTags[tag] = sortedRelatedTags; // 通常のオブジェクト形式で格納
    }

    return success(sortedTags);
  } catch (error) {
    return failure(TagError.ProcessingError('タグ関連度のソートに失敗しました', error));
  }
}

/**
 * 関連タグを取得する主要関数 (パフォーマンス改善: LRUCache利用・Map活用・確率事前計算・数値最適化版)
 * @param posts 全記事リスト
 * @param tagsList タグごとの記事リスト (TagsListProps)
 * @returns 計算・ソート済みのタグ関連度情報 (通常のオブジェクト形式 TagSimilarProps) のResult
 */
export function getRelatedTags(posts: PostProps[], tagsList: TagsListProps): TagSimilarProps {
  // 入力チェック
  if (!Array.isArray(posts) || posts.length === 0) {
    console.warn('getRelatedTags: Invalid posts array. Returning empty object.');
    return {};
  }

  if (typeof tagsList !== 'object' || tagsList === null) {
    console.warn('getRelatedTags: Invalid tagsList. Returning empty object.');
    return {};
  }

  // タグリストが空の場合も早期リターン
  if (Object.keys(tagsList).length === 0) {
    return {};
  }

  // キャッシュキーの生成
  const cacheKey = generateCacheKey(posts, tagsList);

  // キャッシュヒットした場合はキャッシュから結果を返す
  const cachedResult = tagsRelationCache.get(cacheKey);
  if (cachedResult !== undefined) {
    return cachedResult;
  }

  const totalPosts = posts.length;

  // 1. ドキュメント頻度と共起行列を1回のループで作成
  const frequencyAndCoOccurrenceResult = buildFrequencyAndCoOccurrence(posts, tagsList);

  if (frequencyAndCoOccurrenceResult.isFailure()) {
    return {};
  }

  const { tagDocFrequency, coOccurrenceMatrix } = frequencyAndCoOccurrenceResult.value;

  // 2. NPMIに基づいてタグ関連度を計算 (確率事前計算)
  const tagRelationsMapResult = calculateTagRelationsNPMI(
    tagsList, // 有効タグリストの元として必要
    coOccurrenceMatrix,
    tagDocFrequency,
    totalPosts,
  );

  if (tagRelationsMapResult.isFailure()) {
    return {};
  }

  // 3. 関連度の高い順にソート (結果は通常のオブジェクト形式に戻す)
  const sortResult = sortTagRelations(tagRelationsMapResult.value);
  const result = sortResult.isSuccess() ? sortResult.value : {};

  // 有効な結果が得られた場合はキャッシュに格納
  if (Object.keys(result).length > 0) {
    tagsRelationCache.set(cacheKey, result);
  }

  return result;
}
