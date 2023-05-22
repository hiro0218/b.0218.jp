import type { Props as PostTagProps } from '@/components/UI/Tag';
import { TAG_VIEW_LIMIT } from '@/constant';
import { getSimilarTag as getSimilarTags } from '@/lib/posts';
import type { TagsListProps } from '@/types/source';

export const getSimilarTag = (tag: string, tagData: TagsListProps) => {
  const getTagBySlug = (slug: PostTagProps['slug']) => {
    return Object.entries(tagData).find(([key]) => key === slug);
  };
  const similarTagsList = getSimilarTags()[tag];
  const similarTags = !!similarTagsList
    ? (Object.entries(similarTagsList)
        .map(([slug]) => {
          const tag = getTagBySlug(slug);
          if (!tag) {
            return null;
          }
          const count = tag.length > 1 ? tag[1].length : 0;
          return count >= TAG_VIEW_LIMIT ? { slug, count } : null;
        })
        .filter((item) => item !== null)
        .sort((a, b) => {
          if (a === null) return 1;
          if (b === null) return -1;
          return b.count - a.count;
        }) as PostTagProps[])
    : [];

  return similarTags;
};
