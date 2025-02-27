import { getPostsJson, getTagsJson } from '@/lib/posts';
import { getDateAndUpdatedToSimpleFormat } from '@/pages/_libs/getDateAndUpdatedToSimpleFormat';
import type { PageProps } from '@/types/source';

type ReturnProps = Omit<PageProps, 'content'>;

const allPosts = getPostsJson();
const allTags = getTagsJson();

export const getTagPosts = (slug: string): ReturnProps[] => {
  const tag = allTags[slug];
  const tagPosts = tag.map((postSlug: string) => {
    const { title, date, updated } = allPosts.get(postSlug);
    return {
      title,
      slug: postSlug,
      ...getDateAndUpdatedToSimpleFormat(date, updated),
    };
  });

  return tagPosts;
};
