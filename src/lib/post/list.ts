import { getPostsPopular } from '@/lib/post/derived';
import { getPostsListJson } from '@/lib/source/post';
import type { Post, PostSummary } from '@/types/source';
import { getDateAndUpdatedToSimpleFormat } from './date';

const RECENT_POST_DISPLAY_LIMIT = 6;
const IGNORED_POPULAR_POST_SLUGS = new Set(['20141105125846', '20171223014544']);
const IGNORED_POST_TAGS = new Set(['名探偵コナン']);

const posts = getPostsListJson();
const popularPostsSlugs = getPostsPopular();
const sortedPopularSlugs = Object.entries(popularPostsSlugs)
  .sort(([, a], [, b]) => b.total - a.total)
  .map(([slug]) => slug);

const createPostsMap = (posts: ReturnType<typeof getPostsListJson>) => {
  return new Map(posts.map((post) => [post.slug, post]));
};

const transformToFormattedSummary = (posts: (PostSummary | Post)[]): PostSummary[] => {
  return posts.map((post) => {
    const dateFormats = getDateAndUpdatedToSimpleFormat(post.date, post.updated);
    return {
      title: post.title,
      slug: post.slug,
      date: dateFormats.date,
      updated: dateFormats.updated,
      tags: post.tags,
    };
  });
};

export const isIgnoredPostTag = (tag: string): boolean => {
  return IGNORED_POST_TAGS.has(tag);
};

export const getFilteredPosts = (): PostSummary[] => {
  return posts.filter((post) => !post.tags.some(isIgnoredPostTag));
};

export const getRecentPosts = (posts: (PostSummary | Post)[]): PostSummary[] => {
  return transformToFormattedSummary(posts.slice(0, RECENT_POST_DISPLAY_LIMIT));
};

export const getPopularPost = (posts: ReturnType<typeof getPostsListJson>, displayLimit: number): PostSummary[] => {
  const postsMap = createPostsMap(posts);

  return sortedPopularSlugs
    .filter((slug) => !IGNORED_POPULAR_POST_SLUGS.has(slug))
    .map((slug) => postsMap.get(slug))
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
};

export const recentPosts = getRecentPosts(getFilteredPosts());
