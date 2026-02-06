import { cpus } from 'node:os';
import kuromoji, { type IpadicFeatures, type Tokenizer } from 'kuromoji';
import type { Post, TagSimilarityScores } from '@/types/source';
import { STOP_WORDS_JA } from '../shared/stopWords';

// 正規表現パターン
const REGEX_DIGIT_ONLY = /^\d+$/;

// テキスト処理パラメータ
const CONTENT_MAX_LENGTH = 5000;
const TITLE_WEIGHT = 3;

// 類似度計算パラメータ
const SIMILARITY_LIMIT = 6;
const MIN_SIMILARITY_SCORE = 0.05;
const MIN_COMMON_TAGS = 1;
const MAX_SIMILARITY_CANDIDATES = 50;
const TAG_WEIGHT = 0.6; // タグ類似度の重み
const CONTENT_WEIGHT = 0.4; // コンテンツ類似度の重み
const RECENCY_BONUS_FACTOR = 0.1; // 新鮮度ボーナス係数
const RECENCY_DECAY_DAYS = 30; // 新鮮度減衰日数
const TAG_SIMILARITY_BASE_THRESHOLD = 0.5; // タグ類似度閾値
const TAG_SIMILARITY_JACCARD_WEIGHT = 0.4; // ジャッカード係数重み
const TAG_SIMILARITY_RELATED_WEIGHT = 0.6; // 関連度スコア重み

// バッチ処理パラメータ（CPU数に応じて動的に調整）
const CPU_COUNT = cpus().length;
const BATCH_SIZE_PER_CPU = 25; // 1コアあたりのバッチサイズ
const MIN_BATCH_SIZE = 100; // 最小バッチサイズ
const MAX_BATCH_SIZE = 400; // 最大バッチサイズ（メモリ制約）

// CPU数に基づいてバッチサイズを計算
const CALCULATED_BATCH_SIZE = CPU_COUNT * BATCH_SIZE_PER_CPU;
const EFFECTIVE_BATCH_SIZE = Math.min(Math.max(CALCULATED_BATCH_SIZE, MIN_BATCH_SIZE), MAX_BATCH_SIZE);

const PREPROCESSING_BATCH_SIZE = EFFECTIVE_BATCH_SIZE;
const SIMILARITY_BATCH_SIZE = EFFECTIVE_BATCH_SIZE;

// トークナイザ初期化用のシングルトン
let tokenizerPromise: Promise<Tokenizer<IpadicFeatures>> | null = null;

async function getTokenizer(): Promise<Tokenizer<IpadicFeatures>> {
  if (!tokenizerPromise) {
    tokenizerPromise = new Promise((resolve, reject) => {
      const builder = kuromoji.builder({ dicPath: 'node_modules/kuromoji/dict' });

      const timeout = setTimeout(() => {
        reject(new Error('形態素解析器の初期化がタイムアウトしました（60秒）'));
      }, 60000);

      builder.build((err, tokenizer) => {
        clearTimeout(timeout);

        if (err) {
          reject(err);
        } else {
          resolve(tokenizer);
        }
      });
    });
  }

  try {
    return await tokenizerPromise;
  } catch (error) {
    console.error('[build/similarity/post] 形態素解析器の初期化に失敗:', error);
    throw error;
  }
}

// キャッシュの初期化
const similarityCache = new Map<string, number>();
const tfIdfCache = new Map<string, { vector: Record<string, number>; norm: number }>();

function extractTextFromPost(post: Post): string {
  const titleRepeated = post.title ? `${post.title} `.repeat(TITLE_WEIGHT) : '';
  const contentSnippet = post.content ? post.content.substring(0, CONTENT_MAX_LENGTH) : '';
  return titleRepeated + contentSnippet;
}

function isMeaningfulToken(token: IpadicFeatures): boolean {
  const validPos = ['名詞', '動詞', '形容詞', '副詞'];
  if (!validPos.includes(token.pos)) return false;

  if (token.pos_detail_1?.includes('数') || token.pos_detail_1?.includes('接尾')) return false;
  if (token.pos === '記号') return false;
  if (STOP_WORDS_JA.has(token.basic_form)) return false;
  if (token.basic_form.length <= 1) return false;
  if (REGEX_DIGIT_ONLY.test(token.basic_form)) return false;

  return true;
}

