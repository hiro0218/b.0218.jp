import type { GetStaticPaths } from 'next';

import { TAG_VIEW_LIMIT } from '@/constant';
import { getTagsWithCount } from '@/lib/posts';

export const getStaticPathsTagDetail: GetStaticPaths = () => {
  const tags = getTagsWithCount();
  const paths = [];

  for (let i = 0; i < tags.length; i++) {
    if (tags[i].count >= TAG_VIEW_LIMIT) {
      paths.push({
        params: { slug: tags[i].slug },
      });
    }
  }

  return { paths, fallback: false };
};
