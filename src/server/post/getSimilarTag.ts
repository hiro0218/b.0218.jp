import type { Props as PostTagProps } from '@/components/UI/Tag';
import { TAG_VIEW_LIMIT } from '@/constant';
import { getSimilarTag as getSimilarTags } from '@/lib/posts';
import type { TagsListProps } from '@/types/source';

const LIMIT_TAG_LIST = 10;

const tags = getSimilarTags();

const getTagBySlug = (tagList: TagsListProps, slug: PostTagProps['slug']) => {
  return Object.entries(tagList).find(([key]) => key === slug);
};

export const getSimilarTag = (tag: string, tagList: TagsListProps) => {
  const similarTagsList = tags[tag];
  const similarTags = !!similarTagsList
    ? (Object.entries(similarTagsList)
        .map(([slug]) => {
          const tag = getTagBySlug(tagList, slug);
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
        })
        .splice(0, LIMIT_TAG_LIST) as PostTagProps[])
    : [];

  return similarTags;
};
