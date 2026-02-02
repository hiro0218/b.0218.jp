import { loadEnvConfig } from '@next/env';
import { FILENAME_POSTS_LIST } from '@/constants';
import type { Post } from '@/types/source';
import { BUILD_PATHS } from '~/build/shared/paths';
import { copyDir, writeJSON } from '~/tools/fs';
import * as Log from '~/tools/logger';
import { buildPage, buildPost, buildTerm } from './post/generate';
import { getPath } from './post/generate/utils';
import { removePostsData } from './post/removePostData';

loadEnvConfig(process.cwd());

const PATH = getPath();

async function buildPostList(posts: Partial<Post>[]) {
  await writeJSON(`${PATH.to}/${FILENAME_POSTS_LIST}.json`, removePostsData(posts)).then(() => {
    Log.info(`Write dist/${FILENAME_POSTS_LIST}.json`);
  });
}

async function copyFiles() {
  copyDir(BUILD_PATHS.articleImages, BUILD_PATHS.publicImages).then(() => {
    Log.info('Copy _article/images -> public/images');
  });
}

(async () => {
  const posts = await buildPost();
  await buildTerm(posts);
  await buildPostList(posts);
  await buildPage();
  await copyFiles();
})();
