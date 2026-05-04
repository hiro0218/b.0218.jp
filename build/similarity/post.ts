import { availableParallelism } from 'node:os';
import path from 'node:path';
import { Worker } from 'node:worker_threads';
import type { Post, TagSimilarityScores } from '@/types/source';
import {
  calculateBm25Idf,
  calculateDocFrequency,
  calculateIdfWeightedJaccard,
  calculateSublinearTf,
  filterRareTerms,
} from './scoring';
import { extractTextFromPost, getTokenizer, preprocessText } from './textProcessing';

// 類似度計算パラメータ
const SIMILARITY_LIMIT = 6;
const MIN_SIMILARITY_SCORE = 0.05;
const MIN_COMMON_TAGS = 1;
const MAX_SIMILARITY_CANDIDATES = 50;
const TAG_WEIGHT = 0.6; // タグ類似度の重み
const CONTENT_WEIGHT = 0.4; // コンテンツ類似度の重み
const RECENCY_BONUS_FACTOR = 0.1; // 新鮮度ボーナス係数
const RECENCY_DECAY_MS = 30 * 24 * 60 * 60 * 1000; // 30日（ミリ秒）
const TAG_SIMILARITY_BASE_THRESHOLD = 0.5; // タグ類似度閾値
const TAG_SIMILARITY_JACCARD_WEIGHT = 0.4; // ジャッカード係数重み
const TAG_SIMILARITY_RELATED_WEIGHT = 0.6; // 関連度スコア重み

// キャッシュの初期化
const similarityCache = new Map<string, number>();
const tfIdfCache = new Map<string, { vector: Record<string, number>; norm: number; size: number }>();

const MAX_TOKENIZE_WORKERS = 4;
const MIN_POSTS_FOR_WORKER_TOKENIZATION = 16;

// TF-IDF計算関連の型定義
type IdfScores = Record<string, number>;
type TfScores = Record<string, number>;
type TfIdfVector = Record<string, number>;
type TfIdfNorms = Record<string, number>;
type TokenizeJob = { index: number; slug?: string; text: string };
type TokenizeWorkerResult = { index: number; tokens: string[]; error?: string };

function getTokenizeWorkerCount(postCount: number): number {
  if (postCount < MIN_POSTS_FOR_WORKER_TOKENIZATION) return 1;

  return Math.max(1, Math.min(MAX_TOKENIZE_WORKERS, Math.max(1, availableParallelism() - 1), postCount));
}

function chunkTokenizeJobs(jobs: TokenizeJob[], workerCount: number): TokenizeJob[][] {
  const chunkSize = Math.ceil(jobs.length / workerCount);
  const chunks: TokenizeJob[][] = [];

  for (let i = 0; i < jobs.length; i += chunkSize) {
    chunks.push(jobs.slice(i, i + chunkSize));
  }

  return chunks;
}

async function runTokenizeWorker(jobs: TokenizeJob[]): Promise<TokenizeWorkerResult[]> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.join(__dirname, 'preprocessWorker.ts'), {
      execArgv: ['--require', 'esbuild-register'],
    });
    let settled = false;

    worker.once('message', (message: { results?: TokenizeWorkerResult[]; error?: string }) => {
      settled = true;
      void worker.terminate();
      if (message.error) {
        reject(new Error(message.error));
        return;
      }
      resolve(message.results ?? []);
    });

    worker.once('error', (error) => {
      settled = true;
      reject(error);
    });

    worker.once('exit', (code) => {
      if (!settled && code !== 0) {
        reject(new Error(`tokenize worker exited with code ${code}`));
      }
    });

    worker.postMessage(jobs);
  });
}

async function preprocessPosts(posts: Post[]): Promise<string[][]> {
  const jobs = posts.map<TokenizeJob>((post, index) => ({
    index,
    slug: post.slug,
    text: extractTextFromPost(post),
  }));
  const workerCount = getTokenizeWorkerCount(jobs.length);

  if (workerCount === 1) {
    const tokenizer = await getTokenizer();
    return jobs.map((job) => preprocessText(job.text, tokenizer, job.slug));
  }

  try {
    const resultChunks = await Promise.all(
      chunkTokenizeJobs(jobs, workerCount).map((chunk) => runTokenizeWorker(chunk)),
    );
    const processedContents: string[][] = new Array(posts.length);

    for (const chunk of resultChunks) {
      for (const result of chunk) {
        if (result.error) {
          console.warn(`[getRelatedPosts] エラー (${posts[result.index]?.slug ?? result.index}):`, result.error);
        }
        processedContents[result.index] = result.tokens;
      }
    }

    for (let i = 0; i < processedContents.length; i++) {
      processedContents[i] ??= [];
    }

    return processedContents;
  } catch (error) {
    console.warn('[getRelatedPosts] workerでのテキスト前処理に失敗したため同期処理へフォールバックします:', error);
    const tokenizer = await getTokenizer();
    return jobs.map((job) => preprocessText(job.text, tokenizer, job.slug));
  }
}

