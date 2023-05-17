import { readJsonSync } from 'fs-extra';
import { join } from 'path';

import {
  FILENAME_PAGES,
  FILENAME_POSTS,
  FILENAME_POSTS_LIST,
  FILENAME_POSTS_SIMILARITY,
  FILENAME_TAG_SIMILARITY,
} from '@/constant';
import { Page, Post, PostList, PostSimilarProps, TagSimilarProps, TagsList } from '@/types/source';

type CacheValues = Page[] | Post[] | PostList[] | PostSimilarProps | TagSimilarProps | TagsList;

const cache: Record<string, null | CacheValues> = {
  [FILENAME_PAGES]: null,
  [FILENAME_POSTS]: null,
  [FILENAME_POSTS_LIST]: null,
  [FILENAME_TAG_SIMILARITY]: null,
  [FILENAME_POSTS_SIMILARITY]: null,
  tags: null,
};

const getJson = <T extends CacheValues>(
  filename:
    | typeof FILENAME_PAGES
    | typeof FILENAME_POSTS
    | typeof FILENAME_POSTS_LIST
    | typeof FILENAME_TAG_SIMILARITY
    | typeof FILENAME_POSTS_SIMILARITY
    | 'tags',
): T => {
  const path = join(process.cwd(), `dist/${filename}.json`);

  // キャッシュにデータが存在する場合はキャッシュから取得する
  if (cache[filename] !== null) {
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

export const getSimilarTag = (): TagSimilarProps => {
  return getJson<TagSimilarProps>(FILENAME_TAG_SIMILARITY);
};

export const getSimilarPost = (): PostSimilarProps => {
  return getJson<PostSimilarProps>(FILENAME_POSTS_SIMILARITY);
};
