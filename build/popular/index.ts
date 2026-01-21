import { FILENAME_POSTS_POPULAR } from '@/constants';
import { copyFile, writeJSON } from '~/tools/fs';
import * as Log from '~/tools/logger';
import { getPopularArticles } from './ga';
import { getBookmarkArticles } from './hatena';

import type { Result } from './type';

const PATH_DIST = `${process.cwd()}/dist`;
const PATH_PUBLIC = `${process.cwd()}/public`;

const sortByTotal = (obj: Result): Result =>
  Object.fromEntries(Object.entries(obj).sort(([, a], [, b]) => b.total - a.total));

(async () => {
  const bookmark = await getBookmarkArticles();
  const ga = await getPopularArticles();

  const allSlugs = new Set([...Object.keys(bookmark), ...Object.keys(ga)]);

  const result: Result = Array.from(allSlugs).reduce((acc, slug) => {
    const hatenaCount = bookmark[slug] || 0;
    const gaCount = ga[slug] || 0;

    acc[slug] = {
      total: hatenaCount + gaCount,
      ga: gaCount,
      hatena: hatenaCount,
    };

    return acc;
  }, {} as Result);

  await writeJSON(`${PATH_DIST}/${FILENAME_POSTS_POPULAR}.json`, sortByTotal(result));
  Log.info(`Write dist/${FILENAME_POSTS_POPULAR}.json`);

  await copyFile(`${PATH_DIST}/${FILENAME_POSTS_POPULAR}.json`, `${PATH_PUBLIC}/${FILENAME_POSTS_POPULAR}.json`);
  Log.info(`Copy dist/${FILENAME_POSTS_POPULAR}.json -> public`);
})();
