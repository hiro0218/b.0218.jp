import { type getPostsListJson, getPostsPopular } from '@/lib/posts';

import { IGNORE_SLUGS } from './constant';

const popularPostsSlugs = getPostsPopular();

export const getPopularPost = (posts: ReturnType<typeof getPostsListJson>, displayLimit: number) => {
  // popularPostsSlugsを配列に変換し、数値が多い順にソート
  const sortedSlugs = Object.entries(popularPostsSlugs).map(([slug]) => slug);

  const popularPosts = sortedSlugs
    .filter((slug) => !IGNORE_SLUGS.has(slug))
    .map((slug) => {
      // posts から slug に一致するものを取得
      return posts.find((post) => post.slug === slug);
    })
    .filter((post) => post !== undefined)
    .slice(0, displayLimit);

  return popularPosts;
};
