import type { PostListProps, TagSimilarProps } from '@/types/source';

const LIMIT = 6;

function calculatePostSimilarity(
  post: PostListProps,
  targetPostTags: PostListProps['tags'],
  sortedTags: TagSimilarProps,
) {
  let similarityScore = 0;

  for (let i = 0; i < targetPostTags.length; i++) {
    const tag = targetPostTags[i];
    if (sortedTags[tag]) {
      for (let j = 0; j < post.tags.length; j++) {
        const relatedTag = post.tags[j];
        if (sortedTags[tag][relatedTag]) {
          similarityScore += sortedTags[tag][relatedTag];
        }
      }
    }
  }

  // 小数点第4位で四捨五入
  similarityScore = Math.round(similarityScore * 10000) / 10000;

  return similarityScore;
}

export function getRelatedPosts(targetPosts: PostListProps[], posts: PostListProps[], sortedTags: TagSimilarProps) {
  return targetPosts.map((targetPost) => {
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
  });
}