function calculateIdf(posts: Post[], processedContents: string[][]): IdfScores {
  const totalDocs = posts.length;
  const rawDocFrequency = calculateDocFrequency(processedContents);
  const filteredDocFrequency = filterRareTerms(rawDocFrequency);
  return calculateBm25Idf(totalDocs, filteredDocFrequency);
}

function calculateTfIdfVectorWithNorm(
  slug: string,
  tfScores: TfScores,
  idfScores: IdfScores,
): { vector: TfIdfVector; norm: number; size: number } {
  const cacheKey = `tfidf_${slug}`;
  const cached = tfIdfCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const tfIdfVector: TfIdfVector = {};
  let normSum = 0;
  let size = 0;

  for (const word in tfScores) {
    if (idfScores[word] !== undefined) {
      const val = tfScores[word] * idfScores[word];
      tfIdfVector[word] = val;
      normSum += val * val;
      size++;
    }
  }

  const result = { vector: tfIdfVector, norm: Math.sqrt(normSum), size };
  tfIdfCache.set(cacheKey, result);
  return result;
}

function calculateCosineSimilarityWithNorms(
  vec1: TfIdfVector,
  vec2: TfIdfVector,
  magnitude1: number,
  magnitude2: number,
  size1: number,
  size2: number,
): number {
  if (magnitude1 === 0 || magnitude2 === 0) return 0;

  let dotProduct = 0;

  // 小さい方のベクトルを反復して効率化（サイズは事前計算済み）
  const [smaller, larger] = size1 <= size2 ? [vec1, vec2] : [vec2, vec1];

  for (const word in smaller) {
    const val = larger[word];
    if (val !== undefined) {
      dotProduct += smaller[word] * val;
    }
  }

  return Math.min(1, dotProduct / (magnitude1 * magnitude2));
}

function calculateTagSimilarity(
  validTags1: string[],
  validTags2: string[],
  sortedTags: TagSimilarityScores,
  tagIdf: Record<string, number>,
): number {
  if (validTags1.length === 0 || validTags2.length === 0) {
    return 0;
  }

  // IDF-weighted Jaccard 類似度の計算
  const idfWeightedJaccard = calculateIdfWeightedJaccard(validTags1, validTags2, tagIdf);

  // 関連タグスコアの計算（NPMI ベース、維持）
  let relatedTagScoreSum = 0;
  let comparisonCount = 0;

  // dynamicThreshold はループ内で不変のためループ外で事前計算
  const dynamicThreshold = TAG_SIMILARITY_BASE_THRESHOLD * (1 - 0.1 * Math.min(validTags1.length, validTags2.length));

  for (const tag1 of validTags1) {
    const tagRelevanceMap = sortedTags[tag1];
    if (!tagRelevanceMap) continue;

    for (const tag2 of validTags2) {
      const relevanceScore = tagRelevanceMap[tag2];

      if (relevanceScore && relevanceScore >= dynamicThreshold) {
        relatedTagScoreSum += relevanceScore;
        comparisonCount++;
      }
    }
  }

  const normalizedRelatedScore = comparisonCount > 0 ? relatedTagScoreSum / comparisonCount : 0;

  // 最終的なタグ類似度
  return idfWeightedJaccard * TAG_SIMILARITY_JACCARD_WEIGHT + normalizedRelatedScore * TAG_SIMILARITY_RELATED_WEIGHT;
}

function getEffectiveTimestamp(post: Post): number | null {
  if (post.updated) {
    const d = new Date(post.updated);
    if (!Number.isNaN(d.getTime())) return d.getTime();
  }
  if (post.date) {
    const d = new Date(post.date);
    if (!Number.isNaN(d.getTime())) return d.getTime();
  }
  return null;
}

function calculateRecencyBonus(ts1: number | null, ts2: number | null): number {
  if (ts1 === null || ts2 === null) return 0;

  const diffInMs = Math.abs(ts1 - ts2);
  return RECENCY_BONUS_FACTOR * Math.max(0, 1 - diffInMs / RECENCY_DECAY_MS);
}

