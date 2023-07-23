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
  const tagsPosts = tag
    .map((slug) => {
      const post = allPosts.get(slug);
      if (!post) {
        return null;
      }
      const { title, date, updated } = post;
      return { title, slug, date, updated };
    })
    .filter((post) => post !== null) as TermsPostListProps[];

  return {
    props: {
      title: slug,
      posts: tagsPosts,
    },
  };
};
