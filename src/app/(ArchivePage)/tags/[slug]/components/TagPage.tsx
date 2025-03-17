'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { Sidebar, Stack } from '@/components/UI/Layout';
import LinkCard from '@/components/UI/LinkCard';
import { Title } from '@/components/UI/Title';
import { convertPostSlugToPath } from '@/lib/url';
import type { TermsPostListProps } from '@/types/source';
import { Pagination } from './Pagination';

const pageTitle = 'Tag';
const QUERY_PAGE_PER_KEY = 'p';
const PER_PAGE = 5;

export default function TagPage({
  slug,
  posts,
  totalItems,
}: {
  slug: string;
  posts: TermsPostListProps[];
  totalItems: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPer = searchParams.get(QUERY_PAGE_PER_KEY) ? Number(searchParams.get(QUERY_PAGE_PER_KEY)) : 1;
  const [currentPage, setCurrentPage] = useState(currentPer);

  const postsToDisplay = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    const end = start + PER_PAGE;
    return posts.slice(start, end);
  }, [currentPage, posts]);

  // currentPerに応じてページネーションの表示を変更する
  useEffect(() => {
    setCurrentPage(currentPer);
  }, [currentPer]);

  const handlePageChange = (page: number) => {
    // クエリパラメータ（?p=2）を更新する
    const params = new URLSearchParams(searchParams.toString());
    params.set(QUERY_PAGE_PER_KEY, page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
    setCurrentPage(page);
  };

  const paginationPosts = useMemo(() => {
    return postsToDisplay.map(({ date, slug, title, updated }) => {
      const link = convertPostSlugToPath(slug);
      return <LinkCard date={date} key={slug} link={link} title={title} updated={updated} />;
    });
  }, [postsToDisplay]);

  return (
    <Stack as="section" space={4}>
      <Title heading={pageTitle} paragraph={`${totalItems}件の記事`} />
      <Sidebar>
        <Sidebar.Side>
          <Sidebar.Title>{slug}</Sidebar.Title>
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
  );
}
