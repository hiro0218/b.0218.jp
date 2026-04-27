import path from 'node:path';
import { FILENAME_POSTS } from '@/constants';
import { isPost, isPostSummaryArray } from '@/lib/guards';
import type { Post, PostSummary } from '@/types/source';
import postsListData from '~/dist/posts-list.json';
import { createEagerSource } from './internal/eagerSource';
import { createLazyLoader } from './internal/lazyLoader';

const VALID_SLUG_PATTERN = /^[\w-]+$/;
const POSTS_DIR = path.join(process.cwd(), 'dist', FILENAME_POSTS);

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
