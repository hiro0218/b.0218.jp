import { getDateAndUpdatedToSimpleFormat } from '@/lib/post/date';
import type { Post, PostSummary } from '@/types/source';

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
