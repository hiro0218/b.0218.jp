import { getPostsPopular } from '@/lib/posts';
import type { PostListProps } from '@/types/source';

const IGNORE_SLUGS = new Set(['20141105125846', '20171223014544']);
const popularPostsSlugs = getPostsPopular();

export const getPopularPost = (posts: PostListProps[], displayLimit: number) => {
  const postsMap = new Map(posts.map((post) => [post.slug, post]));

  const popularPosts = Object.keys(popularPostsSlugs)
    .filter((slug) => !IGNORE_SLUGS.has(slug))
    .map((slug) => postsMap.get(slug))
    .filter((post) => post !== undefined)
    .slice(0, displayLimit);

  return popularPosts;
};
