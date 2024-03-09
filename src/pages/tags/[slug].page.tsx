import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';

import { Columns, Stack } from '@/components/UI/Layout';
import LinkCard from '@/components/UI/LinkCard';
import { Title } from '@/components/UI/Title';
import { SITE_NAME } from '@/constant';
import type { TermsPostListProps } from '@/types/source';

import { createGetLayout } from '../_layouts/ArchivePageLayout';
import { getStaticPathsTagDetail, getStaticPropsTagDetail } from './_libs';

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
      </Head>

      <Stack as="section" space="4">
        <Title heading={pageTitle} paragraph={`${posts.length}件の記事`} />

        <Columns title={title}>
          <Stack space="½">
            {posts.map(({ date, slug, title, updated }) => (
              <LinkCard date={date} key={slug} link={`/${slug}.html`} title={title} updated={updated} />
            ))}
          </Stack>
        </Columns>
      </Stack>
    </>
  );
}

Tags.getLayout = createGetLayout();

export const getStaticPaths: GetStaticPaths = getStaticPathsTagDetail;

export const getStaticProps: GetStaticProps<TermProps> = getStaticPropsTagDetail;
