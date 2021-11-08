import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';

import TermsBody from '@/components/terms/body';
import { getTermJson } from '@/lib/posts';
import { TermsPostList } from '@/types/source';

type TermProps = {
  title: string;
  posts: Array<TermsPostList>;
};
type Props = InferGetStaticPropsType<typeof getStaticProps>;

const Categories: NextPage<Props> = ({ title, posts }) => {
  return <TermsBody type={'Category'} title={title} posts={posts} />;
};

export default Categories;

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getTermJson('categories');
  const paths = Object.keys(posts).map((slug) => ({
    params: { slug },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<TermProps> = async (context) => {
  const posts = getTermJson('categories');
  const slug = context.params.slug as string;

  return {
    props: {
      title: slug,
      posts: posts[slug],
    },
  };
};
