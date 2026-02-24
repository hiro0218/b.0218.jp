import { recentPosts, updatesPosts } from '@/app/_lib/cachedRecentPosts';
import { getFilteredPosts } from '@/app/_lib/getFilteredPosts';
import { getPopularPost } from '@/app/_lib/getPopularPost';
import { TAG_VIEW_LIMIT } from '@/constants';
import { getTagsWithCount } from '@/lib/data/posts';

import { IGNORE_TAGS, POPULAR_POST_DISPLAY_LIMIT } from './constants';

const tagsWithCount = getTagsWithCount();
const filteredPosts = getFilteredPosts();
const popularPosts = getPopularPost(filteredPosts, POPULAR_POST_DISPLAY_LIMIT);
const tags = tagsWithCount
  .filter(({ slug, count }) => !IGNORE_TAGS.has(slug) && count >= 10)
  .slice(0, 25)
  .map((tag) => ({ ...tag, isNavigable: tag.count >= TAG_VIEW_LIMIT }));

export const getData = () => {
  return {
    recentPosts,
    updatesPosts,
    popularPosts,
    tags,
  };
};
