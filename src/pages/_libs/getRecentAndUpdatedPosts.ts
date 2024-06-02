import type { PostListProps } from '@/types/source';

import { POST_DISPLAY_LIMIT } from './constant';

type Props = {
  filteredPosts: PostListProps[];
};

export const getRecentAndUpdatedPosts = ({ filteredPosts }: Props) => {
  const recentPosts = filteredPosts.slice(0, POST_DISPLAY_LIMIT);
  const recentSlugs = new Set(recentPosts.map(({ slug }) => slug));
  const updatesPosts = filteredPosts
    .filter((post) => !!post.updated && post.date < post.updated && !recentSlugs.has(post.slug))
    .sort((a, b) => b.updated.localeCompare(a.updated))
    .slice(0, POST_DISPLAY_LIMIT);

  return {
    recentPosts,
    updatesPosts,
  };
};
