import fs from 'fs-extra';
import { GetStaticProps } from 'next';
import path from 'path';

import HoverCard from '@/components/HoverCard';
import PageContainer from '@/components/layout/PageContainer';
import { TermsPostLits } from '@/types/source';

interface Props {
  recentPosts: Array<TermsPostLits>;
  updatesPosts: Array<TermsPostLits>;
}

const Home = ({ recentPosts, updatesPosts }: Props) => {
  return (
    <>
      <PageContainer>
        <header className="l-section-header">
          <h1 className="c-heading">Home</h1>
        </header>
        <section className="p-home">
          <section className="p-home-section">
            <header className="l-section-header">
              <h2 className="c-heading">Recent Articles</h2>
            </header>
            <ul className="l-menu-list p-home-section__contents">
              {recentPosts.map((post, index: number) => (
                <li key={index} className="l-menu-list__item">
                  <HoverCard link={'/' + post.path} title={post.title} date={post.date} excerpt={post.excerpt} />
                </li>
              ))}
            </ul>
          </section>

          <section className="p-home-section">
            <header className="l-section-header">
              <h2 className="c-heading">Updated Articles</h2>
            </header>
            <ul className="l-menu-list p-home-section__contents">
              {updatesPosts.map((post, index: number) => (
                <li key={index} className="l-menu-list__item">
                  <HoverCard link={'/' + post.path} title={post.title} date={post.date} excerpt={post.excerpt} />
                </li>
              ))}
            </ul>
          </section>
        </section>
      </PageContainer>
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
