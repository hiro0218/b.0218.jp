import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';

import Heading from '@/components/Heading';
import PageContainer from '@/components/layout/PageContainer';
import { Stack } from '@/components/layout/Stack';
import LinkCard from '@/components/LinkCard';
import { SITE } from '@/constant';
import { getPostsJson } from '@/lib/posts';
import { Post as PropPost } from '@/types/source';

interface Props {
  archives: Array<PropPost>;
}

const initArchiveYearList = (archives: Array<PropPost>) => {
  const list = {};

  [
    ...new Set(
      archives.map(({ date }) => {
        return date.slice(0, 4) + ' ';
      }),
    ),
  ].map((year) => (list[year] = []));

  return list;
};

const divideByYearArchive = (archives: Array<PropPost>) => {
  const formatArchives = initArchiveYearList(archives);

  for (let i = 0; i < archives.length; i++) {
    const post = archives[i];

    // 日付を取得する
    const year = post.date.slice(0, 4) + ' ';

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
            <Heading text={'Archive'} textSide={`${archives.length}件`} />
          </header>

          <section className="p-archive__contents">
            {Object.keys(posts).map((key: string) => {
              return (
                <div key={key} className="archive-list">
                  <div className="archive-year">
                    <h2 className="archive-year__title">{key}</h2>
                  </div>
                  <Stack
                    direction="column"
                    gap="calc(var(--margin-base) * 0.125) 0"
                    grow={1}
                    style={{
                      minWidth: 0,
                    }}
                    role="list"
                  >
                    {posts[key].map((post: PropPost, index: number) => {
                      return (
                        <Stack.Item key={index} display="block" role="listitem">
                          <LinkCard
                            link={`/${post.slug}.html`}
                            title={post.title}
                            date={post.date}
                            excerpt={post.excerpt}
                          />
                        </Stack.Item>
                      );
                    })}
                  </Stack>
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
  const archives = getPostsJson();

  return {
    props: {
      archives,
    },
  };
};
