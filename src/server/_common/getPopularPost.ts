import { getPostsPopular } from '@/lib/posts';
import type { PostListProps } from '@/types/source';

const IGNORE_SLUGS = ['20141105125846', '20171223014544'];
const popularPostsSlugs = getPostsPopular();

export const getPopularPost = (posts: PostListProps[], displayLimit: number) => {
  const popularPosts = Object.keys(popularPostsSlugs)
    .filter((slug) => !IGNORE_SLUGS.includes(slug))
    .map((slug) => posts.find((post) => post.slug === slug))
    .filter(Boolean)
    .slice(0, displayLimit);

  return popularPosts;
};
