import type {
  PageProps,
  PostListProps,
  PostProps,
  PostSimilarProps,
  TagSimilarProps,
  TagsListProps,
} from '@/types/source';
import pages from '~/dist/pages.json';
import posts from '~/dist/posts.json';
import postsList from '~/dist/posts-list.json';
import postsSimilarity from '~/dist/posts-similarity.json';
import tags from '~/dist/tags.json';
import tagsSimilarity from '~/dist/tags-similarity.json';

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

export const getTagsWithCount = (): [string, number][] => {
  return Object.entries(getTagsJson())
    .map(([key, val]) => {
      return [key, val.length] as [string, number];
    })
    .sort((a, b) => b[1] - a[1]); // 件数の多い順にソート
};

export const getSimilarTag = (): TagSimilarProps => {
  return tagsSimilarity;
};

export const getSimilarPost = (): PostSimilarProps => {
  return postsSimilarity;
};
