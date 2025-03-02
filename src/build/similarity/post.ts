import type { PostListProps, TagSimilarProps } from '@/types/source';

// 設定パラメータ
const LIMIT = 6; // 取得する関連投稿の最大数
const BASE_THRESHOLD = 0.5; // 基本閾値
const TAG_WEIGHT = 0.7; // タグの重み
const CONTENT_WEIGHT = 0.3; // 内容の重み（タイトルやカテゴリを含む）
const RECENCY_BONUS = 0.1; // 新しい投稿へのボーナス係数

// キャッシュ
const similarityCache = new Map<string, number>();

/**
 * 二つの投稿間の類似度を計算する
 * @param post 比較対象の投稿
 * @param targetPost 基準となる投稿
 * @param sortedTags タグの関連度情報
 * @returns 類似度スコア（0～1の範囲）
 */
function calculatePostSimilarity(post: PostListProps, targetPost: PostListProps, sortedTags: TagSimilarProps): number {
  // キャッシュキーを生成（双方向に使えるようにIDを小さい順に並べる）
  const cacheKey = [post.slug, targetPost.slug].sort().join('_');

  // キャッシュに存在すればそれを返す
  if (similarityCache.has(cacheKey)) {
    return similarityCache.get(cacheKey)!;
  }

  const targetPostTags = targetPost.tags;
  const postTags = post.tags;

  // 1. タグの類似度計算（従来のロジックを改善）
  const tagSimilarityScore = calculateTagSimilarity(postTags, targetPostTags, sortedTags);

  // 2. コンテンツの類似度計算（タイトルやカテゴリーを含む）
  const contentSimilarityScore = calculateContentSimilarity(post, targetPost);

  // 3. 投稿日に基づく新鮮度ボーナス
  const recencyBonus = calculateRecencyBonus(post, targetPost);

  // 4. 最終スコアの計算（重み付き平均 + 新鮮度ボーナス）
  const finalScore = (TAG_WEIGHT * tagSimilarityScore + CONTENT_WEIGHT * contentSimilarityScore) * (1 + recencyBonus);

  // 小数点第4位で四捨五入
  const roundedScore = Math.round(finalScore * 10000) / 10000;

  // キャッシュに保存
  similarityCache.set(cacheKey, roundedScore);

  return roundedScore;
}

/**
 * タグの類似度を計算する（コサイン類似度とジャッカード類似度の組み合わせ）
 */
function calculateTagSimilarity(tags1: string[], tags2: string[], sortedTags: TagSimilarProps): number {
  // タグが存在しない場合は0を返す
  if (tags1.length === 0 || tags2.length === 0) {
    return 0;
  }

  // 有効なタグのみをフィルタリング
  const validTags1 = tags1.filter((tag) => sortedTags[tag]);
  const validTags2 = tags2.filter((tag) => sortedTags[tag]);

  if (validTags1.length === 0 || validTags2.length === 0) {
    return 0;
  }

  // 1. ジャッカード類似度の計算
  const tagSet1 = new Set(validTags1);
  const tagSet2 = new Set(validTags2);
  const intersection = new Set([...tagSet1].filter((tag) => tagSet2.has(tag)));
  const union = new Set([...tagSet1, ...tagSet2]);
  const jaccardSimilarity = intersection.size / union.size;

  // 2. タグの関連度に基づく類似度の計算
  let relatedTagScore = 0;
  let comparisons = 0;

  for (const tag1 of validTags1) {
    const tagRelevance = sortedTags[tag1];

    for (const tag2 of validTags2) {
      const relevance = tagRelevance[tag2];

      // 動的閾値の計算（データに基づいて調整）
      const dynamicThreshold = BASE_THRESHOLD * (1 - 0.1 * Math.min(validTags1.length, validTags2.length));

      if (relevance && relevance >= dynamicThreshold) {
        relatedTagScore += relevance;
        comparisons++;
      }
    }
  }

  // 正規化
  const normalizedRelatedScore = comparisons > 0 ? relatedTagScore / comparisons : 0;

  // 3. 最終的なタグ類似度（ジャッカード類似度と関連度スコアの組み合わせ）
  return jaccardSimilarity * 0.4 + normalizedRelatedScore * 0.6;
}

/**
 * コンテンツの類似度を計算する
 */
function calculateContentSimilarity(post1: PostListProps, post2: PostListProps): number {
  // ここでは簡易実装として、タイトルの単語の重複度を計算
  const title1Words = post1.title.toLowerCase().split(/\s+/);
  const title2Words = post2.title.toLowerCase().split(/\s+/);

  const title1WordSet = new Set(title1Words);
  const title2WordSet = new Set(title2Words);

  const intersection = new Set([...title1WordSet].filter((word) => title2WordSet.has(word)));
  const union = new Set([...title1WordSet, ...title2WordSet]);

  return intersection.size / union.size;
}

/**
 * 投稿の新鮮度に基づくボーナスを計算する
 */
function calculateRecencyBonus(post1: PostListProps, post2: PostListProps): number {
  // 投稿日が近いほどボーナスが高くなる
  // 注：dateプロパティが存在することを前提
  if (!post1.date || !post2.date) {
    return 0;
  }

  const date1 = new Date(post1.date);
  const date2 = new Date(post2.date);

  // 日付の差（ミリ秒）を取得
  const diff = Math.abs(date1.getTime() - date2.getTime());
  // 30日を基準として減衰する新鮮度ボーナス
  const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;

  return Math.max(0, RECENCY_BONUS * (1 - diff / thirtyDaysInMs));
}

/**
 * 関連投稿を取得する
 */
export function getRelatedPosts(posts: PostListProps[], sortedTags: TagSimilarProps) {
  // キャッシュのクリア（投稿リストが変更された場合）
  similarityCache.clear();

  return posts
    .map((targetPost) => {
      // 自分以外の投稿のみを対象に類似度を計算
      const relatedPosts = posts
        .filter((post) => post.slug !== targetPost.slug)
        .map((post) => {
          const similarityScore = calculatePostSimilarity(post, targetPost, sortedTags);
          return similarityScore > 0 ? { slug: post.slug, similarityScore } : null;
        })
        .filter((post): post is { slug: string; similarityScore: number } => post !== null)
        .sort((a, b) => b.similarityScore - a.similarityScore)
        .slice(0, LIMIT);

      // 結果が空の場合はスキップ
      if (relatedPosts.length === 0) {
        return null;
      }

      // 最終的なオブジェクトの形式に変換
      const scoredArticles = relatedPosts.reduce<Record<string, number>>((acc, post) => {
        acc[post.slug] = post.similarityScore;
        return acc;
      }, {});

      return {
        [targetPost.slug]: scoredArticles,
      };
    })
    .filter((result): result is { [key: string]: Record<string, number> } => result !== null);
}
