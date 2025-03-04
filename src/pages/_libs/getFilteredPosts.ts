import { getPostsListJson } from '@/lib/posts';
import { IGNORE_TAGS } from '@/pages/_libs/constant';
import type { PostListProps } from '@/types/source';

const posts = getPostsListJson();

export const getFilteredPosts = (): PostListProps[] => {
  return posts.filter((post) => !post.tags.some((tag) => IGNORE_TAGS.has(tag)));
};
