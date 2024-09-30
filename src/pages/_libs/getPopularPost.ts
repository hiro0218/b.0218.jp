import { type getPostsListJson, getPostsPopular } from '@/lib/posts';

import { IGNORE_SLUGS } from './constant';

const popularPostsSlugs = getPostsPopular();

export const getPopularPost = (posts: ReturnType<typeof getPostsListJson>, displayLimit: number) => {
  // popularPostsSlugsを配列に変換し、数値が多い順にソート
  const sortedSlugs = Object.entries(popularPostsSlugs)
    .sort((a, b) => b[1] - a[1])
    .map(([slug]) => slug);

  const popularPosts = sortedSlugs
    .filter((slug) => !IGNORE_SLUGS.has(slug))
    .map((slug) => posts.get(slug))
    .filter((post) => post !== undefined)
    .slice(0, displayLimit);

  return popularPosts;
};
