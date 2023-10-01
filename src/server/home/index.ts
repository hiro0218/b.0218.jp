import { getPostsListJson, getTagsWithCount } from '@/lib/posts';

import { getPopularPost } from '../_common/getPopularPost';

const POST_DISPLAY_LIMIT = 4;
const IGNORE_TAG = '名探偵コナン';

const posts = getPostsListJson();
const tagsWithCount = getTagsWithCount();

export const getData = () => {
  // 特定のタグを除外
  const filteredPosts = posts.filter((post) => !post.tags.includes(IGNORE_TAG));

  const recentPosts = filteredPosts.slice(0, POST_DISPLAY_LIMIT);
  const recentSlugs = new Set(recentPosts.map(({ slug }) => slug));
  const updatesPosts = filteredPosts
    .filter((post) => !!post.updated && post.date < post.updated)
    .sort((a, b) => b.updated.localeCompare(a.updated))
    .filter((post) => !recentSlugs.has(post.slug))
    .slice(0, POST_DISPLAY_LIMIT);

  const popularPosts = getPopularPost(filteredPosts, POST_DISPLAY_LIMIT);
  const tags = tagsWithCount.filter((item, i) => !item.slug.includes(IGNORE_TAG) && item.count >= 10 && i < 25); // 件数が10件以上を25個抽出

  return {
    recentPosts,
    updatesPosts,
    popularPosts,
    tags,
  };
};
