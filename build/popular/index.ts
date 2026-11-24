import type { PostPopularityScores } from '@/types/source';
import { writeDist } from '~/build/shared/dist';
import * as Log from '~/build/shared/logger';
import { getPopularArticles } from './ga';
import { getBookmarkArticles } from './hatena';

const sortByTotal = (obj: PostPopularityScores): PostPopularityScores =>
  Object.fromEntries(Object.entries(obj).sort(([, a], [, b]) => b.total - a.total));

(async () => {
  const [bookmark, ga] = await Promise.all([getBookmarkArticles(), getPopularArticles()]);

  const allSlugs = new Set([...Object.keys(bookmark), ...Object.keys(ga)]);

  const result: PostPopularityScores = Array.from(allSlugs).reduce((acc, slug) => {
    const hatenaCount = bookmark[slug] || 0;
    const gaCount = ga[slug] || 0;

    acc[slug] = {
      total: hatenaCount + gaCount,
      ga: gaCount,
      hatena: hatenaCount,
    };

    return acc;
  }, {} as PostPopularityScores);

  await writeDist('posts-popular', sortByTotal(result));
  Log.info('Write dist/posts-popular.json');
})();