async function preprocessText(
  text: string,
  tokenizerInstance: Tokenizer<IpadicFeatures>,
  slug?: string,
): Promise<string[]> {
  if (!text) {
    return [];
  }

  try {
    const tokens: IpadicFeatures[] = tokenizerInstance.tokenize(text);
    const meaningfulTokens: string[] = [];

    for (const token of tokens) {
      if (isMeaningfulToken(token)) {
        meaningfulTokens.push(token.basic_form);
      }
    }
    return meaningfulTokens;
  } catch (error) {
    console.error(`[build/similarity/post] テキスト前処理中にエラー${slug ? ` (記事: ${slug})` : ''}:`, error);
    throw error;
  }
}

// TF-IDF計算関連の型定義
type IdfScores = Record<string, number>;
type TfScores = Record<string, number>;
type TfIdfVector = Record<string, number>;
type TfIdfNorms = Record<string, number>;

function calculateIdf(posts: Post[], processedContents: string[][]): IdfScores {
  try {
    const idfScores: IdfScores = {};
    const totalDocs = posts.length;
    const docFrequency: Record<string, number> = {};

    processedContents.forEach((words) => {
      const uniqueWordsInDoc = new Set(words);
      uniqueWordsInDoc.forEach((word) => {
        docFrequency[word] = (docFrequency[word] || 0) + 1;
      });
    });

    for (const word in docFrequency) {
      idfScores[word] = Math.log((totalDocs + 1) / (docFrequency[word] + 1)) + 1;
    }

    return idfScores;
  } catch (error) {
    throw error;
  }
}

function calculateTf(words: string[]): TfScores {
  try {
    const tfScores: TfScores = {};
    const wordCount = words.length;
    if (wordCount === 0) return tfScores;

    const invWordCount = 1 / wordCount;

    words.forEach((word) => {
      tfScores[word] = (tfScores[word] || 0) + invWordCount;
    });

    return tfScores;
  } catch (error) {
    throw error;
  }
}

function calculateTfIdfVectorWithNorm(
  slug: string,
  tfScores: TfScores,
  idfScores: IdfScores,
): { vector: TfIdfVector; norm: number } {
  const cacheKey = `tfidf_${slug}`;
  const cached = tfIdfCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const tfIdfVector: TfIdfVector = {};
    let normSum = 0;

    for (const word in tfScores) {
      if (idfScores[word] !== undefined) {
        const val = tfScores[word] * idfScores[word];
        tfIdfVector[word] = val;
        normSum += val * val;
      }
    }

    const result = { vector: tfIdfVector, norm: Math.sqrt(normSum) };
    tfIdfCache.set(cacheKey, result);
    return result;
  } catch (error) {
    throw error;
  }
}

function calculateCosineSimilarityWithNorms(
  vec1: TfIdfVector,
  vec2: TfIdfVector,
  magnitude1: number,
  magnitude2: number,
): number {
  try {
    if (magnitude1 === 0 || magnitude2 === 0) return 0;

    let dotProduct = 0;

    for (const word in vec1) {
      const val2 = vec2[word];
      if (val2 !== undefined && Number.isFinite(val2)) {
        dotProduct += vec1[word] * val2;
      }
    }

    return Math.min(1, dotProduct / (magnitude1 * magnitude2));
  } catch (error) {
    throw error;
  }
}

function calculateContentSimilarity(
  tfIdfVector1: TfIdfVector,
  tfIdfVector2: TfIdfVector,
  norm1: number,
  norm2: number,
): number {
  return calculateCosineSimilarityWithNorms(tfIdfVector1, tfIdfVector2, norm1, norm2);
}

function calculateTagSimilarity(tags1: string[], tags2: string[], sortedTags: TagSimilarityScores): number {
  try {
    if (!tags1 || !tags2 || tags1.length === 0 || tags2.length === 0 || !sortedTags) {
      return 0;
    }

    const validTags1 = tags1.filter((tag) => sortedTags[tag]);
    const validTags2 = tags2.filter((tag) => sortedTags[tag]);

    if (validTags1.length === 0 || validTags2.length === 0) {
      return 0;
    }

    // ジャッカード類似度の計算
    const tagSet1 = new Set(validTags1);
    const tagSet2 = new Set(validTags2);

    let intersectionCount = 0;
    for (const tag of tagSet1) {
      if (tagSet2.has(tag)) intersectionCount++;
    }

    const unionSize = tagSet1.size + tagSet2.size - intersectionCount;
    const jaccardSimilarity = unionSize > 0 ? intersectionCount / unionSize : 0;

    // 関連タグスコアの計算
    let relatedTagScoreSum = 0;
    let comparisonCount = 0;

    for (const tag1 of validTags1) {
      const tagRelevanceMap = sortedTags[tag1];
      if (!tagRelevanceMap) continue;

      for (const tag2 of validTags2) {
        const relevanceScore = tagRelevanceMap[tag2];
        const dynamicThreshold =
          TAG_SIMILARITY_BASE_THRESHOLD * (1 - 0.1 * Math.min(validTags1.length, validTags2.length));

        if (relevanceScore && relevanceScore >= dynamicThreshold) {
          relatedTagScoreSum += relevanceScore;
          comparisonCount++;
        }
      }
    }

    const normalizedRelatedScore = comparisonCount > 0 ? relatedTagScoreSum / comparisonCount : 0;

    // 最終的なタグ類似度
    return jaccardSimilarity * TAG_SIMILARITY_JACCARD_WEIGHT + normalizedRelatedScore * TAG_SIMILARITY_RELATED_WEIGHT;
  } catch (error) {
    throw error;
  }
}

