import { deepFreeze } from '@/lib/deepFreeze';
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
import postsList from '~/dist/posts-list.json';
import postsPopular from '~/dist/posts-popular.json';
import postsSimilarity from '~/dist/posts-similarity.json';
import posts from '~/dist/posts.json';
import tagsSimilarity from '~/dist/tags-similarity.json';
import tagsWithCount from '~/dist/tags-with-count.json';
import tags from '~/dist/tags.json';

export const getTagsJson = (): TagsListProps => {
  return Object.freeze(tags);
};

export const getPostsJson = (): Map<PostProps['slug'], PostProps> => {
  return new Map(posts.map((post) => [post.slug, Object.freeze(post)]));
};

export const getPostsListJson = (): Map<PostListProps['slug'], PostListProps> => {
  return new Map(postsList.map((post) => [post.slug, Object.freeze(post)]));
};

export const getPagesJson = (): Map<PageProps['slug'], PageProps> => {
  return new Map(pages.map((page) => [page.slug, Object.freeze(page)]));
};

export const getTagsWithCount = () => {
  return tagsWithCount.tagsWithCount;
};

export const getSimilarTag = (): TagSimilarProps => {
  return deepFreeze(tagsSimilarity);
};

export const getSimilarPosts = (): PostSimilarProps => {
  return postsSimilarity;
};

export const getPostsPopular = (): PostPopularProps => {
  return Object.freeze(postsPopular);
};
