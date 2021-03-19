import fs from 'fs-extra';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import path from 'path';

import Layout from '@/components/layout';
import styleHoverCard from '@/styles/Components/hover-card.module.css';
import { TermsPostLits } from '@/types/source';

interface Props {
  recentPosts: Array<TermsPostLits>;
  updatesPosts: Array<TermsPostLits>;
}

const Home = ({ recentPosts, updatesPosts }: Props) => {
  return (
    <>
      <Layout>
        <section className="p-home">
          <section className="p-home-section">
            <header>
              <h2 className="c-heading">Recent Articles</h2>
            </header>
            <ul>
              {recentPosts.map((post, index: number) => (
                <li key={index}>
                  <Link href={'/' + post.path}>
                    <a className={styleHoverCard['hover-card']}>
                      <h3 className={styleHoverCard['hover-card__title']}>{post.title}</h3>
                      <div className={styleHoverCard['hover-card__text']}>{post.excerpt}</div>
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="p-home-section">
            <header>
              <h2 className="c-heading">Updated Articles</h2>
            </header>
            <ul>
              {updatesPosts.map((post, index: number) => (
                <li key={index}>
                  <Link href={'/' + post.path}>
                    <a className={styleHoverCard['hover-card']}>
                      <h3 className={styleHoverCard['hover-card__title']}>{post.title}</h3>
                      <div className={styleHoverCard['hover-card__text']}>{post.excerpt}</div>
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </section>
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
