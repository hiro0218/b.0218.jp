import type { Post, PostSummary } from '@/types/source';
import { POST_DISPLAY_LIMIT } from './constants';
import { getDateAndUpdatedToSimpleFormat } from './getDateAndUpdatedToSimpleFormat';

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

export const getRecentPosts = (posts: (PostSummary | Post)[]): PostSummary[] => {
  const recentPosts = posts.slice(0, POST_DISPLAY_LIMIT);
  return transformToFormattedSummary(recentPosts);
};
