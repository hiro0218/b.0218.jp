import type { InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import { useMemo } from 'react';

import { Sidebar, Stack } from '@/components/UI/Layout';
import LinkCard from '@/components/UI/LinkCard';
import { Title } from '@/components/UI/Title';
import { SITE_NAME } from '@/constant';

import { createGetLayout } from '../../_layouts/ArchivePageLayout';
import { DATA_TARGET_POST_LIST_CONTAINER_KEY, PAGE_RANGE, PaginationContainer } from './_components/Pagination';
import { getData, getStaticPathsTagDetail, getStaticPropsTagDetail } from './_libs';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const pageTitle = 'Tag';

export default function Tags({ slug }: Props) {
  const { title, posts } = getData(slug);
  const displayCount = useMemo(() => Math.ceil(posts.length / PAGE_RANGE), [posts]);

  return (
    <>
      <Head>
        <title key="title">{`${pageTitle}: ${title} - ${SITE_NAME}`}</title>
      </Head>

      <PaginationContainer displayCount={displayCount}>
        <Title heading={pageTitle} paragraph={`${posts.length}件の記事`} />
        <Sidebar>
          <Sidebar.Title>{title}</Sidebar.Title>
          <Stack space={2} {...{ [`${DATA_TARGET_POST_LIST_CONTAINER_KEY}`]: '' }}>
            {posts.map(({ date, slug, title, updated }) => (
              <LinkCard date={date} key={slug} link={`/${slug}.html`} title={title} updated={updated} />
            ))}
          </Stack>
        </Sidebar>
      </PaginationContainer>
    </>
  );
}

Tags.getLayout = createGetLayout();

export const getStaticPaths = getStaticPathsTagDetail;

export const getStaticProps = getStaticPropsTagDetail;