function calculateRecencyBonus(post1: Post, post2: Post): number {
  try {
    const getEffectiveDate = (post: Post): Date | null => {
      let effectiveDate: Date | null = null;
      let updatedDate: Date | null = null;
      let publishedDate: Date | null = null;

      if (post.updated) {
        try {
          const d = new Date(post.updated);
          if (!Number.isNaN(d.getTime())) updatedDate = d;
        } catch (_) {
          // 無効な日付は無視
        }
      }
      if (post.date) {
        try {
          const d = new Date(post.date);
          if (!Number.isNaN(d.getTime())) publishedDate = d;
        } catch (_) {
          // 無効な日付は無視
        }
      }

      if (updatedDate) effectiveDate = updatedDate;
      else if (publishedDate) effectiveDate = publishedDate;

      return effectiveDate;
    };

    const effectiveDate1 = getEffectiveDate(post1);
    const effectiveDate2 = getEffectiveDate(post2);

    if (!effectiveDate1 || !effectiveDate2) return 0;

    try {
      const diffInMs = Math.abs(effectiveDate1.getTime() - effectiveDate2.getTime());
      const decayPeriodInMs = RECENCY_DECAY_DAYS * 24 * 60 * 60 * 1000;

      if (decayPeriodInMs <= 0) return 0;

      const bonus = RECENCY_BONUS_FACTOR * Math.max(0, 1 - diffInMs / decayPeriodInMs);
      return bonus;
    } catch (error) {
      console.error(`[build/similarity/post] 新鮮度ボーナス計算中にエラー (${post1.slug} と ${post2.slug}):`, error);
      throw error;
    }
  } catch (error) {
    throw error;
  }
}

async function calculatePostSimilarity(
  post: Post,
  targetPost: Post,
  postTfIdf: TfIdfVector,
  targetPostTfIdf: TfIdfVector,
  postTfIdfNorm: number,
  targetPostTfIdfNorm: number,
  sortedTags: TagSimilarityScores,
): Promise<number> {
  if (!post.slug || !targetPost.slug) {
    throw new Error('スラグを持たない投稿の類似度は計算できません');
  }

  // キャッシュをチェック
  const cacheKey = [post.slug, targetPost.slug].sort().join('_');
  const cachedScore = similarityCache.get(cacheKey);
  if (cachedScore !== undefined) {
    return cachedScore;
  }

  // タグ類似度を計算
  const tagSimilarityScore = calculateTagSimilarity(post.tags || [], targetPost.tags || [], sortedTags);

  // タグ類似度が非常に低い場合、コンテンツ類似度を計算しても最終スコアが閾値を超えない
  // 早期リターンでパフォーマンスを改善
  const maxPossibleScore = TAG_WEIGHT * tagSimilarityScore + CONTENT_WEIGHT * 1.0; // 最大値を仮定
  if (maxPossibleScore < MIN_SIMILARITY_SCORE) {
    similarityCache.set(cacheKey, 0);
    return 0;
  }

  // コンテンツ類似度を計算
  const contentSimilarityScore = calculateContentSimilarity(
    postTfIdf,
    targetPostTfIdf,
    postTfIdfNorm,
    targetPostTfIdfNorm,
  );

  // 新鮮度ボーナスを計算
  const recencyBonus = calculateRecencyBonus(post, targetPost);

  // 最終スコアの計算
  const weightedScore = Math.max(0, TAG_WEIGHT * tagSimilarityScore + CONTENT_WEIGHT * contentSimilarityScore);
  const finalScore = weightedScore * (1 + recencyBonus);
  const roundedScore = Math.round(Math.max(0, finalScore) * 10000) / 10000;

  // 計算結果をキャッシュに保存
  similarityCache.set(cacheKey, roundedScore);
  return roundedScore;
}

