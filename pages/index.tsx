import fs from 'fs-extra';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import path from 'path';

import Layout from '@/components/layout';
import { TermsPostLits } from '@/types/source';

interface Props {
  recentPosts: Array<TermsPostLits>;
  updatesPosts: Array<TermsPostLits>;
}

const Home = ({ recentPosts, updatesPosts }: Props) => {
  return (
    <>
      <Layout>
        <h2>Recent Articles</h2>
        <ul>
          {recentPosts.map((post, index: number) => (
            <li key={index}>
              <Link href={'/' + post.path}>{post.title}</Link>
            </li>
          ))}
        </ul>
        <hr />
        <h2>Updated Articles</h2>
        <ul>
          {updatesPosts.map((post, index: number) => (
            <li key={index}>
              <Link href={'/' + post.path}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </Layout>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const recentPostsPath = path.join(process.cwd(), '_source/recent_posts.json');
  const updatesPostsPath = path.join(process.cwd(), '_source/updates_posts.json');
  const recentPosts: Array<TermsPostLits> = fs.readJsonSync(recentPostsPath);
  const updatesPosts: Array<TermsPostLits> = fs.readJsonSync(updatesPostsPath);

  return {
    props: {
      recentPosts,
      updatesPosts,
    },
  };
};
