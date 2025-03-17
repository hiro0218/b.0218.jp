import { getPostsListJson } from '@/lib/posts';
import { getPopularPost } from '@/pages/_libs/getPopularPost';
import type { PostListProps } from '@/types/source';

const POST_DISPLAY_LIMIT = 20;

const posts = getPostsListJson();

type ReturnType = {
  popularPosts: PostListProps[];
};

export const getData = (): ReturnType => {
  const popularPosts = getPopularPost(posts, POST_DISPLAY_LIMIT);

  return {
    popularPosts,
  };
};
