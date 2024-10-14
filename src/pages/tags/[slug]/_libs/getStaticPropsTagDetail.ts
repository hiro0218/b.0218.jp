import type { GetStaticProps, GetStaticPropsContext } from 'next';

import { getPostsJson, getTagsJson } from '@/lib/posts';
import type { TermsPostListProps } from '@/types/source';

type TermProps = {
  title: string;
  posts: TermsPostListProps[];
};

const allPosts = getPostsJson();
const allTags = getTagsJson();

export const getStaticPropsTagDetail: GetStaticProps<{ slug: string }> = (context: GetStaticPropsContext) => {
  const slug = context.params?.slug as string;

  return {
    props: {
      slug,
    },
  };
};

export const getData = (slug: string): TermProps => {
  const tag = allTags[slug];
  const tagsPosts: TermsPostListProps[] = [];

  for (const postSlug of tag) {
    const { title, date, updated } = allPosts.get(postSlug);
    tagsPosts.push({
      title,
      slug: postSlug,
      date,
      ...(updated && { updated }),
    });
  }

  return {
    title: slug,
    posts: tagsPosts,
  };
};
