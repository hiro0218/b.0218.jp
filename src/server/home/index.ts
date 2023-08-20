import { getPostsListJson, getTagsWithCount } from '@/lib/posts';

import { getPopularPost } from '../_common/getPopularPost';

const POST_DISPLAY_LIMIT = 4;

const posts = getPostsListJson();
const tagsWithCount = getTagsWithCount();

export const getData = () => {
  const popularPosts = getPopularPost(posts, POST_DISPLAY_LIMIT);
  const recentPosts = posts.slice(0, POST_DISPLAY_LIMIT);
  const recentSlugs = new Set(recentPosts.map(({ slug }) => slug));
  const updatesPosts = posts
    .sort((a, b) => (a.updated < b.updated ? 1 : -1))
    .filter((post) => post.updated && post.date < post.updated && !recentSlugs.has(post.slug))
    .slice(0, POST_DISPLAY_LIMIT);

  const tags = tagsWithCount.filter((item, i) => item.count >= 10 && i < 25); // 件数が10件以上を25個抽出

  return {
    recentPosts,
    updatesPosts,
    popularPosts,
    tags,
  };
};
