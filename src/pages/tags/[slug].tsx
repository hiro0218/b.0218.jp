import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';

import TermsBody from '@/components/terms/body';
import { getTermJson } from '@/lib/posts';
import { TermsPostList } from '@/types/source';

type TermProps = {
  title: string;
  posts: Array<TermsPostList>;
};
type Props = InferGetStaticPropsType<typeof getStaticProps>;

const Tags: NextPage<Props> = ({ title, posts }) => {
  return <TermsBody type={'Tag'} title={title} posts={posts} />;
};

export default Tags;

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getTermJson('tags');
  const paths = Object.keys(posts).map((slug) => ({
    params: { slug },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<TermProps> = async (context) => {
  const posts = getTermJson('tags');
  const slug = context.params.slug as string;

  return {
    props: {
      title: slug,
      posts: posts[slug],
    },
  };
};
