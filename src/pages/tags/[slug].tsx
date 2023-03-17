import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import Head from 'next/head';

import { Columns, PageContainer, Stack } from '@/components/UI/Layout';
import LinkCard from '@/components/UI/LinkCard';
import { Title } from '@/components/UI/Title';
import { SITE } from '@/constant';
import { getPostsJson, getTagsJson } from '@/lib/posts';
import { TermsPostList } from '@/types/source';

type TermProps = {
  title: string;
  posts: TermsPostList[];
};
type Props = InferGetStaticPropsType<typeof getStaticProps>;

const pageTitle = 'Tag';

export default function Tags({ title, posts }: Props) {
  return (
    <>
      <Head>
        <title key="title">{`${pageTitle}: ${title} - ${SITE.NAME}`}</title>
        <meta content="noindex" name="robots" />
      </Head>

      <PageContainer as="section">
        <Title heading={pageTitle} paragraph={`${posts.length}件`} />

        <Columns title={title}>
          <Stack space="half">
            {posts.map((post) => (
              <LinkCard
                date={post.date}
                excerpt={post.excerpt}
                key={post.slug}
                link={`/${post.slug}.html`}
                title={post.title}
              />
            ))}
          </Stack>
        </Columns>
      </PageContainer>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const tags = getTagsJson();
  const paths = Object.keys(tags).map((slug) => ({
    params: { slug },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<TermProps> = (context: GetStaticPropsContext) => {
  const posts = getPostsJson();
  const tags = getTagsJson();
  const slug = context.params.slug as string;
  const tagsPosts = tags[slug].map((slug) => {
    const post = posts.find((post) => post.slug === slug);
    return {
      title: post.title,
      slug,
      date: post.date,
      excerpt: post.excerpt,
    };
  });

  return {
    props: {
      title: slug,
      posts: tagsPosts,
    },
  };
};
