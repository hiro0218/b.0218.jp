import { PostList, TagSimilarProps } from '@/types/source';

function calculatePostSimilarity(post: PostList, targetPostTags: PostList['tags'], sortedTags: TagSimilarProps) {
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

  return Number(similarityScore.toFixed(4));
}

export function getRelatedPosts(targetPosts: PostList[], posts: PostList[], sortedTags: TagSimilarProps) {
  const LIMIT = 6;
  return targetPosts.map((targetPost) => {
    const targetPostTags = targetPost.tags;
    const scoredArticles: { slug: PostList['slug']; similarityScore: number }[] = [];

    posts.forEach((post) => {
      if (post.slug !== targetPost.slug) {
        const similarityScore = calculatePostSimilarity(post, targetPostTags, sortedTags);
        if (similarityScore > 0) {
          scoredArticles.push({ ...post, similarityScore });
        }
      }
    });

    scoredArticles.sort((a, b) => b.similarityScore - a.similarityScore);

    const relatedArticles = scoredArticles.slice(0, LIMIT).reduce((acc, post) => {
      acc[post.slug] = post.similarityScore;
      return acc;
    }, {});

    return {
      [targetPost.slug]: relatedArticles,
    };
  });
}
