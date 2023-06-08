import type { Props as PostTagProps } from '@/components/UI/Tag';
import { TAG_VIEW_LIMIT } from '@/constant';
import { getSimilarTag as getSimilarTags } from '@/lib/posts';
import type { TagsListProps } from '@/types/source';

const tags = getSimilarTags();

const getTagBySlug = (tagList: TagsListProps, slug: PostTagProps['slug']) => {
  return Object.entries(tagList).find(([key]) => key === slug);
};

export const getSimilarTag = (tag: string, tagList: TagsListProps) => {
  const similarTagsList = tags[tag];
  if (!similarTagsList) {
    return [];
  }

  const similarTags = Object.keys(similarTagsList).reduce((result, slug) => {
    const tag = getTagBySlug(tagList, slug);
    if (!tag) {
      return result;
    }
    const count = tag.length;
    if (count >= TAG_VIEW_LIMIT) {
      result.push({ slug, count });
    }
    return result;
  }, [] as PostTagProps[]);

  similarTags.sort((a, b) => b.count - a.count);

  return similarTags;
};
