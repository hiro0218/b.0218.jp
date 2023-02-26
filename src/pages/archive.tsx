import { GetStaticProps } from 'next';
import Head from 'next/head';

import { Columns, PageContainer, Stack } from '@/components/UI/Layout';
import LinkCard from '@/components/UI/LinkCard';
import { Title } from '@/components/UI/Title';
import { SITE } from '@/constant';
import { getPostsListJson } from '@/lib/posts';
import { Post as PropPost } from '@/types/source';

type PostsProps = Partial<Pick<PropPost, 'title' | 'slug' | 'date' | 'excerpt'>>[];

type ArchiveProps = Record<number, PostsProps>;

type Props = {
  archives: ArchiveProps;
  numberOfPosts: number;
};

const getYear = (date: PropPost['date']) => Number(date.slice(0, 4));

const generateYearList = (archives: PostsProps) => {
  const list: ArchiveProps = {};

  [...new Set(archives.map(({ date }) => getYear(date)))].map((year) => (list[year] = []));

  return list;
};

const divideByYearArchive = (archives: PostsProps): ArchiveProps => {
  const formattedArchives = generateYearList(archives);

  for (let i = 0; i < archives.length; i++) {
    const post = archives[i];
    const year = getYear(post.date);

    formattedArchives[year].push(post);
  }

  return formattedArchives;
};

export default function Archive({ archives, numberOfPosts }: Props) {
  return (
    <>
      <Head>
        <title key="title">{`Archive - ${SITE.NAME}`}</title>
      </Head>

      <PageContainer as="article">
        <Title heading="Archive" paragraph={`${numberOfPosts}件`} />

        {Object.keys(archives)
          .reverse()
          .map((year) => (
            <Columns key={year} title={`${year}年`}>
              <Stack space="half">
                {archives[year].map(({ slug, title, date, excerpt }: PropPost) => (
                  <LinkCard key={slug} link={`/${slug}.html`} title={title} date={date} excerpt={excerpt} />
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

export const getStaticProps: GetStaticProps = async () => {
  const posts: PostsProps = getPostsListJson().map(({ title, slug, date, excerpt }) => {
    return {
      title,
      slug,
      date,
      excerpt: excerpt || '',
    };
  });

  const archives = divideByYearArchive(posts);

  return {
    props: {
      archives,
      numberOfPosts: posts.length,
    },
  };
};
