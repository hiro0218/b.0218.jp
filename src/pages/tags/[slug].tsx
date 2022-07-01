import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import Head from 'next/head';

import Heading from '@/components/UI/Heading';
import { Columns, PageContentContainer, Stack } from '@/components/UI/Layout';
import LinkCard from '@/components/UI/LinkCard';
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
      <title key="title">
        {pageTitle}: {title} - {SITE.NAME}
      </title>
      <meta name="robots" content="noindex" />
    </Head>

    <section>
      <header>
        <Heading text={pageTitle} textSide={`${posts.length}件`} />
      </header>
      <PageContentContainer>
        <Columns title={title}>
          <Stack space="calc(var(--margin-base) * 0.25)">
            {posts.map((post, index) => (
              <LinkCard
                key={index}
                link={`/${post.slug}.html`}
                title={post.title}
                date={post.date}
                excerpt={post.excerpt}
              />
            ))}
          </Stack>
        </Columns>
      </PageContentContainer>
    </section>
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
