import { getPostsListJson, getTagsWithCount } from '@/lib/posts';
import { getPopularPost } from '@/pages/_libs/getPopularPost';

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
    .filter((post) => !!post.updated && post.date < post.updated && !recentSlugs.has(post.slug))
    .sort((a, b) => b.updated.localeCompare(a.updated))
    .slice(0, POST_DISPLAY_LIMIT);

  const popularPosts = getPopularPost(filteredPosts, POST_DISPLAY_LIMIT);

  const tags = tagsWithCount.filter(({ slug, count }) => !slug.includes(IGNORE_TAG) && count >= 10).slice(0, 25);

  return {
    recentPosts,
    updatesPosts,
    popularPosts,
    tags,
  };
};
