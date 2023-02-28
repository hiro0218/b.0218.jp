import { readJsonSync } from 'fs-extra';
import { join } from 'path';

import { FILENAME_PAGES, FILENAME_POSTS, FILENAME_POSTS_LIST } from '@/constant';
import { Pages, Post } from '@/types/source';

const getPath = (filename: string) => {
  return join(process.cwd(), `dist/${filename}.json`);
};

export const getTermJson = (type: 'tags'): Record<string, string[]> => {
  const path = getPath(type);

  return readJsonSync(path);
};

export const getPostsJson = (): Post[] => {
  const path = getPath(FILENAME_POSTS);

  return readJsonSync(path);
};

export const getPostsListJson = (): Partial<
  Pick<Post, 'title' | 'slug' | 'date' | 'updated' | 'excerpt' | 'tags'>
>[] => {
  const path = getPath(FILENAME_POSTS_LIST);

  return readJsonSync(path);
};

export const getPagesJson = (): Pages[] => {
  const path = getPath(FILENAME_PAGES);

  return readJsonSync(path);
};

export const getTermWithCount = (type: 'tags'): [string, number][] => {
  return Object.entries(getTermJson(type))
    .map(([key, val]) => {
      return [key, val.length] as [string, number];
    })
    .sort((a, b) => b[1] - a[1]); // 件数の多い順にソート
};
