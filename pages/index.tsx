import fs from 'fs-extra';
import { GetStaticProps } from 'next';
import path from 'path';
import Parser from 'rss-parser';

import Heading from '@/components/Heading';
import { MenuList, MenuListItem } from '@/components/layout/MenuList';
import PageContainer from '@/components/layout/PageContainer';
import LinkCard from '@/components/LinkCard';
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
          <Heading text={'Home'} />
        </header>
        <section className="p-home">
          <section className="p-home-section">
            <header>
              <Heading tagName={'h2'} text={'Recent Articles'} isWeightNormal={true} />
            </header>
            <MenuList className="p-home-section__contents">
              {recentPosts.map((post, index) => (
                <MenuListItem key={index}>
                  <LinkCard link={'/' + post.path} title={post.title} date={post.date} excerpt={post.excerpt} />
                </MenuListItem>
              ))}
            </MenuList>
          </section>

          <section className="p-home-section">
            <header>
              <Heading tagName={'h2'} text={'Updated Articles'} isWeightNormal={true} />
            </header>
            <MenuList className="p-home-section__contents">
              {updatesPosts.map((post, index) => (
                <MenuListItem key={index}>
                  <LinkCard link={'/' + post.path} title={post.title} date={post.date} excerpt={post.excerpt} />
                </MenuListItem>
              ))}
            </MenuList>
          </section>

          <section className="p-home-section">
            <header>
              <Heading tagName={'h2'} text={'Qiita: Recent Articles'} isWeightNormal={true} />
            </header>
            <MenuList className="p-home-section__contents">
              {qiitaPosts.map(
                (post, index) =>
                  index < 5 && (
                    <MenuListItem key={index}>
                      <LinkCard link={post.link} title={post.title} date={post.isoDate} target={true} />
                    </MenuListItem>
                  ),
              )}
            </MenuList>
          </section>

          <section className="p-home-section">
            <header>
              <Heading tagName={'h2'} text={'Zenn: Recent Articles'} isWeightNormal={true} />
            </header>
            <MenuList className="p-home-section__contents">
              {zennPosts.map(
                (post, index) =>
                  index < 5 && (
                    <MenuListItem key={index}>
                      <LinkCard link={post.link} title={post.title} date={post.isoDate} target={true} />
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
