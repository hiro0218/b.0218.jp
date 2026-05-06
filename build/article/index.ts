import { unlink } from 'node:fs/promises';
import { loadEnvConfig } from '@next/env';
import { FILENAME_POSTS_LIST } from '@/constants';
import type { Post } from '@/types/source';
import { BUILD_PATHS } from '~/build/shared/paths';
import { copyDir, writeJSON } from '~/tools/fs';
import * as Log from '~/tools/logger';
import { buildPage, buildPost, buildTerm } from './post/generate';
import { getPath } from './post/generate/utils';
import { toPostSummary } from './post/toPostSummary';

loadEnvConfig(process.cwd());

const PATH = getPath();

async function buildPostList(posts: Post[]): Promise<void> {
  await writeJSON(`${PATH.to}/${FILENAME_POSTS_LIST}.json`, toPostSummary(posts));
  Log.info(`Write dist/${FILENAME_POSTS_LIST}.json`);
}

async function copyFiles(): Promise<void> {
  await copyDir(BUILD_PATHS.articleImages, BUILD_PATHS.publicImages);
  Log.info('Copy _article/images -> public/images');
}

async function removeLegacyArticleArtifacts(): Promise<void> {
  await unlink(`${PATH.to}/uniqueChars.ts`).catch(() => undefined);
}

(async () => {
  const posts = await buildPost();
  await Promise.all([buildTerm(posts), buildPostList(posts), buildPage(), copyFiles(), removeLegacyArticleArtifacts()]);
})();
