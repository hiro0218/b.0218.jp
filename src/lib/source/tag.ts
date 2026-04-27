import type { TagCounts, TagIndex } from '@/types/source';
import tagsData from '~/dist/tags.json';
import tagsWithCountData from '~/dist/tags-with-count.json';
import { createEagerSource } from './internal/eagerSource';

function isTagIndex(value: unknown): value is TagIndex {
  if (typeof value !== 'object' || value === null) return false;
  return Object.values(value).every((v) => Array.isArray(v) && v.every((s) => typeof s === 'string'));
}

function isTagCountsArray(value: unknown): value is TagCounts[] {
  if (!Array.isArray(value)) return false;
  return value.every(
    (item) =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as TagCounts).slug === 'string' &&
      typeof (item as TagCounts).count === 'number',
  );
}

const tagsSource = createEagerSource<TagIndex>({
  data: tagsData,
  validate: isTagIndex,
  label: 'tags',
});

const tagsWithCountSource = createEagerSource<TagCounts[]>({
  data: tagsWithCountData,
  validate: isTagCountsArray,
  label: 'tags-with-count',
});

/** タグ名 → 該当 Post の slug 配列の TagIndex を取得する。 */
export function getTagsJson(): TagIndex {
  return tagsSource.get();
}

/** TagCounts (display name + count) の配列を取得する。 */
export function getTagsWithCount(): TagCounts[] {
  return tagsWithCountSource.get();
}
