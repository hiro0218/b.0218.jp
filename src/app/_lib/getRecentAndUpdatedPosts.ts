import type { Post, PostSummary } from '@/types/source';
import { POST_DISPLAY_LIMIT, UPDATED_POST_DISPLAY_LIMIT } from './constants';
import { getDateAndUpdatedToSimpleFormat } from './getDateAndUpdatedToSimpleFormat';

const filterPosts = (posts: (PostSummary | Post)[]): PostSummary[] => {
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

export const getRecentAndUpdatedPosts = (posts: (PostSummary | Post)[]) => {
  const recentPosts = posts.slice(0, POST_DISPLAY_LIMIT);
  const filteredRecentPosts = filterPosts(recentPosts);

  const recentSlugs = new Set(recentPosts.map(({ slug }) => slug));

  const updatesPosts = posts
    .filter((post) => !!post.updated && post.date < post.updated && !recentSlugs.has(post.slug))
    .toSorted((a, b) => b.updated.localeCompare(a.updated))
    .slice(0, UPDATED_POST_DISPLAY_LIMIT);

  const filteredUpdatedPosts = filterPosts(updatesPosts);

  return {
    recentPosts: filteredRecentPosts,
    updatesPosts: filteredUpdatedPosts,
  };
};
