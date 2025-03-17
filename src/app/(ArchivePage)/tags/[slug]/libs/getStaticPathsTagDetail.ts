import { TAG_VIEW_LIMIT } from '@/constant';
import { getTagsWithCount } from '@/lib/posts';

type Props = {
  slug: string;
};

export const getStaticPathsTagDetail = (): Props[] => {
  const tags = getTagsWithCount();
  const paths: Props[] = [];

  for (let i = 0; i < tags.length; i++) {
    if (tags[i].count >= TAG_VIEW_LIMIT) {
      paths.push({ slug: tags[i].slug });
    }
  }

  return paths;
};
