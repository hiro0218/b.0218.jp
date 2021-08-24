import fs from 'fs-extra';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import path from 'path';

import TermsBody from '@/components/terms/body';
import { TermsPostLits } from '@/types/source';

type TermProps = {
  title: string;
  posts: Array<TermsPostLits>;
};
type Props = InferGetStaticPropsType<typeof getStaticProps>;

const Categories: NextPage<Props> = ({ title, posts }) => {
  return <TermsBody type={'Category'} title={title} posts={posts} />;
};

export default Categories;

export const getStaticPaths: GetStaticPaths = async () => {
  const dataPath = path.join(process.cwd(), 'dist/categories.json');
  const posts = fs.readJsonSync(dataPath);
  const paths = Object.keys(posts).map((slug) => ({
    params: { slug },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<TermProps> = async (context) => {
  const dataPath = path.join(process.cwd(), 'dist/categories.json');
  const posts = fs.readJsonSync(dataPath);
  const slug = context.params.slug as string;

  return {
    props: {
      title: slug,
      posts: posts[slug],
    },
  };
};
