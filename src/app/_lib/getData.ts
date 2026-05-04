import { TAG_VIEW_LIMIT } from '@/constants';
import { getFilteredPosts, getPopularPost, isIgnoredPostTag, recentPosts } from '@/lib/post/list';
import { getTagsWithCount } from '@/lib/source/tag';

const POPULAR_POST_DISPLAY_LIMIT = 6;

const tagsWithCount = getTagsWithCount();
const filteredPosts = getFilteredPosts();
const popularPosts = getPopularPost(filteredPosts, POPULAR_POST_DISPLAY_LIMIT);
const tags = tagsWithCount
  .filter(({ slug, count }) => !isIgnoredPostTag(slug) && count >= 10)
  .slice(0, 25)
  .map((tag) => ({ ...tag, isNavigable: tag.count >= TAG_VIEW_LIMIT }));

export const getData = () => {
  return {
    recentPosts,
    popularPosts,
    tags,
  };
};
