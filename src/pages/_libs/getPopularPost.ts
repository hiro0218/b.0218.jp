import { getPostsPopular } from '@/lib/posts';
import type { PostListProps } from '@/types/source';

import { IGNORE_SLUGS } from './constant';

const popularPostsSlugs = getPostsPopular();

export const getPopularPost = (posts: PostListProps[], displayLimit: number) => {
  const postsMap = new Map(posts.map((post) => [post.slug, post]));

  // popularPostsSlugsを配列に変換し、数値が多い順にソート
  const sortedSlugs = Object.entries(popularPostsSlugs)
    .sort((a, b) => b[1] - a[1])
    .map(([slug]) => slug);

  const popularPosts = sortedSlugs
    .filter((slug) => !IGNORE_SLUGS.has(slug))
    .map((slug) => postsMap.get(slug))
    .filter((post) => post !== undefined)
    .slice(0, displayLimit);

  return popularPosts;
};
