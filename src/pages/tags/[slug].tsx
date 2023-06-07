import type { GetStaticPaths, GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import Head from 'next/head';

import { Columns, PageContainer, Stack } from '@/components/UI/Layout';
import LinkCard from '@/components/UI/LinkCard';
import { Title } from '@/components/UI/Title';
import { SITE_NAME, TAG_VIEW_LIMIT } from '@/constant';
import { getPostsJson, getTagsJson, getTagsWithCount } from '@/lib/posts';
import type { TermsPostListProps } from '@/types/source';

type TermProps = {
  title: string;
  posts: TermsPostListProps[];
};
type Props = InferGetStaticPropsType<typeof getStaticProps>;

const pageTitle = 'Tag';

const allPosts = getPostsJson();
const allTags = getTagsJson();
const postsBySlug = Object.fromEntries(allPosts.map((post) => [post.slug, post]));

export default function Tags({ title, posts }: Props) {
  return (
    <>
      <Head>
        <title key="title">{`${pageTitle}: ${title} - ${SITE_NAME}`}</title>
        <meta content="noindex" name="robots" />
      </Head>

      <PageContainer as="section">
        <Title heading={pageTitle} paragraph={`${posts.length}件`} />

        <Columns title={title}>
          <Stack space="½">
            {posts.map(({ date, excerpt, slug, title, updated }) => (
              <LinkCard
                date={date}
                excerpt={excerpt}
                key={slug}
                link={`/${slug}.html`}
                title={title}
                updated={updated}
              />
            ))}
          </Stack>
        </Columns>
      </PageContainer>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = () => {
  const tags = getTagsWithCount();
  const paths = tags
    .filter(([, count]) => count >= TAG_VIEW_LIMIT)
    .map(([slug]) => {
      return {
        params: { slug },
      };
    });

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<TermProps> = (context: GetStaticPropsContext) => {
  const slug = context.params?.slug as string;
  const tag = allTags[slug];
  const tagsPosts = tag
    .map((slug) => {
      const post = postsBySlug[slug];
      if (!post) {
        return null;
      }
      const { title, date, updated, excerpt } = post;
      return { title, slug, date, updated, excerpt };
    })
    .filter((post) => post !== null) as TermsPostListProps[];

  return {
    props: {
      title: slug,
      posts: tagsPosts,
    },
  };
};
