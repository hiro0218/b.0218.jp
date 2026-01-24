import { isPostArray, isPostSummaryArray } from '@/lib/guards';
import type {
  Page,
  Post,
  PostPopularityScores,
  PostSimilarityMatrix,
  PostSummary,
  TagCounts,
  TagIndex,
  TagSimilarityScores,
} from '@/types/source';
import pagesData from '~/dist/pages.json';
import postsData from '~/dist/posts.json';
import postsListData from '~/dist/posts-list.json';
import postsPopularData from '~/dist/posts-popular.json';
import postsSimilarityData from '~/dist/posts-similarity.json';
import tagsData from '~/dist/tags.json';
import tagsSimilarityData from '~/dist/tags-similarity.json';
import tagsWithCountData from '~/dist/tags-with-count.json';

// JSONデータの型検証と初期化
const validatePostsData = (): Post[] => {
  if (process.env.NODE_ENV !== 'production') {
    if (!isPostArray(postsData)) {
      console.error('[posts.ts] Invalid posts data structure from dist/posts.json');
      return [];
    }
  }

  return postsData as Post[];
};

const validatePostsListData = (): PostSummary[] => {
  if (process.env.NODE_ENV !== 'production') {
    if (!isPostSummaryArray(postsListData)) {
      console.error('[posts.ts] Invalid posts list data structure from dist/posts-list.json');
      return [];
    }
  }

  return postsListData as PostSummary[];
};

const posts = validatePostsData();
const postsList = validatePostsListData();
const pages = pagesData as Page[];
const postsPopular = postsPopularData as PostPopularityScores;
const postsSimilarity = postsSimilarityData as PostSimilarityMatrix;
const tags = tagsData as TagIndex;
const tagsSimilarity = tagsSimilarityData as TagSimilarityScores;
const tagsWithCount = tagsWithCountData as TagCounts[];

/** タグデータを取得 */
export const getTagsJson = (): TagIndex => tags;

/** 全記事データを取得 */
export const getPostsJson = (): Post[] => posts;

/** 記事リスト（サマリー）を取得 */
export const getPostsListJson = (): PostSummary[] => postsList;

/** ページデータを取得 */
export const getPagesJson = (): Page[] => pages;

/** タグとカウントデータを取得 */
export const getTagsWithCount = (): TagCounts[] => tagsWithCount;

/** タグ類似度データを取得 */
export const getSimilarTag = (): TagSimilarityScores => tagsSimilarity;

/** 記事類似度データを取得 */
export const getSimilarPosts = (): PostSimilarityMatrix => postsSimilarity;

/** 人気記事データを取得 */
export const getPostsPopular = (): PostPopularityScores => postsPopular;
