import type {
  PageProps,
  PostListProps,
  PostProps,
  PostSimilarProps,
  TagSimilarProps,
  TagsListProps,
} from '@/types/source';

const { default: pages } = await import(/* webpackChunkName: "source" */ '~/dist/pages.json');
const { default: posts } = await import(/* webpackChunkName: "source" */ '~/dist/posts.json');
const { default: postsList } = await import(/* webpackChunkName: "source" */ '~/dist/posts-list.json');
const { default: postsSimilarity } = await import(/* webpackChunkName: "source" */ '~/dist/posts-similarity.json');
const { default: tags } = await import(/* webpackChunkName: "source" */ '~/dist/tags.json');
const { default: tagsSimilarity } = await import(/* webpackChunkName: "source" */ '~/dist/tags-similarity.json');

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
