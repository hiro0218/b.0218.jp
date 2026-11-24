import { readFile, unlink } from 'node:fs/promises';
import { loadEnvConfig } from '@next/env';
import type { Activities, Post } from '@/types/source';
import { writeDist } from '~/build/shared/dist';
import * as Log from '~/build/shared/logger';
import { BUILD_PATHS } from '~/build/shared/paths';
import { copyDir } from './copyDir';
import { buildPage } from './page';
import { buildPost } from './post';
import { buildTerm } from './term';
import { toPostSummary } from './toPostSummary';

loadEnvConfig(BUILD_PATHS.root);

async function buildPostList(posts: Post[]): Promise<void> {
  await writeDist('posts-list', toPostSummary(posts));
  Log.info('Write dist/posts-list.json');
}

async function copyFiles(): Promise<void> {
  await copyDir(BUILD_PATHS.articleImages, BUILD_PATHS.publicImages);
  Log.info('Copy _article/images -> public/images');
}

async function writeActivitiesJson(): Promise<void> {
  const activities = JSON.parse(await readFile(BUILD_PATHS.activitiesJson, 'utf8')) as Activities;
  await writeDist('activities', activities);
  Log.info('Write dist/activities.json');
}

async function removeLegacyArticleArtifacts(): Promise<void> {
  await unlink(`${BUILD_PATHS.dist}/uniqueChars.ts`).catch(() => undefined);
}

(async () => {
  const posts = await buildPost();
  await Promise.all([
    buildTerm(posts),
    buildPostList(posts),
    buildPage(),
    copyFiles(),
    writeActivitiesJson(),
    removeLegacyArticleArtifacts(),
  ]);
})();
