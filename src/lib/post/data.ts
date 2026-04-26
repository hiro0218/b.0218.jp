import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { FILENAME_POSTS } from '@/constants';
import { isProduction } from '@/lib/config/environment';
import { isPost, isPostSummaryArray } from '@/lib/guards';
import type { Post, PostPopularityScores, PostSimilarityMatrix, PostSummary } from '@/types/source';
import postsListData from '~/dist/posts-list.json';
import postsPopularData from '~/dist/posts-popular.json';
import postsSimilarityData from '~/dist/posts-similarity.json';

const POSTS_DIR = path.join(process.cwd(), 'dist', FILENAME_POSTS);
const VALID_SLUG_PATTERN = /^[\w-]+$/;

let cachedPostsList: PostSummary[] | undefined;
const cachedPostBySlug = new Map<string, Post | null>();
let cachedAllPosts: Post[] | undefined;
let cachedPostsPopular: PostPopularityScores | undefined;
let cachedPostsSimilarity: PostSimilarityMatrix | undefined;

/**
 * 個別記事データを slug で取得
 * @throws JSON パースエラーや ENOENT 以外の I/O エラー時
 */
export const getPostBySlug = (slug: string): Post | null => {
  if (!VALID_SLUG_PATTERN.test(slug)) {
    return null;
  }

  const cached = cachedPostBySlug.get(slug);
  if (cached !== undefined) return cached;

  const filePath = path.join(POSTS_DIR, `${slug}.json`);

  let data: string;
  try {
    data = readFileSync(filePath, 'utf-8');
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      cachedPostBySlug.set(slug, null);
      return null;
    }
    throw error;
  }

  const post = JSON.parse(data) as Post;

  if (!isProduction && !isPost(post)) {
    throw new Error(`[post/data] Invalid post data structure for slug: ${slug}`);
  }

  cachedPostBySlug.set(slug, post);
  return post;
};

/**
 * 全記事データを取得（個別ファイルから集約）
 * @remarks 全件読み込みが必要なケース（フォントサブセット生成等）でのみ使用する
 */
export const getPostsJson = (): Post[] => {
  if (cachedAllPosts !== undefined) return cachedAllPosts;

  const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith('.json'));
  cachedAllPosts = files
    .map((f) => JSON.parse(readFileSync(path.join(POSTS_DIR, f), 'utf-8')) as Post)
    .sort((a, b) => b.date.localeCompare(a.date));

  return cachedAllPosts;
};

/** 記事リスト（サマリー）を取得 */
export const getPostsListJson = (): PostSummary[] => {
  if (cachedPostsList === undefined) {
    if (!isProduction && !isPostSummaryArray(postsListData)) {
      console.error('[post/data] Invalid posts list data structure from dist/posts-list.json');
      cachedPostsList = [];
    } else {
      cachedPostsList = postsListData as PostSummary[];
    }
  }
  return cachedPostsList;
};

/** 記事類似度データを取得 */
export const getSimilarPosts = (): PostSimilarityMatrix =>
  (cachedPostsSimilarity ??= postsSimilarityData as PostSimilarityMatrix);

/** 人気記事データを取得 */
export const getPostsPopular = (): PostPopularityScores =>
  (cachedPostsPopular ??= postsPopularData as PostPopularityScores);
