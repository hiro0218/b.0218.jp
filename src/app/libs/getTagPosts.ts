import { getDateAndUpdatedToSimpleFormat } from '@/app/libs/getDateAndUpdatedToSimpleFormat';
import { getPostsJson, getTagsJson } from '@/lib/posts';
import type { PageProps } from '@/types/source';

type ReturnProps = Omit<PageProps, 'content'>;

const allPosts = getPostsJson();
const allTags = getTagsJson();

export const getTagPosts = (slug: string): ReturnProps[] => {
  const tag = allTags[slug];

  if (!tag) {
    return null;
  }

  const tagPosts = tag.map((postSlug: string) => {
    const { title, date, updated } = allPosts.find((post) => post.slug === postSlug);
    return {
      title,
      slug: postSlug,
      ...getDateAndUpdatedToSimpleFormat(date, updated),
    };
  });

  return tagPosts;
};
