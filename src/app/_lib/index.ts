import { getFilteredPosts } from '@/app/_lib/getFilteredPosts';
import { getPopularPost } from '@/app/_lib/getPopularPost';
import { getRecentAndUpdatedPosts } from '@/app/_lib/getRecentAndUpdatedPosts';
import { getTagsWithCount } from '@/lib/data/posts';

import { IGNORE_TAGS, POPULAR_POST_DISPLAY_LIMIT } from './constants';

const tagsWithCount = getTagsWithCount();

export const getData = () => {
  const filteredPosts = getFilteredPosts();
  const { recentPosts, updatesPosts } = getRecentAndUpdatedPosts({ posts: filteredPosts });
  const popularPosts = getPopularPost(filteredPosts, POPULAR_POST_DISPLAY_LIMIT);

  const tags = tagsWithCount.filter(({ slug, count }) => !IGNORE_TAGS.has(slug) && count >= 10).slice(0, 25);

  return {
    recentPosts,
    updatesPosts,
    popularPosts,
    tags,
  };
};
