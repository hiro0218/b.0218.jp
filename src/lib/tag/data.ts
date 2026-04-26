import type { TagCategoryMap, TagCounts, TagIndex, TagSimilarityScores } from '@/types/source';
import tagCategoriesData from '~/dist/tag-categories.json';
import tagsData from '~/dist/tags.json';
import tagsSimilarityData from '~/dist/tags-similarity.json';
import tagsWithCountData from '~/dist/tags-with-count.json';

let cachedTags: TagIndex | undefined;
let cachedTagsWithCount: TagCounts[] | undefined;
let cachedTagsSimilarity: TagSimilarityScores | undefined;
let cachedTagCategories: TagCategoryMap | undefined;

/** タグデータを取得 */
export const getTagsJson = (): TagIndex => (cachedTags ??= tagsData as TagIndex);

/** タグとカウントデータを取得 */
export const getTagsWithCount = (): TagCounts[] => (cachedTagsWithCount ??= tagsWithCountData as TagCounts[]);

/** タグ類似度データを取得 */
export const getSimilarTag = (): TagSimilarityScores =>
  (cachedTagsSimilarity ??= tagsSimilarityData as TagSimilarityScores);

/** タグカテゴリマッピングを取得 */
export const getTagCategoriesJson = (): TagCategoryMap => (cachedTagCategories ??= tagCategoriesData as TagCategoryMap);
