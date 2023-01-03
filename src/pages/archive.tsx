import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';

import { Columns, PageContentContainer, Stack } from '@/components/UI/Layout';
import LinkCard from '@/components/UI/LinkCard';
import { Title } from '@/components/UI/Title';
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
        <title key="title">{`Archive - ${SITE.NAME}`}</title>
      </Head>

      <article>
        <PageContentContainer>
          <Title heading="Archive" paragraph={`${archives.length}件`} />

          {Object.keys(posts).map((key: string) => (
            <Columns key={key} title={`${key}年`}>
              <Stack space="var(--space-x-xs)">
                {posts[key].map((post: PropPost) => (
                  <LinkCard
                    key={post.slug}
                    link={`/${post.slug}.html`}
                    title={post.title}
                    date={post.date}
                    excerpt={post.excerpt}
                  />
                ))}
              </Stack>
            </Columns>
          ))}
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
