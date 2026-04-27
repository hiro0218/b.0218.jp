import { getPostsListJson } from '@/lib/source/post';
import type { PostSummary } from '@/types/source';
import { IGNORE_TAGS } from './constants';

const posts = getPostsListJson();

export const getFilteredPosts = (): PostSummary[] => {
  return posts.filter((post) => !post.tags.some((tag) => IGNORE_TAGS.has(tag)));
};
