import type { GetStaticPaths } from 'next';

import { TAG_VIEW_LIMIT } from '@/constant';
import { getTagsWithCount } from '@/lib/posts';

export const getStaticPathsTagDetail: GetStaticPaths = () => {
  const tags = getTagsWithCount();
  const paths = tags
    .filter((item) => item.count >= TAG_VIEW_LIMIT) // 件数が10件以上を25個抽出
    .map((item) => {
      return {
        params: { slug: item.slug },
      };
    });

  return { paths, fallback: false };
};
