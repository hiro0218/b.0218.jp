import type { PostListProps } from '@/types/source';

import { POST_DISPLAY_LIMIT } from './constant';

type Props = {
  posts: PostListProps[];
};

const cache = new Map<string, { recentPosts: PostListProps[]; updatesPosts: PostListProps[] }>();
const CACHE_KEY = 'RECENT_AND_UPDATED_POSTS_CACHE';

export const getRecentAndUpdatedPosts = ({ posts }: Props) => {
  if (cache.has(CACHE_KEY)) {
    return cache.get(CACHE_KEY)!;
  }

  const recentPosts = posts.slice(0, POST_DISPLAY_LIMIT);
  const recentSlugs = new Set(recentPosts.map(({ slug }) => slug));
  const updatesPosts = posts
    .filter((post) => !!post.updated && post.date < post.updated && !recentSlugs.has(post.slug))
    .sort((a, b) => b.updated.localeCompare(a.updated))
    .slice(0, POST_DISPLAY_LIMIT);

  cache.set(CACHE_KEY, { recentPosts, updatesPosts });

  return {
    recentPosts,
    updatesPosts,
  };
};
