import { FILENAME_POSTS_POPULAR } from '@/constants';
import { writeJSON } from '~/tools/fs';
import * as Log from '~/tools/logger';
import { getPopularArticles } from './ga';
import { getBookmarkArticles } from './hatena';

import type { Result } from './type';

const PATH_DIST = `${process.cwd()}/dist`;

const sortByTotal = (obj: Result): Result =>
  Object.fromEntries(Object.entries(obj).sort(([, a], [, b]) => b.total - a.total));

(async () => {
  const bookmark = await getBookmarkArticles();
  const ga = await getPopularArticles();

  const allSlugs = new Set([...Object.keys(bookmark), ...Object.keys(ga)]);

  const result: Result = {};
  for (const slug of allSlugs) {
    const hatenaCount = bookmark[slug] || 0;
    const gaCount = ga[slug] || 0;
    result[slug] = {
      total: hatenaCount + gaCount,
      ga: gaCount,
      hatena: hatenaCount,
    };
  }

  await writeJSON(`${PATH_DIST}/${FILENAME_POSTS_POPULAR}.json`, sortByTotal(result));
  Log.info(`Write dist/${FILENAME_POSTS_POPULAR}.json`);
})();
