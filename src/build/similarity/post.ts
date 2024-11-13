import type { PostListProps, TagSimilarProps } from '@/types/source';

const LIMIT = 6;

function calculatePostSimilarity(
  post: PostListProps,
  targetPostTags: PostListProps['tags'],
  sortedTags: TagSimilarProps,
) {
  let similarityScore = 0;
  let commonTagsCount = 0;
  const threshold = 0.5; // しきい値

  for (let i = 0; i < targetPostTags.length; i++) {
    const tag = targetPostTags[i];
    if (sortedTags[tag]) {
      for (let j = 0; j < post.tags.length; j++) {
        const relatedTag = post.tags[j];
        const relevance = sortedTags[tag][relatedTag];

        if (relevance && relevance >= threshold) {
          // 重みを使ってスコアに加算
          similarityScore += relevance;
          commonTagsCount++;
        }
      }
    }
  }

  // ジャッカード類似度による正規化
  const totalTags = new Set([...targetPostTags, ...post.tags]).size;
  similarityScore = (commonTagsCount / totalTags) * similarityScore;

  // 小数点第4位で四捨五入
  similarityScore = Math.round(similarityScore * 10000) / 10000;

  return similarityScore;
}

export function getRelatedPosts(posts: PostListProps[], sortedTags: TagSimilarProps) {
  return posts
    .map((targetPost) => {
      const targetPostTags = targetPost.tags;

      const scoredArticles = posts
        .map((post) => {
          if (post.slug !== targetPost.slug) {
            const similarityScore = calculatePostSimilarity(post, targetPostTags, sortedTags);
            if (similarityScore > 0) {
              return { slug: post.slug, similarityScore };
            }
          }
        })
        .filter((post) => post !== undefined)
        .sort((a, b) => b.similarityScore - a.similarityScore)
        .slice(0, LIMIT)
        .reduce((acc: Record<string, number>, post) => {
          acc[post.slug] = post.similarityScore;
          return acc;
        }, {});

      return {
        [targetPost.slug]: scoredArticles,
      };
    })
    .filter((post) => Object.keys(post[Object.keys(post)[0]]).length > 0);
}
