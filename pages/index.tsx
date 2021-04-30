import fs from 'fs-extra';
import { GetStaticProps } from 'next';
import path from 'path';
import Parser from 'rss-parser';

import HoverCard from '@/components/HoverCard';
import { MenuList, MenuListItem } from '@/components/layout/MenuList';
import PageContainer from '@/components/layout/PageContainer';
import { TermsPostLits } from '@/types/source';

interface Feed {
  title: string;
  link: string;
  isoDate: string;
}

interface Props {
  recentPosts: Array<TermsPostLits>;
  updatesPosts: Array<TermsPostLits>;
  zennPosts: Array<Feed>;
  qiitaPosts: Array<Feed>;
}

const Home = ({ recentPosts, updatesPosts, zennPosts, qiitaPosts }: Props) => {
  return (
    <>
      <PageContainer>
        <header>
          <h1 className="c-heading">Home</h1>
        </header>
        <section className="p-home">
          <section className="p-home-section">
            <header>
              <h2 className="c-heading">Recent Articles</h2>
            </header>
            <MenuList className="p-home-section__contents">
              {recentPosts.map((post, index) => (
                <MenuListItem key={index}>
                  <HoverCard link={'/' + post.path} title={post.title} date={post.date} excerpt={post.excerpt} />
                </MenuListItem>
              ))}
            </MenuList>
          </section>

          <section className="p-home-section">
            <header>
              <h2 className="c-heading">Updated Articles</h2>
            </header>
            <MenuList className="p-home-section__contents">
              {updatesPosts.map((post, index) => (
                <MenuListItem key={index}>
                  <HoverCard link={'/' + post.path} title={post.title} date={post.date} excerpt={post.excerpt} />
                </MenuListItem>
              ))}
            </MenuList>
          </section>

          <section className="p-home-section">
            <header>
              <h2 className="c-heading">Qiita: Recent Articles</h2>
            </header>
            <MenuList className="p-home-section__contents">
              {qiitaPosts.map(
                (post, index) =>
                  index < 5 && (
                    <MenuListItem key={index}>
                      <HoverCard link={post.link} title={post.title} date={post.isoDate} target={true} />
                    </MenuListItem>
                  ),
              )}
            </MenuList>
          </section>

          <section className="p-home-section">
            <header>
              <h2 className="c-heading">Zenn: Recent Articles</h2>
            </header>
            <MenuList className="p-home-section__contents">
              {zennPosts.map(
                (post, index) =>
                  index < 5 && (
                    <MenuListItem key={index}>
                      <HoverCard link={post.link} title={post.title} date={post.isoDate} target={true} />
                    </MenuListItem>
                  ),
              )}
            </MenuList>
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

  // 外部サービス
  const parser = new Parser();
  const feedZenn = await parser.parseURL('https://zenn.dev/hiro/feed');
  const feedQiita = await parser.parseURL('https://qiita.com/hiro0218/feed.atom');
  const zennPosts = feedZenn.items;
  const qiitaPosts = feedQiita.items;

  return {
    props: {
      recentPosts,
      updatesPosts,
      zennPosts,
      qiitaPosts,
    },
  };
};
