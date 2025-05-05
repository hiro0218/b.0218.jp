import { loadEnvConfig } from '@next/env';
import { FILENAME_POSTS_LIST } from '@/constant';
import { copyDir, copyFile, writeJSON } from '@/shared/fs';
import * as Log from '@/shared/Log';
import type { PostProps } from '@/types/source';
import { buildPage, buildPost, buildTerm } from './post/generate';
import { getPath } from './post/generate/utils';
import { removePostsData } from './post/removePostData';

loadEnvConfig(process.cwd());

const PATH = getPath();

async function buildPostList(posts: Partial<PostProps>[]) {
  await writeJSON(`${PATH.to}/${FILENAME_POSTS_LIST}.json`, removePostsData(posts)).then(() => {
    Log.info(`Write dist/${FILENAME_POSTS_LIST}.json`);
  });
}

async function copyFiles() {
  copyFile(`${PATH.to}/${FILENAME_POSTS_LIST}.json`, `${process.cwd()}/public/${FILENAME_POSTS_LIST}.json`).then(() => {
    Log.info(`Copy dist/${FILENAME_POSTS_LIST}.json -> public`);
  });
  copyDir(`${process.cwd()}/_article/images`, `${process.cwd()}/public/images`).then(() => {
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
