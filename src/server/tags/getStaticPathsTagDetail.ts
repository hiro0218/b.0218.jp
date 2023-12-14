import type { GetStaticPaths } from 'next';

import { TAG_VIEW_LIMIT } from '@/constant';
import { getTagsWithCount } from '@/lib/posts';

export const getStaticPathsTagDetail: GetStaticPaths = () => {
  const tags = getTagsWithCount();
  const paths = [];

  for (const item of tags) {
    if (item.count >= TAG_VIEW_LIMIT) {
      paths.push({
        params: { slug: item.slug },
      });
    }
  }

  return { paths, fallback: false };
};
