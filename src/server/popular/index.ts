import { getPostsListJson } from '@/lib/posts';

import { getPopularPost } from '../_common/getPopularPost';

const POST_DISPLAY_LIMIT = 20;

const posts = getPostsListJson();

export const getData = () => {
  const popularPosts = getPopularPost(posts, POST_DISPLAY_LIMIT);

  return {
    popularPosts,
  };
};
