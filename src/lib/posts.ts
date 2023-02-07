import { readJsonSync } from 'fs-extra';
import { join } from 'path';

import { Pages, Post, TermsPostList } from '@/types/source';

const getPath = (filename: string) => {
  return join(process.cwd(), `dist/${filename}.json`);
};

export const getTermJson = (type: 'tags'): TermsPostList[] => {
  const path = getPath(type);

  return readJsonSync(path);
};

export const getPostsJson = (): Post[] => {
  const path = getPath('posts');

  return readJsonSync(path);
};

export const getPostsListJson = (): Partial<
  Pick<Post, 'title' | 'slug' | 'date' | 'updated' | 'excerpt' | 'tags'>
>[] => {
  const path = getPath('posts-list');

  return readJsonSync(path);
};

export const getPagesJson = (): Pages[] => {
  const path = getPath('pages');

  return readJsonSync(path);
};

export const getTermWithCount = (type: 'tags'): [string, number][] => {
  return Object.entries(getTermJson(type))
    .map(([key, val]) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return [key, val.length] as [string, number];
    })
    .sort((a, b) => b[1] - a[1]); // 件数の多い順にソート
};