function calculatePostSimilarity(
  postSlug: string,
  targetSlug: string,
  postTfIdf: TfIdfVector,
  targetPostTfIdf: TfIdfVector,
  postTfIdfNorm: number,
  targetPostTfIdfNorm: number,
  postTfIdfSize: number,
  targetTfIdfSize: number,
  postValidTags: string[],
  targetValidTags: string[],
  sortedTags: TagSimilarityScores,
  tagIdf: Record<string, number>,
  postTimestamp: number | null,
  targetTimestamp: number | null,
): number {
  // キャッシュをチェック（配列生成 + sort を回避）
  const cacheKey = postSlug < targetSlug ? `${postSlug}_${targetSlug}` : `${targetSlug}_${postSlug}`;
  const cachedScore = similarityCache.get(cacheKey);
  if (cachedScore !== undefined) {
    return cachedScore;
  }

  // タグ類似度を計算（事前検証済みタグを使用）
  const tagSimilarityScore = calculateTagSimilarity(postValidTags, targetValidTags, sortedTags, tagIdf);

  // タグ類似度が非常に低い場合、コンテンツ類似度を計算しても最終スコアが閾値を超えない
  // 早期リターンでパフォーマンスを改善
  const maxPossibleScore = TAG_WEIGHT * tagSimilarityScore + CONTENT_WEIGHT * 1.0; // 最大値を仮定
  if (maxPossibleScore < MIN_SIMILARITY_SCORE) {
    similarityCache.set(cacheKey, 0);
    return 0;
  }

  // コンテンツ類似度を計算
  const contentSimilarityScore = calculateCosineSimilarityWithNorms(
    postTfIdf,
    targetPostTfIdf,
    postTfIdfNorm,
    targetPostTfIdfNorm,
    postTfIdfSize,
    targetTfIdfSize,
  );

  // 新鮮度ボーナスを計算（事前計算済みタイムスタンプを使用）
  const recencyBonus = calculateRecencyBonus(postTimestamp, targetTimestamp);

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

  // 1. コンテンツ前処理
  const processedContents = await preprocessPosts(posts);

  // 2. IDFスコア計算
  const idfScores = calculateIdf(posts, processedContents);

  // 3. TF-IDFベクトル計算（ノルムも同時計算）
  const tfIdfVectors: { [slug: string]: TfIdfVector } = {};
  const tfIdfNorms: TfIdfNorms = {};
  const tfIdfSizes: Record<string, number> = {};

  for (let index = 0; index < posts.length; index++) {
    const post = posts[index];
    if (!post.slug) continue;

    try {
      const tfScores = calculateSublinearTf(processedContents[index]);
      const { vector, norm, size } = calculateTfIdfVectorWithNorm(post.slug, tfScores, idfScores);
      tfIdfVectors[post.slug] = vector;
      tfIdfNorms[post.slug] = norm;
      tfIdfSizes[post.slug] = size;
    } catch (error) {
      console.warn(`[getRelatedPosts] TF-IDF計算エラー (${post.slug}):`, error);
      continue;
    }
  }

  // タグによる候補絞り込みのためのインデックス作成
  const tagToPostIndices = new Map<string, Set<number>>();
  const taggedPostsCount = new Map<string, number>(); // タグごとの記事数カウント

  for (let index = 0; index < posts.length; index++) {
    const post = posts[index];
    if (!post.tags || post.tags.length === 0) continue;

    // Set化して重複を排除
    const uniqueTags = new Set(post.tags);

    for (const tag of uniqueTags) {
      if (!tagToPostIndices.has(tag)) {
        tagToPostIndices.set(tag, new Set([index]));
        taggedPostsCount.set(tag, 1);
      } else {
        tagToPostIndices.get(tag)!.add(index);
        taggedPostsCount.set(tag, (taggedPostsCount.get(tag) || 0) + 1);
      }
    }
  }

  // 4. タグの IDF を計算（IDF-weighted Jaccard 用）
  const tagIdf: Record<string, number> = {};
  const totalPostCount = posts.length;
  for (const [tag, count] of taggedPostsCount.entries()) {
    tagIdf[tag] = Math.log((totalPostCount - count + 0.5) / (count + 0.5) + 1);
  }

  // 5. タイムスタンプを事前計算（index ベースの配列）
  const timestamps: (number | null)[] = new Array(posts.length);
  for (let i = 0; i < posts.length; i++) {
    timestamps[i] = getEffectiveTimestamp(posts[i]);
  }

  // 6. 各記事の validTags を事前計算（sortedTags に存在するタグのみ）
  const postValidTags: string[][] = new Array(posts.length);
  for (let i = 0; i < posts.length; i++) {
    const tags = posts[i].tags;
    if (!tags || tags.length === 0) {
      postValidTags[i] = [];
    } else {
      postValidTags[i] = tags.filter((tag) => sortedTags[tag]);
    }
  }

  // 7. 各記事に対して関連度計算（同期処理）
  const results: { [key: string]: Record<string, number> }[] = [];

  for (let i = 0; i < posts.length; i++) {
    const targetPost = posts[i];
    if (!targetPost.slug || !tfIdfVectors[targetPost.slug]) {
      continue;
    }

    const targetPostTfIdf = tfIdfVectors[targetPost.slug];
    const targetPostNorm = tfIdfNorms[targetPost.slug];
    const targetTags = targetPost.tags || [];

    // ノルムが計算されていない場合はスキップ（異常ケース）
    if (targetPostNorm === undefined || targetPostNorm === 0) {
      continue;
    }

    // タグがない記事は候補も少ないため早期スキップ
    if (targetTags.length === 0) {
      continue;
    }

    // タグに基づく候補記事の絞り込み（加点方式：共通タグ数でソート）
    const candidateIndices = new Set<number>();
    const commonTagCounts = new Map<number, number>();

    for (const tag of targetTags) {
      const indices = tagToPostIndices.get(tag);
      if (indices) {
        for (const index of indices) {
          if (posts[index]?.slug !== targetPost.slug) {
            candidateIndices.add(index);
            commonTagCounts.set(index, (commonTagCounts.get(index) || 0) + 1);
          }
        }
      }
    }

    // 候補が少なすぎる場合はスキップ
    if (candidateIndices.size < 2) {
      continue;
    }

    // 共通タグ数でソートして上位候補を選択（加点方式）
    const sortedCandidates = Array.from(candidateIndices)
      .map((index) => ({
        index,
        commonTags: commonTagCounts.get(index) || 0,
      }))
      .filter((candidate) => candidate.commonTags >= MIN_COMMON_TAGS)
      .sort((a, b) => b.commonTags - a.commonTags)
      .slice(0, MAX_SIMILARITY_CANDIDATES)
      .map((c) => c.index);

    // 候補が少なすぎる場合はスキップ
    if (sortedCandidates.length < 2) {
      continue;
    }

    // 絞り込んだ候補に対して類似度を計算（同期ループ、similarityCache で重複排除済み）
    const relatedPostsData: { slug: string; similarityScore: number }[] = [];

    for (const postIndex of sortedCandidates) {
      const candidatePost = posts[postIndex];
      if (!candidatePost || !candidatePost.slug || !tfIdfVectors[candidatePost.slug]) continue;

      const postTfIdf = tfIdfVectors[candidatePost.slug];
      const postNorm = tfIdfNorms[candidatePost.slug];

      // ノルムが計算されていない場合はスキップ（異常ケース）
      if (postNorm === undefined || postNorm === 0) {
        continue;
      }

      try {
        const similarityScore = calculatePostSimilarity(
          candidatePost.slug,
          targetPost.slug,
          postTfIdf,
          targetPostTfIdf,
          postNorm,
          targetPostNorm,
          tfIdfSizes[candidatePost.slug],
          tfIdfSizes[targetPost.slug],
          postValidTags[postIndex],
          postValidTags[i],
          sortedTags,
          tagIdf,
          timestamps[postIndex],
          timestamps[i],
        );

        if (similarityScore >= MIN_SIMILARITY_SCORE) {
          relatedPostsData.push({ slug: candidatePost.slug, similarityScore });
        }
      } catch (error) {
        console.warn(`類似度計算中にエラー (${candidatePost.slug} - ${targetPost.slug}):`, error);
      }
    }

    // ソートして上位を選択
    relatedPostsData.sort((a, b) => b.similarityScore - a.similarityScore);
    const validPosts = relatedPostsData.slice(0, SIMILARITY_LIMIT);

    if (validPosts.length === 0) {
      continue;
    }

    // 結果を指定形式に変換
    const scoredArticles: Record<string, number> = Object.create(null);
    for (const { slug, similarityScore } of validPosts) {
      scoredArticles[slug] = similarityScore;
    }

    results.push({ [targetPost.slug]: scoredArticles });
  }

  // キャッシュクリア（モジュールグローバルなキャッシュの肥大化を防止）
  similarityCache.clear();
  tfIdfCache.clear();

  return results;
}
