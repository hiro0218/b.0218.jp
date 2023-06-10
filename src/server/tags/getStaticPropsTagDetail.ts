import type { GetStaticProps, GetStaticPropsContext } from 'next';

import { getPostsJson, getTagsJson } from '@/lib/posts';
import type { TermsPostListProps } from '@/types/source';

type TermProps = {
  title: string;
  posts: TermsPostListProps[];
};

const allPosts = getPostsJson();
const allTags = getTagsJson();
const postsBySlug = Object.fromEntries(allPosts.map((post) => [post.slug, post]));

export const getStaticPropsTagDetail: GetStaticProps<TermProps> = (context: GetStaticPropsContext) => {
  const slug = context.params?.slug as string;
  const tag = allTags[slug];
  const tagsPosts = tag
    .map((slug) => {
      const post = postsBySlug[slug];
      if (!post) {
        return null;
      }
      const { title, date, updated, excerpt } = post;
      return { title, slug, date, updated, excerpt };
    })
    .filter((post) => post !== null) as TermsPostListProps[];

  return {
    props: {
      title: slug,
      posts: tagsPosts,
    },
  };
};
