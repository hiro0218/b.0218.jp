import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { FILENAME_POSTS } from '@/constants';
import type { Post } from '@/types/source';
import { BUILD_PATHS } from './paths';

/**
 * dist/posts/ ディレクトリから全記事データを読み込む
 * @returns 日付降順にソートされた記事配列
 */
export function readAllPosts(): Post[] {
  const postsDir = path.join(BUILD_PATHS.dist, FILENAME_POSTS);
  const files = readdirSync(postsDir).filter((f) => f.endsWith('.json'));

  return files
    .map((f) => JSON.parse(readFileSync(path.join(postsDir, f), 'utf-8')) as Post)
    .sort((a, b) => b.date.localeCompare(a.date));
}
