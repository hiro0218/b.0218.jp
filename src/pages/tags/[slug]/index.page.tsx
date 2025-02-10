import type { InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';

import { Sidebar, Stack } from '@/components/UI/Layout';
import LinkCard from '@/components/UI/LinkCard';
import { Title } from '@/components/UI/Title';
import { SITE_NAME } from '@/constant';
import { convertPostSlugToPath } from '@/lib/url';

import { createGetLayout } from '../../_layouts/ArchivePageLayout';
import { getStaticPathsTagDetail, getStaticPropsTagDetail } from './_libs';

import { useRouter } from 'next/router';
import { Pagination } from './_components/Pagination';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const pageTitle = 'Tag';
const QUERY_PAGE_PER_KEY = 'p';
const PER_PAGE = 5;

export default function Tags({ title, posts }: Props) {
  const router = useRouter();
  const { query } = router;
  const currentPer = query[QUERY_PAGE_PER_KEY] ? Number(query[QUERY_PAGE_PER_KEY]) : 1;
  const [currentPage, setCurrentPage] = useState(currentPer);
  const postsToDisplay = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    const end = start + PER_PAGE;
    return posts.slice(start, end);
  }, [currentPage, posts]);
  const totalItems = posts.length;

  const handlePageChange = (page: number) => {
    // クエリパラメータ（?p=2）を更新する
    router.push({ query: { ...query, [QUERY_PAGE_PER_KEY]: page } }, undefined, { scroll: false });
    setCurrentPage(page);
  };

  // currentPerに応じてページネーションの表示を変更する
  useEffect(() => {
    setCurrentPage(currentPer);
  }, [currentPer]);

  const paginationPosts = useMemo(() => {
    return postsToDisplay.map(({ date, slug, title, updated }) => {
      const link = convertPostSlugToPath(slug);
      return <LinkCard date={date} key={slug} link={link} title={title} updated={updated} />;
    });
  }, [postsToDisplay]);

  return (
    <>
      <Head>
        <title key="title">{`${pageTitle}: ${title} - ${SITE_NAME}`}</title>
      </Head>

      <Stack as="section" space={4}>
        <Title heading={pageTitle} paragraph={`${totalItems}件の記事`} />
        <Sidebar>
          <Sidebar.Side>
            <Sidebar.Title>{title}</Sidebar.Title>
          </Sidebar.Side>
          <Sidebar.Main>
            <Stack>{paginationPosts}</Stack>
          </Sidebar.Main>
        </Sidebar>
        <Pagination
          onPageChange={handlePageChange}
          totalCount={totalItems}
          currentPage={currentPage}
          pageSize={PER_PAGE}
        />
      </Stack>
    </>
  );
}

Tags.getLayout = createGetLayout();

export const getStaticPaths = getStaticPathsTagDetail;

export const getStaticProps = getStaticPropsTagDetail;
