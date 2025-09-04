import { getPostsListJson } from '@/lib/posts';
import type { PostSummary } from '@/types/source';
import { IGNORE_TAGS } from './constant';

const posts = getPostsListJson();

export const getFilteredPosts = (): PostSummary[] => {
  return posts.filter((post) => !post.tags.some((tag) => IGNORE_TAGS.has(tag)));
};
