import { FILENAME_POSTS_POPULAR } from '@/constants';
import { BUILD_PATHS } from '~/build/shared/paths';
import { writeJSON } from '~/tools/fs';
import * as Log from '~/tools/logger';
import { getPopularArticles } from './ga';
import { getBookmarkArticles } from './hatena';

import type { Result } from './type';

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

  await writeJSON(`${BUILD_PATHS.dist}/${FILENAME_POSTS_POPULAR}.json`, sortByTotal(result));
  Log.info(`Write dist/${FILENAME_POSTS_POPULAR}.json`);
})();
