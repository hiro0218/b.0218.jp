import type { GetStaticProps, GetStaticPropsContext } from 'next';

import { getPostsJson, getTagsJson } from '@/lib/posts';
import type { TermsPostListProps } from '@/types/source';

type TermProps = {
  title: string;
  posts: TermsPostListProps[];
};

const allPosts = getPostsJson();
const allTags = getTagsJson();

export const getStaticPropsTagDetail: GetStaticProps<TermProps> = (context: GetStaticPropsContext) => {
  const slug = context.params?.slug as string;
  const tag = allTags[slug];
  const tagsPosts: TermsPostListProps[] = [];

  for (const postSlug of tag) {
    const { title, date, updated } = allPosts.get(postSlug);
    tagsPosts.push({ title, slug: postSlug, date, updated });
  }

  return {
    props: {
      title: slug,
      posts: tagsPosts,
    },
  };
};
