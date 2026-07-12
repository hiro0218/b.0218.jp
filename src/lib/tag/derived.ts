import { createEagerSource } from '@/lib/distLoader/eagerSource';
import { isObject } from '@/lib/utils/isObject';
import type { TagCategoryMap, TagCategoryName, TagSimilarityScores } from '@/types/source';
import tagCategoriesData from '~/dist/tag-categories.json';
import tagsSimilarityData from '~/dist/tags-similarity.json';

const TAG_CATEGORY_NAMES: ReadonlySet<string> = new Set<TagCategoryName>(['development', 'technology', 'other']);

function isTagCategoryName(value: unknown): value is TagCategoryName {
  return typeof value === 'string' && TAG_CATEGORY_NAMES.has(value);
}

function isTagCategoryMap(value: unknown): value is TagCategoryMap {
  return isObject(value) && Object.values(value).every(isTagCategoryName);
}

function isScoreMap(value: unknown): value is Record<string, number> {
  return isObject(value) && Object.values(value).every((score) => typeof score === 'number');
}

function isTagSimilarityScores(value: unknown): value is TagSimilarityScores {
  return isObject(value) && Object.values(value).every(isScoreMap);
}

// 派生データは Source 対象外 (追加ドメイン規則を持たない) だが、壊れた dist を
// 検出する fail-fast の仕組み (読み込み + キャッシュ + shape 検証 + throw) は
// Source と同じ内部機構 (createEagerSource) を共有する。
const tagsSimilaritySource = createEagerSource<TagSimilarityScores>({
  data: tagsSimilarityData,
  validate: isTagSimilarityScores,
  label: 'tags-similarity',
});

const tagCategoriesSource = createEagerSource<TagCategoryMap>({
  data: tagCategoriesData,
  validate: isTagCategoryMap,
  label: 'tag-categories',
});

/** タグ間の類似度スコアを取得する。 */
export function getSimilarTag(): TagSimilarityScores {
  return tagsSimilaritySource.get();
}

/** タグ名 → カテゴリ名のマッピングを取得する。 */
export function getTagCategoriesJson(): TagCategoryMap {
  return tagCategoriesSource.get();
}
