import type { Props as PostTagProps } from '@/components/UI/Tag';
import { TAG_VIEW_LIMIT } from '@/constant';
import { getSimilarTag as getSimilarTags, getTagsJson } from '@/lib/posts';

const LIMIT_TAG_LIST = 10;

const tagData = getTagsJson();
const similarTags = getSimilarTags();
const tagDataMap = new Map(Object.entries(tagData));

const getTagBySlug = (slug: PostTagProps['slug']) => {
  return tagDataMap.get(slug);
};

export const getSimilarTag = (tag: string) => {
  const similarTagsList = similarTags[tag];

  if (!similarTagsList) {
    return [];
  }

  const similarTagList = [];
  for (const [slug] of Object.entries(similarTagsList)) {
    const tag = getTagBySlug(slug);
    if (tag) {
      const count = tag.length > 1 ? tag[1].length : 0;
      if (count >= TAG_VIEW_LIMIT) {
        similarTagList.push({ slug, count });
      }
    }
  }

  return similarTagList.sort((a, b) => b.count - a.count).splice(0, LIMIT_TAG_LIST) as PostTagProps[];
};
