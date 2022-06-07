import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';

import Heading from '@/components/UI/Heading';
import { Columns, Flex, PageContentContainer } from '@/components/UI/Layout';
import LinkCard from '@/components/UI/LinkCard';
import { SITE } from '@/constant';
import { getPostsListJson } from '@/lib/posts';
import { Post as PropPost } from '@/types/source';

type ArchiveProps = Partial<PropPost>[];

interface Props {
  archives: ArchiveProps;
}

const initArchiveYearList = (archives: ArchiveProps) => {
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

const divideByYearArchive = (archives: ArchiveProps) => {
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

      <article>
        <header>
          <Heading text={'Archive'} textSide={`${archives.length}件`} />
        </header>

        <PageContentContainer>
          {Object.keys(posts).map((key: string) => {
            return (
              <Columns key={key} title={key}>
                <Flex
                  direction="column"
                  gap="var(--space-x-xs) 0"
                  grow={1}
                  style={{
                    minWidth: 0,
                  }}
                  role="list"
                >
                  {posts[key].map((post: PropPost, index: number) => {
                    return (
                      <LinkCard
                        key={index}
                        link={`/${post.slug}.html`}
                        title={post.title}
                        date={post.date}
                        excerpt={post.excerpt}
                        role="listitem"
                      />
                    );
                  })}
                </Flex>
              </Columns>
            );
          })}
        </PageContentContainer>
      </article>
    </>
  );
};

export default Archive;

export const config = {
  unstable_runtimeJS: false,
};

export const getStaticProps: GetStaticProps = async () => {
  const archives = getPostsListJson().map(({ title, slug, date, excerpt }) => {
    return {
      title,
      slug,
      date,
      excerpt: excerpt || '',
    };
  });

  return {
    props: {
      archives,
    },
  };
};
