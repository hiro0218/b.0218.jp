import { Post as PostProps, TagSimilar } from '@/types/source';

function calculatePostSimilarity(post: Partial<PostProps>, targetPostTags: PostProps['tags'], sortedTags: TagSimilar) {
  let similarityScore = 0;

  targetPostTags.forEach((tag) => {
    if (sortedTags[tag]) {
      post.tags.forEach((relatedTag) => {
        if (sortedTags[tag][relatedTag]) {
          similarityScore += sortedTags[tag][relatedTag];
        }
      });
    }
  });

  return Number(similarityScore.toFixed(4));
}

export function getRelatedPosts(
  targetPosts: Partial<PostProps>[],
  posts: Partial<PostProps>[],
  sortedTags: TagSimilar,
) {
  const LIMIT = 6;
  return targetPosts.map((targetPost) => {
    const targetPostTags = targetPost.tags;
    const scoredArticles = [];

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
