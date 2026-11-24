/**
 * ビルドプロセスで使用する共通パス定義
 * @description
 * ビルドスクリプト全体で一貫したパス参照を提供する
 */
import path from 'node:path';
import { FILENAME_POSTS } from '@/constants';

const ROOT = process.cwd();

export const BUILD_PATHS = {
  dist: path.join(ROOT, 'dist'),
  distPosts: path.join(ROOT, 'dist', FILENAME_POSTS),
  /** Git submodule（読み取り専用） */
  article: path.join(ROOT, '_article'),
  posts: path.join(ROOT, '_article', '_posts'),
  articleImages: path.join(ROOT, '_article', 'images'),
  publicImages: path.join(ROOT, 'public', 'images'),
  ogpImages: path.join(ROOT, 'public', 'images', 'ogp'),
  activitiesJson: path.join(ROOT, '_article', 'activities.json'),
  cache: path.join(ROOT, 'node_modules', '.cache'),
} as const;
