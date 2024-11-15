import { getPopularArticles } from '@/build/popular/ga';
import { getBookmarkArticles } from '@/build/popular/hatena';
import { FILENAME_POSTS_POPULAR } from '@/constant';
import * as Log from '@/shared/Log';
import { writeJSON } from '@/shared/fs';

import type { Result } from './type';

const PATH_DIST = `${process.cwd()}/dist`;

const sortByValue = (obj: Result): Result => Object.fromEntries(Object.entries(obj).sort(([, a], [, b]) => b - a));

(async () => {
  const bookmark = await getBookmarkArticles();
  const ga = await getPopularArticles();

  const result: Result = sortByValue(
    Object.entries(ga).reduce(
      (acc, [key, value]) => {
        acc[key] = (acc[key] || 0) + value;
        return acc;
      },
      { ...bookmark },
    ),
  );

  await writeJSON(`${PATH_DIST}/${FILENAME_POSTS_POPULAR}.json`, result);
  Log.info(`Write dist/${FILENAME_POSTS_POPULAR}.json`);
})();
