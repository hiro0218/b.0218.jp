import type { Props as PostTagProps } from '@/components/UI/Tag';
import { TAG_VIEW_LIMIT } from '@/constant';
import { getSimilarTag as getSimilarTags, getTagsJson } from '@/lib/posts';

const LIMIT_TAG_LIST = 10;

const tagData = getTagsJson();
const similarTags = getSimilarTags();

const getTagBySlug = (slug: PostTagProps['slug']) => tagData[slug];

export const getSimilarTag = (tag: string) => {
  const similarTagsList = similarTags[tag];

  if (!similarTagsList) {
    return [];
  }

  const similarTagList: PostTagProps[] = [];

  for (const [slug] of Object.entries(similarTagsList)) {
    const tag = getTagBySlug(slug);

    if (tag && tag.length >= TAG_VIEW_LIMIT) {
      similarTagList.push({ slug, count: tag.length });

      // リストが制限に達したら抜ける
      if (similarTagList.length >= LIMIT_TAG_LIST) {
        break;
      }
    }
  }

  return similarTagList.sort((a, b) => b.count - a.count);
};
