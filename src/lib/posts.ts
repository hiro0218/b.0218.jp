import type {
  PageProps,
  PostListProps,
  PostPopularProps,
  PostProps,
  PostSimilarProps,
  TagSimilarProps,
  TagsListProps,
} from '@/types/source';
import pages from '~/dist/pages.json';
import posts from '~/dist/posts.json';
import postsList from '~/dist/posts-list.json';
import postsPopular from '~/dist/posts-popular.json';
import postsSimilarity from '~/dist/posts-similarity.json';
import tags from '~/dist/tags.json';
import tagsSimilarity from '~/dist/tags-similarity.json';
import tagsWithCount from '~/dist/tags-with-count.json';

export const getTagsJson = (): TagsListProps => {
  return tags;
};

export const getPostsJson = (): PostProps[] => {
  return posts;
};

export const getPostsListJson = (): PostListProps[] => {
  return postsList;
};

export const getPagesJson = (): PageProps[] => {
  return pages;
};

export const getTagsWithCount = () => {
  return tagsWithCount;
};

export const getSimilarTag = (): TagSimilarProps => {
  return tagsSimilarity;
};

export const getSimilarPosts = (): PostSimilarProps => {
  return postsSimilarity;
};

export const getPostsPopular = (): PostPopularProps => {
  return postsPopular;
};
