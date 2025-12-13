import { type getPostsListJson, getPostsPopular } from '@/lib/data/posts';
import type { PostSummary } from '@/types/source';
import { IGNORE_SLUGS } from './constants';
import { getDateAndUpdatedToSimpleFormat } from './getDateAndUpdatedToSimpleFormat';

const popularPostsSlugs = getPostsPopular();
/** popularPostsSlugsを配列に変換し、数値が多い順にソート */
const sortedSlugs = Object.entries(popularPostsSlugs).map(([slug]) => slug);

const createPostsMap = (posts: ReturnType<typeof getPostsListJson>) => {
  return new Map(posts.map((post) => [post.slug, post]));
};

export const getPopularPost = (posts: ReturnType<typeof getPostsListJson>, displayLimit: number): PostSummary[] => {
  const postsMap = createPostsMap(posts);

  const popularPosts = sortedSlugs
    .filter((slug) => !IGNORE_SLUGS.has(slug))
    .map((slug) => postsMap.get(slug)) // O(1)での検索
    .filter((post) => post !== undefined)
    .map((post) => {
      const dateFormats = getDateAndUpdatedToSimpleFormat(post.date, post.updated);

      return {
        title: post.title,
        slug: post.slug,
        date: dateFormats.date,
        updated: dateFormats.updated,
        tags: post.tags,
      };
    })
    .slice(0, displayLimit);

  return popularPosts;
};
