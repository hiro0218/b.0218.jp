import type { PostListProps, TagSimilarProps } from '@/types/source';

const LIMIT = 6;
const THRESHOLD = 0.5;

function calculatePostSimilarity(
  post: PostListProps,
  targetPostTags: PostListProps['tags'],
  sortedTags: TagSimilarProps,
) {
  let similarityScore = 0;
  let commonTagsCount = 0;
  const postTags = post.tags;

  // タグの集合を事前に作成して重複を排除
  const uniqueTags = new Set([...targetPostTags, ...postTags]);
  const totalTags = uniqueTags.size;

  // タグの比較回数を減らすため、存在するタグのみを処理
  const validTargetTags = targetPostTags.filter((tag) => sortedTags[tag]);

  for (const tag of validTargetTags) {
    const tagRelevance = sortedTags[tag];

    for (const relatedTag of postTags) {
      const relevance = tagRelevance[relatedTag];

      if (relevance && relevance >= THRESHOLD) {
        similarityScore += relevance;
        commonTagsCount++;
      }
    }
  }

  // ジャッカード類似度による正規化
  const normalizedScore = commonTagsCount > 0 ? (commonTagsCount / totalTags) * similarityScore : 0;

  // 小数点第4位で四捨五入
  return Math.round(normalizedScore * 10000) / 10000;
}

export function getRelatedPosts(posts: PostListProps[], sortedTags: TagSimilarProps) {
  return posts
    .map((targetPost) => {
      const targetPostTags = targetPost.tags;

      // 類似度計算が必要な投稿のみをフィルタリング
      const relatedPosts = posts
        .filter((post) => post.slug !== targetPost.slug)
        .map((post) => {
          const similarityScore = calculatePostSimilarity(post, targetPostTags, sortedTags);
          return similarityScore > 0 ? { slug: post.slug, similarityScore } : null;
        })
        .filter((post): post is { slug: string; similarityScore: number } => post !== null)
        .sort((a, b) => b.similarityScore - a.similarityScore)
        .slice(0, LIMIT);

      // 結果が空の場合はスキップするためにnullを返す
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
