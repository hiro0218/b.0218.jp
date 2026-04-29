import path from 'node:path';
import { FILENAME_POSTS } from '@/constants';
import { isObject } from '@/lib/utils/isObject';
import { isStringArray } from '@/lib/utils/isStringArray';
import type { Post, PostSummary } from '@/types/source';
import postsListData from '~/dist/posts-list.json';
import { createEagerSource } from './internal/eagerSource';
import { createLazyLoader } from './internal/lazyLoader';

const VALID_SLUG_PATTERN = /^[\w-]+$/;
const POSTS_DIR = path.join(process.cwd(), 'dist', FILENAME_POSTS);

function isPost(value: unknown): value is Post {
  if (!isObject(value)) return false;
  return (
    typeof value.title === 'string' &&
    typeof value.slug === 'string' &&
    typeof value.date === 'string' &&
    typeof value.content === 'string' &&
    isStringArray(value.tags) &&
    (value.updated === undefined || typeof value.updated === 'string') &&
    (value.note === undefined || typeof value.note === 'string') &&
    (value.noindex === undefined || typeof value.noindex === 'boolean')
  );
}

function isPostSummary(value: unknown): value is PostSummary {
  if (!isObject(value)) return false;
  return (
    typeof value.title === 'string' &&
    typeof value.slug === 'string' &&
    typeof value.date === 'string' &&
    isStringArray(value.tags) &&
    (value.updated === undefined || typeof value.updated === 'string')
  );
}

function isPostSummaryArray(value: unknown): value is PostSummary[] {
  return Array.isArray(value) && value.every(isPostSummary);
}

const postLoader = createLazyLoader<Post>({
  baseDir: POSTS_DIR,
  validate: isPost,
  label: 'post',
});

const postsListSource = createEagerSource<PostSummary[]>({
  data: postsListData,
  validate: isPostSummaryArray,
  label: 'posts-list',
});

/**
 * slug から Post を取得する。
 * slug が URL-safe パターンに合わない、もしくは対応するファイルが無い場合は null。
 * 検証失敗 (壊れた dist) は throw する。
 */
export function getPostBySlug(slug: string): Post | null {
  if (!VALID_SLUG_PATTERN.test(slug)) {
    return null;
  }
  return postLoader.load(`${slug}.json`);
}

/** PostList (date 降順の PostSummary[]) を取得する。 */
export function getPostsListJson(): PostSummary[] {
  return postsListSource.get();
}
