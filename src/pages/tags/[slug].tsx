import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import Head from 'next/head';

import { Columns, PageContainer, Stack } from '@/components/UI/Layout';
import LinkCard from '@/components/UI/LinkCard';
import { Title } from '@/components/UI/Title';
import { SITE } from '@/constant';
import { getTermJson } from '@/lib/posts';
import { TermsPostList } from '@/types/source';

type TermProps = {
  title: string;
  posts: Array<TermsPostList>;
};
type Props = InferGetStaticPropsType<typeof getStaticProps>;

const pageTitle = 'Tag';

const Tags: NextPage<Props> = ({ title, posts }) => (
  <>
    <Head>
      <title key="title">{`${pageTitle}: ${title} - ${SITE.NAME}`}</title>
      <meta name="robots" content="noindex" />
    </Head>

    <PageContainer as="section">
      <Title heading={pageTitle} paragraph={`${posts.length}件`} />

      <Columns title={title}>
        <Stack space="calc(var(--space-3) * 0.25)">
          {posts.map((post) => (
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
    </PageContainer>
  </>
);

export default Tags;

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getTermJson('tags');
  const paths = Object.keys(posts).map((slug) => ({
    params: { slug },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<TermProps> = async (context) => {
  const posts = getTermJson('tags');
  const slug = context.params.slug as string;

  return {
    props: {
      title: slug,
      posts: posts[slug],
    },
  };
};
