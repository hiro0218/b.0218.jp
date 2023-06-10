import type { GetStaticPaths } from 'next';

import { TAG_VIEW_LIMIT } from '@/constant';
import { getTagsWithCount } from '@/lib/posts';

export const getStaticPathsTagDetail: GetStaticPaths = () => {
  const tags = getTagsWithCount();
  const paths = tags
    .filter(([, count]) => count >= TAG_VIEW_LIMIT)
    .map(([slug]) => {
      return {
        params: { slug },
      };
    });

  return { paths, fallback: false };
};
