import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';

import { Columns, PageContainer, Stack } from '@/components/UI/Layout';
import LinkCard from '@/components/UI/LinkCard';
import { Title } from '@/components/UI/Title';
import { SITE_NAME } from '@/constant';
import { getStaticPathsTagDetail, getStaticPropsTagDetail } from '@/server/tags';
import type { TermsPostListProps } from '@/types/source';

type TermProps = {
  title: string;
  posts: TermsPostListProps[];
};
type Props = InferGetStaticPropsType<typeof getStaticProps>;

const pageTitle = 'Tag';

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

export const getStaticPaths: GetStaticPaths = getStaticPathsTagDetail;

export const getStaticProps: GetStaticProps<TermProps> = getStaticPropsTagDetail;
