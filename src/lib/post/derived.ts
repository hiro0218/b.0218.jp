import type { PostPopularityScores, PostSimilarityIndex } from '@/types/source';
import postsPopularData from '~/dist/posts-popular.json';
import postsSimilarityData from '~/dist/posts-similarity.json';

let cachedPostsPopular: PostPopularityScores | undefined;
let cachedPostsSimilarity: PostSimilarityIndex | undefined;

export const getPostsPopular = (): PostPopularityScores =>
  (cachedPostsPopular ??= postsPopularData as PostPopularityScores);

export const getSimilarPosts = (): PostSimilarityIndex =>
  (cachedPostsSimilarity ??= postsSimilarityData as PostSimilarityIndex);
