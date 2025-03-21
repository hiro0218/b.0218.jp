'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { Pagination } from '@/components/Page/Archive/Pagination';
import { Sidebar, Stack } from '@/components/UI/Layout';
import LinkCard from '@/components/UI/LinkCard';
import { convertPostSlugToPath } from '@/lib/url';
import type { TermsPostListProps } from '@/types/source';

const QUERY_PAGE_KEY = 'p';
const ITEMS_PER_PAGE = 5;

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
  const currentPageFromQuery = searchParams.get(QUERY_PAGE_KEY) ? Number(searchParams.get(QUERY_PAGE_KEY)) : 1;
  const [currentPage, setCurrentPage] = useState(currentPageFromQuery);

  const postsToDisplay = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return posts.slice(startIndex, endIndex);
  }, [currentPage, posts]);

  // currentPageFromQueryに応じてページネーションの表示を変更する
  useEffect(() => {
    setCurrentPage(currentPageFromQuery);
  }, [currentPageFromQuery]);

  const handlePageChange = (page: number) => {
    // クエリパラメータ（?p=2）を更新する
    const params = new URLSearchParams(searchParams.toString());
    params.set(QUERY_PAGE_KEY, page.toString());
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
    <>
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
        pageSize={ITEMS_PER_PAGE}
      />
    </>
  );
}