/**
 * 各記事に対して関連度の高い記事を計算し、類似度スコアを返す
 *
 * @param posts - 全記事の配列
 * @param sortedTags - タグ間の類似度スコアマップ
 * @returns 記事スラッグをキーとし、関連記事スラッグとスコアのマップを値とする配列
 */
export async function getRelatedPosts(
  posts: Post[],
  sortedTags: TagSimilarityScores,
): Promise<{ [key: string]: Record<string, number> }[]> {
  // 入力検証
  if (!Array.isArray(posts) || posts.length === 0 || typeof sortedTags !== 'object' || sortedTags === null) {
    console.warn('getRelatedPosts: Invalid input provided (posts or sortedTags). Returning empty array.');
    return [];
  }

  // トークナイザの初期化
  const tokenizer = await getTokenizer();

  // 1. コンテンツ前処理（非同期・並行処理）
  const processedContents: string[][] = [];

  // 個別記事処理のタイムアウト（ミリ秒）
  const perPostTimeout = 10000;

  async function preprocessPostWithTimeout(
    post: Post,
    tokenizer: Tokenizer<IpadicFeatures>,
    timeout: number,
  ): Promise<string[]> {
    const textToProcess = extractTextFromPost(post);
    return Promise.race([
      preprocessText(textToProcess, tokenizer, post.slug),
      new Promise<string[]>((_, reject) =>
        setTimeout(() => reject(new Error(`処理タイムアウト (${timeout}ms)`)), timeout),
      ),
    ]);
  }

  // 記事を小さなバッチに分割して処理
  for (let i = 0; i < posts.length; i += PREPROCESSING_BATCH_SIZE) {
    const batch = posts.slice(i, i + PREPROCESSING_BATCH_SIZE);

    const batchResults = await Promise.all(
      batch.map(async (post) => {
        try {
          return await preprocessPostWithTimeout(post, tokenizer, perPostTimeout);
        } catch (error) {
          console.warn(`[getRelatedPosts] エラー (${post.slug}):`, error instanceof Error ? error.message : error);
          return [];
        }
      }),
    );

    processedContents.push(...batchResults);
  }

  // 2. IDFスコア計算
  const idfScores = calculateIdf(posts, processedContents);

  // 3. TF-IDFベクトル計算（ノルムも同時計算）
  const tfIdfVectors: { [slug: string]: TfIdfVector } = {};
  const tfIdfNorms: TfIdfNorms = {};
  const postIndexMap = new Map<string, number>();

  for (let index = 0; index < posts.length; index++) {
    const post = posts[index];
    if (!post.slug) continue;

    postIndexMap.set(post.slug, index);
    try {
      const tfScores = calculateTf(processedContents[index]);
      const { vector, norm } = calculateTfIdfVectorWithNorm(post.slug, tfScores, idfScores);
      tfIdfVectors[post.slug] = vector;
      tfIdfNorms[post.slug] = norm;
    } catch (error) {
      console.warn(`[getRelatedPosts] TF-IDF計算エラー (${post.slug}):`, error);
      continue;
    }
  }

  // タグによる候補絞り込みのためのインデックス作成
  const tagToPostIndices = new Map<string, Set<number>>();
  const taggedPostsCount = new Map<string, number>(); // タグごとの記事数カウント

  // タグのインデックス作成をバッチ処理前に一度だけ実行
  for (let index = 0; index < posts.length; index++) {
    const post = posts[index];
    if (!post.tags || post.tags.length === 0) continue;

    // Set化して重複を排除
    const uniqueTags = new Set(post.tags);

    for (const tag of uniqueTags) {
      // タグの記事インデックスを追加
      if (!tagToPostIndices.has(tag)) {
        tagToPostIndices.set(tag, new Set([index]));
        taggedPostsCount.set(tag, 1);
      } else {
        tagToPostIndices.get(tag)!.add(index);
        taggedPostsCount.set(tag, (taggedPostsCount.get(tag) || 0) + 1);
      }
    }
  }

  // 4. 各記事に対して関連度計算（チャンク分割で並行処理）
  const results: { [key: string]: Record<string, number> }[] = [];

  // 記事をチャンクに分割
  for (let i = 0; i < posts.length; i += SIMILARITY_BATCH_SIZE) {
    const targetPosts = posts.slice(i, i + SIMILARITY_BATCH_SIZE);
    const chunkResults = await Promise.all(
      targetPosts.map(async (targetPost) => {
        if (!targetPost.slug || !tfIdfVectors[targetPost.slug]) {
          return null;
        }

        const targetPostTfIdf = tfIdfVectors[targetPost.slug];
        const targetPostNorm = tfIdfNorms[targetPost.slug];
        const targetTags = targetPost.tags || [];

        // ノルムが計算されていない場合はスキップ（異常ケース）
        if (targetPostNorm === undefined || targetPostNorm === 0) {
          return null;
        }

        // タグがない記事は候補も少ないため早期スキップ
        if (targetTags.length === 0) {
          return null;
        }

        // タグに基づく候補記事の絞り込み（加点方式：共通タグ数でソート）
        const candidateIndices = new Set<number>();
        const commonTagCounts = new Map<number, number>(); // 候補記事ごとの共通タグ数

        // 共通タグ数をカウント
        targetTags.forEach((tag) => {
          const indices = tagToPostIndices.get(tag);
          if (indices) {
            indices.forEach((index) => {
              if (posts[index]?.slug !== targetPost.slug) {
                candidateIndices.add(index);
                commonTagCounts.set(index, (commonTagCounts.get(index) || 0) + 1);
              }
            });
          }
        });

        // 候補が少なすぎる場合はスキップ
        if (candidateIndices.size < 2) {
          return null;
        }

        // 共通タグ数でソートして上位候補を選択（加点方式）
        // - 共通タグが多い記事が優先される
        // - 共通タグが少ない記事も下位候補として残る
        const sortedCandidates = Array.from(candidateIndices)
          .map((index) => ({
            index,
            commonTags: commonTagCounts.get(index) || 0,
          }))
          .filter((candidate) => candidate.commonTags >= MIN_COMMON_TAGS)
          .sort((a, b) => b.commonTags - a.commonTags)
          .slice(0, MAX_SIMILARITY_CANDIDATES) // 上位50件のみ
          .map((c) => c.index);

        // 候補が少なすぎる場合はスキップ
        if (sortedCandidates.length < 2) {
          return null;
        }

        // 絞り込んだ候補に対して類似度を計算
        // 重複計算を避けるためのキー検証用セット
        const processedPairs = new Set<string>();

        // 類似度計算を並列処理で効率化
        const relatedPostsData = await Promise.all(
          sortedCandidates.map(async (postIndex) => {
            const post = posts[postIndex];
            if (!post || !post.slug || !tfIdfVectors[post.slug]) return null;

            // 既に計算済みのペアはスキップ
            const pairKey = [post.slug, targetPost.slug].sort().join('_');
            if (processedPairs.has(pairKey)) return null;
            processedPairs.add(pairKey);

            const postTfIdf = tfIdfVectors[post.slug];
            const postNorm = tfIdfNorms[post.slug];

            // ノルムが計算されていない場合はスキップ（異常ケース）
            if (postNorm === undefined || postNorm === 0) {
              return null;
            }

            try {
              const similarityScore = await calculatePostSimilarity(
                post,
                targetPost,
                postTfIdf,
                targetPostTfIdf,
                postNorm,
                targetPostNorm,
                sortedTags,
              );
              return { slug: post.slug, similarityScore };
            } catch (error) {
              console.warn(`類似度計算中にエラー (${post.slug} - ${targetPost.slug}):`, error);
              return null;
            }
          }),
        );

        // フィルタリングとソート（最小類似度閾値を適用）
        const validPosts = relatedPostsData
          .filter(
            (post): post is { slug: string; similarityScore: number } =>
              post !== null && post.similarityScore >= MIN_SIMILARITY_SCORE,
          )
          .sort((a, b) => b.similarityScore - a.similarityScore)
          .slice(0, SIMILARITY_LIMIT);

        if (validPosts.length === 0) {
          return null;
        }

        // 結果を指定形式に変換
        const scoredArticles = validPosts.reduce<Record<string, number>>((acc, post) => {
          acc[post.slug] = post.similarityScore;
          return acc;
        }, {});

        return { [targetPost.slug]: scoredArticles };
      }),
    );

    const chunkValidResults = chunkResults.filter(
      (result): result is { [key: string]: Record<string, number> } => result !== null,
    );
    results.push(...chunkValidResults);
  }

  return results;
}
