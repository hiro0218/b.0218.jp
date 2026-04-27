import { isObject } from '@/lib/utils/isObject';
import type { TagCounts, TagIndex } from '@/types/source';
import tagsData from '~/dist/tags.json';
import tagsWithCountData from '~/dist/tags-with-count.json';
import { createEagerSource } from './internal/eagerSource';

function isTagIndex(value: unknown): value is TagIndex {
  if (!isObject(value)) return false;
  return Object.values(value).every((v) => Array.isArray(v) && v.every((s) => typeof s === 'string'));
}

function isTagCounts(value: unknown): value is TagCounts {
  return isObject(value) && typeof value.slug === 'string' && typeof value.count === 'number';
}

function isTagCountsArray(value: unknown): value is TagCounts[] {
  return Array.isArray(value) && value.every(isTagCounts);
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
