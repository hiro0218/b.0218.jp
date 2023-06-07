import { getPostsListJson, getTagsWithCount } from '@/lib/posts';

const POST_DISPLAY_LIMIT = 5;

const posts = getPostsListJson();
const tagsWithCount = getTagsWithCount();

export const getData = () => {
  const recentPosts = posts.slice(0, POST_DISPLAY_LIMIT);
  const recentSlugs = new Set(recentPosts.map(({ slug }) => slug));
  const updatesPosts = posts
    .sort((a, b) => (a.updated < b.updated ? 1 : -1))
    .filter((post) => post.updated && post.date < post.updated && !recentSlugs.has(post.slug))
    .slice(0, POST_DISPLAY_LIMIT);

  const tags = tagsWithCount
    .filter((item, i) => item[1] >= 10 && i < 25) // 件数が10件以上を25個抽出
    .map(([slug, count]) => ({ slug, count }));

  return {
    recentPosts,
    updatesPosts,
    tags,
  };
};
