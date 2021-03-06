import fs from 'fs-extra';
import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import path from 'path';

import Heading from '@/components/Heading';
import { MenuList, MenuListItem } from '@/components/layout/MenuList';
import PageContainer from '@/components/layout/PageContainer';
import LinkCard from '@/components/LinkCard';
import { SITE } from '@/constant';
import { Post as PropPost } from '@/types/source';

interface Props {
  archives: Array<PropPost>;
}

const divideByYearArchive = (archives: Array<PropPost>) => {
  const formatArchives = {};

  for (let i = 0; i < archives.length; i++) {
    const post = archives[i];

    // 日付を取得する
    const date = new Date(post.date);
    const year = date.getFullYear().toString() + ' ';

    // 配列で初期化
    if (!Array.isArray(formatArchives[year])) {
      formatArchives[year] = [];
    }

    formatArchives[year].push(post);
  }

  return formatArchives;
};

const Archive: NextPage<Props> = ({ archives }) => {
  const posts = divideByYearArchive(archives);

  return (
    <>
      <Head>
        <title key="title">Archive - {SITE.NAME}</title>
      </Head>

      <PageContainer>
        <article className="p-archive">
          <header>
            <Heading text={'Archive'} />
          </header>

          <section className="p-archive__contents">
            {Object.keys(posts).map((key: string) => {
              return (
                <div key={key} className="archive-list">
                  <div className="archive-year">
                    <h2 className="archive-year__title">{key}</h2>
                  </div>
                  <MenuList className="archive-post">
                    {posts[key].map((post: PropPost, index: number) => {
                      return (
                        <MenuListItem key={index}>
                          <LinkCard
                            link={`/${post.slug}.html`}
                            title={post.title}
                            date={post.date}
                            excerpt={post.excerpt}
                          />
                        </MenuListItem>
                      );
                    })}
                  </MenuList>
                </div>
              );
            })}
          </section>
        </article>
      </PageContainer>
    </>
  );
};

export default Archive;

export const getStaticProps: GetStaticProps = async () => {
  const dataPath = path.join(process.cwd(), 'dist/posts.json');
  const posts: Array<PropPost> = fs.readJsonSync(dataPath);

  return {
    props: {
      archives: posts,
    },
  };
};
