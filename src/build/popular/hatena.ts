import { readJSONSync } from 'fs-extra';

import { SITE_URL } from '@/constant';

const PATH_DIST = `${process.cwd()}/dist`;
const HATENA_API_URL = 'https://bookmark.hatenaapis.com/count/entries';
const MAX_URLS = 50;

const postList = readJSONSync(`${PATH_DIST}/posts-list.json`);

/**
 * URLをチャンクに分割する
 */
function chunkUrls(urls: string[], max: number): string[][] {
  return urls.reduce<string[][]>((acc, url, index) => {
    const chunkIndex = Math.floor(index / max);
    if (!acc[chunkIndex]) {
      acc[chunkIndex] = [];
    }
    acc[chunkIndex].push(url);
    return acc;
  }, []);
}

/**
 * HatenaのAPI URLを作成
 */
function createHatenaApiUrls(chunkedUrls: string[][]): string[] {
  return chunkedUrls.map((chunkedUrl) => `${HATENA_API_URL}?url=${chunkedUrl.join('&url=')}`);
}

/**
 * SlugからURLを変換し、ブックマークの数をキーとしてソート
 */
function sortResultsByBookmarkCount(result: Record<string, number>): Record<string, number> {
  return Object.entries(result)
    .sort(([, a], [, b]) => b - a)
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
}

export const run = async () => {
  const urls = postList.map((post) => `${SITE_URL}/${post.slug}.html`);
  const chunkedUrls = chunkUrls(urls, MAX_URLS);
  const hatenaApiUrls = createHatenaApiUrls(chunkedUrls);

  let hatenaApiResult = {};

  await Promise.all(
    hatenaApiUrls.map(async (url) => {
      const res = await fetch(url);
      const json = (await res.json()) as Record<string, number>;
      hatenaApiResult = Object.assign(hatenaApiResult, json);
    }),
  );

  const hatenaApiResultWithSlug = Object.keys(hatenaApiResult).reduce<Record<string, number>>((acc, key) => {
    const bookmarkCount = hatenaApiResult[key];
    if (bookmarkCount > 0) {
      const slug = key.replace(`${SITE_URL}/`, '').replace('.html', '');
      acc[slug] = bookmarkCount;
    }
    return acc;
  }, {});

  return sortResultsByBookmarkCount(hatenaApiResultWithSlug);
};
