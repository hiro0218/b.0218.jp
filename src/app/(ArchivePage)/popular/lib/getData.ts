import { getPopularPost } from '@/app/libs/getPopularPost';
import { getPostsListJson } from '@/lib/data/posts';
import type { PostSummary } from '@/types/source';

const POST_DISPLAY_LIMIT = 20;

const posts = getPostsListJson();

type ReturnType = {
  popularPosts: PostSummary[];
};

export const getData = (): ReturnType => {
  const popularPosts = getPopularPost(posts, POST_DISPLAY_LIMIT);

  return {
    popularPosts,
  };
};
