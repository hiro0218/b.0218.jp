import { TAG_VIEW_LIMIT } from '@/constants';
import { getTagsWithCount } from '@/lib/source/tag';
import type { TagCounts } from '@/types/source';
import { tagFromUrlPath } from './url';

// getRoutableTagByRouteSlug がフィードルートから多数回呼ばれ、
// その都度全タグを再フィルタしていたためメモ化する。返却配列は呼び出し元間で共有参照になるため
// 読み取り専用で扱うこと (現状の消費は .map / .find / .flatMap のみ)。
let routableTagsCache: TagCounts[] | undefined;
export function getRoutableTags(): TagCounts[] {
  routableTagsCache ??= getTagsWithCount().filter((tag) => tag.count >= TAG_VIEW_LIMIT);
  return routableTagsCache;
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
