import { Props as PostTagProps } from '@/components/UI/Tag';
import { TAG_VIEW_LIMIT } from '@/constant';
import { getSimilarTag as getSimilarTags } from '@/lib/posts';
import { TagsList } from '@/types/source';

export const getSimilarTag = (tag: string, tagData: TagsList) => {
  const getTagBySlug = (slug: PostTagProps['slug']) => {
    return Object.entries(tagData).find(([key]) => key === slug);
  };
  const similarTagsList = getSimilarTags()[tag];
  const similarTags: PostTagProps[] = !!similarTagsList
    ? Object.entries(similarTagsList)
        .map(([slug]) => {
          const tag = getTagBySlug(slug);
          const count = tag.length > 1 ? tag[1].length : 0;
          return count >= TAG_VIEW_LIMIT ? { slug, count } : null;
        })
        .filter((item) => item !== null)
        .sort((a, b) => b.count - a.count)
    : [];

  return similarTags;
};
