import { getTagsWithCount } from '@/lib/posts';
import { getFilteredPosts } from '@/pages/_libs/getFilteredPosts';
import { getPopularPost } from '@/pages/_libs/getPopularPost';
import { getRecentAndUpdatedPosts } from '@/pages/_libs/getRecentAndUpdatedPosts';

import { IGNORE_TAGS, POST_DISPLAY_LIMIT } from './constant';

const tagsWithCount = getTagsWithCount();

export const getData = () => {
  const filteredPosts = getFilteredPosts();
  const { recentPosts, updatesPosts } = getRecentAndUpdatedPosts({ posts: filteredPosts });
  const popularPosts = getPopularPost(
    new Map(filteredPosts.map((post) => [post.slug, Object.freeze(post)])),
    POST_DISPLAY_LIMIT,
  );

  const tags = tagsWithCount.filter(({ slug, count }) => !IGNORE_TAGS.has(slug) && count >= 10).slice(0, 25);

  return {
    recentPosts,
    updatesPosts,
    popularPosts,
    tags,
  };
};
