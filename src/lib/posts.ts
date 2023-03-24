import { readJsonSync } from 'fs-extra';
import { join } from 'path';

import { FILENAME_PAGES, FILENAME_POSTS, FILENAME_POSTS_LIST } from '@/constant';
import { Pages, Post } from '@/types/source';

type PostList = Partial<Pick<Post, 'title' | 'slug' | 'date' | 'updated' | 'excerpt' | 'tags'>>;

const getJson = <T>(filename: string): T => {
  const path = join(process.cwd(), `dist/${filename}.json`);

  return readJsonSync(path) as T;
};

export const getTagsJson = (): Record<string, string[]> => {
  return getJson<Record<string, string[]>>('tags');
};

export const getPostsJson = (): Post[] => {
  return getJson<Post[]>(FILENAME_POSTS);
};

export const getPostsListJson = (): PostList[] => {
  return getJson<PostList[]>(FILENAME_POSTS_LIST);
};

export const getPagesJson = (): Pages[] => {
  return getJson<Pages[]>(FILENAME_PAGES);
};

export const getTagsWithCount = (): [string, number][] => {
  return Object.entries(getTagsJson())
    .map(([key, val]) => {
      return [key, val.length] as [string, number];
    })
    .sort((a, b) => b[1] - a[1]); // 件数の多い順にソート
};
