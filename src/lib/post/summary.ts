import type { Post, PostSummary } from '@/types/source';
import { getDateAndUpdatedToSimpleFormat } from './date';

export function formatPostSummary(post: PostSummary | Post): PostSummary {
  const formattedDates = getDateAndUpdatedToSimpleFormat(post.date, post.updated);

  return {
    title: post.title,
    slug: post.slug,
    date: formattedDates.date,
    updated: formattedDates.updated,
    tags: post.tags,
  };
}
