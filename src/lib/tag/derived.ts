import type { TagCategoryMap, TagSimilarityScores } from '@/types/source';
import tagCategoriesData from '~/dist/tag-categories.json';
import tagsSimilarityData from '~/dist/tags-similarity.json';

let cachedTagsSimilarity: TagSimilarityScores | undefined;
let cachedTagCategories: TagCategoryMap | undefined;

export const getSimilarTag = (): TagSimilarityScores =>
  (cachedTagsSimilarity ??= tagsSimilarityData as TagSimilarityScores);

export const getTagCategoriesJson = (): TagCategoryMap => (cachedTagCategories ??= tagCategoriesData as TagCategoryMap);
