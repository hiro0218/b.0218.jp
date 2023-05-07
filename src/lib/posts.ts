import { readJsonSync } from 'fs-extra';
import { join } from 'path';

import {
  FILENAME_PAGES,
  FILENAME_POSTS,
  FILENAME_POSTS_LIST,
  FILENAME_POSTS_SIMILARITY,
  FILENAME_TAG_SIMILARITY,
} from '@/constant';
import { Page, Post, PostSimilar, TagSimilar, TagsList } from '@/types/source';

type PostList = Partial<Pick<Post, 'title' | 'slug' | 'date' | 'updated' | 'excerpt' | 'tags'>>;

const cache = {
  [`${FILENAME_PAGES}`]: null,
  [`${FILENAME_POSTS}`]: null,
  [`${FILENAME_POSTS_LIST}`]: null,
  [`${FILENAME_TAG_SIMILARITY}`]: null,
};

const getJson = <T>(filename: string): T => {
  const path = join(process.cwd(), `dist/${filename}.json`);

  // キャッシュにデータが存在する場合はキャッシュから取得する
  if (cache[filename]) {
    return cache[filename] as T;
  }

  // ファイルを読み込む
  const data = readJsonSync(path) as T;

  // キャッシュにデータを保存する
  cache[filename] = data;

  return data;
};

export const getTagsJson = (): TagsList => {
  return getJson<TagsList>('tags');
};

export const getPostsJson = (): Post[] => {
  return getJson<Post[]>(FILENAME_POSTS);
};

export const getPostsListJson = (): PostList[] => {
  return getJson<PostList[]>(FILENAME_POSTS_LIST);
};

export const getPagesJson = (): Page[] => {
  return getJson<Page[]>(FILENAME_PAGES);
};

export const getTagsWithCount = (): [string, number][] => {
  return Object.entries(getTagsJson())
    .map(([key, val]) => {
      return [key, val.length] as [string, number];
    })
    .sort((a, b) => b[1] - a[1]); // 件数の多い順にソート
};

export const getTagSimilar = (): TagSimilar => {
  return getJson<TagSimilar>(FILENAME_TAG_SIMILARITY);
};

export const getPostSimilar = (): PostSimilar => {
  return getJson<PostSimilar>(FILENAME_POSTS_SIMILARITY);
};
