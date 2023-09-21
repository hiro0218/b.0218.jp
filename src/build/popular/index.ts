import { getPopularArticles } from '@/build/popular/ga';
import { getBookmarkArticles } from '@/build/popular/hatena';
import { FILENAME_POSTS_POPULAR } from '@/constant';
import { writeJSON } from '@/lib/fs';
import * as Log from '@/lib/Log';

import type { Result } from './type';

const PATH_DIST = `${process.cwd()}/dist`;

function sortResultsByCount(result: Record<string, number>): Record<string, number> {
  return Object.entries(result)
    .sort(([, a], [, b]) => b - a)
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
}

(async () => {
  const bookmark = await getBookmarkArticles();
  const ga = await getPopularArticles();

  const result: Result = { ...bookmark };

  // sort by count
  for (const key in ga) {
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      result[key] += ga[key];
    } else {
      result[key] = ga[key];
    }
  }

  await writeJSON(`${PATH_DIST}/${FILENAME_POSTS_POPULAR}.json`, sortResultsByCount(result));
  Log.info(`Write dist/${FILENAME_POSTS_POPULAR}.json`);
})();
