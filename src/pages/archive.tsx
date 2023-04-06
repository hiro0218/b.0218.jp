import { GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';

import { Columns, PageContainer, Stack } from '@/components/UI/Layout';
import LinkCard from '@/components/UI/LinkCard';
import { Title } from '@/components/UI/Title';
import { SITE } from '@/constant';
import { getPostsListJson } from '@/lib/posts';
import { Post as PropPost } from '@/types/source';

type PostsProps = ReturnType<typeof getPostsListJson>;

type ArchiveListProps = Record<number, PostsProps>;

type ArchiveProps = {
  archives: ArchiveListProps;
  numberOfPosts: number;
};

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const getYear = (date: PropPost['date']) => Number(date.slice(0, 4));

const divideByYearArchive = (posts: PostsProps): ArchiveListProps => {
  const result: ArchiveListProps = {};

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const year = getYear(post.date);

    if (!result[year]) {
      result[year] = [];
    }

    result[year].push(post);
  }

  return result;
};

export default function Archive({ archives, numberOfPosts }: Props) {
  return (
    <>
      <Head>
        <title key="title">{`Archive - ${SITE.NAME}`}</title>
        <link href={`${SITE.URL}archive`} rel="canonical" />
      </Head>

      <PageContainer as="article">
        <Title heading="Archive" paragraph={`${numberOfPosts}件`} />

        {Object.keys(archives)
          .reverse()
          .map((year) => (
            <Columns key={year} title={`${year}年`}>
              <Stack space="half">
                {archives[year].map(({ slug, title, date, updated, excerpt, tags }: PropPost) => (
                  <LinkCard
                    date={date}
                    excerpt={excerpt}
                    key={slug}
                    link={`/${slug}.html`}
                    tags={tags}
                    title={title}
                    updated={updated}
                  />
                ))}
              </Stack>
            </Columns>
          ))}
      </PageContainer>
    </>
  );
}

export const config = {
  unstable_runtimeJS: false,
};

export const getStaticProps: GetStaticProps<ArchiveProps> = () => {
  const posts = getPostsListJson();
  const archives = divideByYearArchive(posts);

  return {
    props: {
      archives,
      numberOfPosts: posts.length,
    },
  };
};
