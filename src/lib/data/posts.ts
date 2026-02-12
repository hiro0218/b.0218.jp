import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { FILENAME_POSTS } from '@/constants';
import { isPost, isPostSummaryArray } from '@/lib/guards';
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
import postsListData from '~/dist/posts-list.json';
import postsPopularData from '~/dist/posts-popular.json';
import postsSimilarityData from '~/dist/posts-similarity.json';
import tagsData from '~/dist/tags.json';
import tagsSimilarityData from '~/dist/tags-similarity.json';
import tagsWithCountData from '~/dist/tags-with-count.json';

const POSTS_DIR = path.join(process.cwd(), 'dist', FILENAME_POSTS);

// JSONデータの型検証と初期化
const validatePostsListData = (): PostSummary[] => {
  if (process.env.NODE_ENV !== 'production') {
    if (!isPostSummaryArray(postsListData)) {
      console.error('[posts.ts] Invalid posts list data structure from dist/posts-list.json');
      return [];
    }
  }

  return postsListData as PostSummary[];
};

const postsList = validatePostsListData();
const pages = pagesData as Page[];
const postsPopular = postsPopularData as PostPopularityScores;
const postsSimilarity = postsSimilarityData as PostSimilarityMatrix;
const tags = tagsData as TagIndex;
const tagsSimilarity = tagsSimilarityData as TagSimilarityScores;
const tagsWithCount = tagsWithCountData as TagCounts[];

/**
 * 個別記事データをslugで取得
 * @param slug - 記事のスラッグ
 * @returns 記事データ。該当なしの場合はnull
 * @throws JSONパースエラーやENOENT以外のI/Oエラー時
 */
const VALID_SLUG_PATTERN = /^[\w-]+$/;

export const getPostBySlug = (slug: string): Post | null => {
  if (!VALID_SLUG_PATTERN.test(slug)) {
    return null;
  }

  const filePath = path.join(POSTS_DIR, `${slug}.json`);

  let data: string;
  try {
    data = readFileSync(filePath, 'utf-8');
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }

  const post = JSON.parse(data) as Post;

  if (process.env.NODE_ENV !== 'production' && !isPost(post)) {
    throw new Error(`[posts.ts] Invalid post data structure for slug: ${slug}`);
  }

  return post;
};

/**
 * 全記事データを取得（個別ファイルから集約）
 * @remarks 全件読み込みが必要なケース（フォントサブセット生成等）でのみ使用する
 */
let cachedAllPosts: Post[] | null = null;
export const getPostsJson = (): Post[] => {
  if (cachedAllPosts) return cachedAllPosts;

  const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith('.json'));
  cachedAllPosts = files
    .map((f) => JSON.parse(readFileSync(path.join(POSTS_DIR, f), 'utf-8')) as Post)
    .sort((a, b) => b.date.localeCompare(a.date));

  return cachedAllPosts;
};

/** タグデータを取得 */
export const getTagsJson = (): TagIndex => tags;

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
