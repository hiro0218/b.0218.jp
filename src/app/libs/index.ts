import { getFilteredPosts } from '@/app/libs/getFilteredPosts';
import { getPopularPost } from '@/app/libs/getPopularPost';
import { getRecentAndUpdatedPosts } from '@/app/libs/getRecentAndUpdatedPosts';
import { getTagsWithCount } from '@/lib/posts';

import { IGNORE_TAGS, POPULAR_POST_DISPLAY_LIMIT } from './constant';

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
