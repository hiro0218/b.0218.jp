import { getPostsListJson } from '@/lib/posts';
import { getPopularPost } from '@/pages/_libs/getPopularPost';

const POST_DISPLAY_LIMIT = 20;

const postsMap = getPostsListJson();

export const getData = () => {
  const posts = Array.from(postsMap.values());
  const popularPosts = getPopularPost(posts, POST_DISPLAY_LIMIT);

  return {
    popularPosts,
  };
};
