import { getPostsJson, getTagsJson } from '@/lib/posts';
import type { TermsPostListProps } from '@/types/source';
const allPosts = getPostsJson();
const allTags = getTagsJson();

export const getTagPosts = (slug: string) => {
  const tag = allTags[slug];
  const tagPosts: TermsPostListProps[] = tag.map((postSlug: string) => {
    const { title, date, updated } = allPosts.get(postSlug);
    return {
      title,
      slug: postSlug,
      date,
      ...(updated && { updated }),
    };
  });

  return tagPosts;
};
