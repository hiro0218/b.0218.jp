import { getPostsListJson, getTagsJson } from '@/lib/data/posts';
import type { Page } from '@/types/source';
import { getDateAndUpdatedToSimpleFormat } from './getDateAndUpdatedToSimpleFormat';

type ReturnProps = Omit<Page, 'content'>;

const allPosts = getPostsListJson();
const allTags = getTagsJson();
const postsMap = new Map(allPosts.map((post) => [post.slug, post]));

export const getTagPosts = (slug: string): ReturnProps[] => {
  const tag = allTags[slug];

  if (!tag) {
    return null;
  }

  const tagPosts = tag
    .map((postSlug: string) => {
      const post = postsMap.get(postSlug);

      if (!post) {
        return null;
      }

      const { title, date, updated } = post;

      return {
        title,
        slug: postSlug,
        ...getDateAndUpdatedToSimpleFormat(date, updated),
      };
    })
    .filter((post) => post !== null);

  return tagPosts;
};
