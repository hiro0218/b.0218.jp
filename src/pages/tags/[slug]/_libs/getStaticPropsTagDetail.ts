import { getTagPosts } from '@/pages/_libs/getTagPosts';
import type { TermsPostListProps } from '@/types/source';
import type { GetStaticProps, GetStaticPropsContext } from 'next';

type TermProps = {
  title: string;
  posts: TermsPostListProps[];
};

export const getStaticPropsTagDetail: GetStaticProps<TermProps> = (context: GetStaticPropsContext) => {
  const slug = context.params?.slug as string;
  const posts = getTagPosts(slug);

  return {
    props: {
      title: slug,
      posts,
    },
  };
};
