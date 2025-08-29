import type {
  Page,
  Post,
  PostPopularityScores,
  PostSimilarityMatrix,
  PostSummary,
  TagIndex,
  TagSimilarityScores,
} from '@/types/source';
import pages from '~/dist/pages.json';
import posts from '~/dist/posts.json';
import postsList from '~/dist/posts-list.json';
import postsPopular from '~/dist/posts-popular.json';
import postsSimilarity from '~/dist/posts-similarity.json';
import tags from '~/dist/tags.json';
import tagsSimilarity from '~/dist/tags-similarity.json';
import tagsWithCount from '~/dist/tags-with-count.json';

export const getTagsJson = (): TagIndex => {
  return tags;
};

export const getPostsJson = (): Post[] => {
  return posts;
};

export const getPostsListJson = (): PostSummary[] => {
  return postsList;
};

export const getPagesJson = (): Page[] => {
  return pages;
};

export const getTagsWithCount = () => {
  return tagsWithCount;
};

export const getSimilarTag = (): TagSimilarityScores => {
  return tagsSimilarity;
};

export const getSimilarPosts = (): PostSimilarityMatrix => {
  return postsSimilarity;
};

export const getPostsPopular = (): PostPopularityScores => {
  return postsPopular;
};
