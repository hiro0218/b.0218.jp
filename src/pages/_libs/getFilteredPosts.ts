import { getPostsListJson } from '@/lib/posts';
import { IGNORE_TAGS } from '@/pages/_libs/constant';

const posts = getPostsListJson();

export const getFilteredPosts = () => {
  return Array.from(posts.values()).filter((post) => !post.tags.some((tag) => IGNORE_TAGS.has(tag)));
};
