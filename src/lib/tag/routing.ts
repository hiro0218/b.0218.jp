import { TAG_VIEW_LIMIT } from '@/constants';
import { getTagsWithCount } from '@/lib/source/tag';
import type { TagCounts } from '@/types/source';
import { tagFromUrlPath } from './url';

export function getRoutableTags(): TagCounts[] {
  return getTagsWithCount().filter((tag) => tag.count >= TAG_VIEW_LIMIT);
}

export function getRoutableTagStaticParams(): { slug: string }[] {
  return getRoutableTags().map((tag) => ({
    slug: tag.slug,
  }));
}

export function getRoutableTagByRouteSlug(routeSlug: string): TagCounts | null {
  const decodedSlug = tagFromUrlPath(routeSlug);

  return getRoutableTags().find((tag) => tag.slug === decodedSlug) ?? null;
}
