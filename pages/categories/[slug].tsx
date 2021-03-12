import fs from 'fs-extra';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import path from 'path';

import Layout from '../../components/layout';
import { SITE } from '../../constant';
import { Terms, TermsPostLits } from '../../types/source';
interface Props {
  title: string;
  posts: Array<TermsPostLits>;
}

const Categories = ({ title, posts }: Props) => {
  return (
    <>
      <Head>
        <title key="title">
          {title} - {SITE.NAME}
        </title>
      </Head>

      <Layout>
        <ul>
          {posts.map((post, index: number) => (
            <li key={index}>
              <Link href={'/' + post.path}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </Layout>
    </>
  );
};

export default Categories;

export const getStaticPaths: GetStaticPaths = async () => {
  const dataPath = path.join(process.cwd(), '_source/categories.json');
  const posts: Array<Terms> = fs.readJsonSync(dataPath);
  const paths = posts.map((post) => `/${post.path}`);

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const dataPath = path.join(process.cwd(), '_source/categories_posts.json');
  const posts: Array<Terms> = fs.readJsonSync(dataPath);
  const slug = context.params.slug;

  const postData = posts.filter((post: Terms) => {
    return post.slug === slug;
  });

  return {
    props: {
      title: postData[0].name,
      posts: postData[0].posts,
    },
  };
};
