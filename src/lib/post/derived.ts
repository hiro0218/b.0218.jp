import type { PostPopularityScores, PostSimilarityMatrix } from '@/types/source';
import postsPopularData from '~/dist/posts-popular.json';
import postsSimilarityData from '~/dist/posts-similarity.json';

let cachedPostsPopular: PostPopularityScores | undefined;
let cachedPostsSimilarity: PostSimilarityMatrix | undefined;

export const getPostsPopular = (): PostPopularityScores =>
  (cachedPostsPopular ??= postsPopularData as PostPopularityScores);

export const getSimilarPosts = (): PostSimilarityMatrix =>
  (cachedPostsSimilarity ??= postsSimilarityData as PostSimilarityMatrix);
