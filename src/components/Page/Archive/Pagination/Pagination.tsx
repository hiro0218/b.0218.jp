'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PaginationComponent } from './PaginationComponent';
import { ITEMS_PER_PAGE, QUERY_PAGE_KEY } from './constant';

type PaginationProps = {
  totalItems: number;
};

export function Pagination({ totalItems }: PaginationProps) {
  const searchParams = useSearchParams();
  const currentPageFromQuery = searchParams.get(QUERY_PAGE_KEY) ? Number(searchParams.get(QUERY_PAGE_KEY)) : 1;
  const [pageState, setPageState] = useState(currentPageFromQuery);

  // currentPageFromQueryに応じてページネーションの表示を変更する
  useEffect(() => {
    if (pageState !== currentPageFromQuery) {
      setPageState(currentPageFromQuery);
    }
  }, [currentPageFromQuery, pageState]);

  const handlePageChange = (page: number) => {
    // クエリパラメータ（?p=2）を更新する
    const params = new URLSearchParams(searchParams.toString());
    params.set(QUERY_PAGE_KEY, page.toString());
    /** @note ViewTransitionに干渉しないようにネイティブ実装 */
    window.history.replaceState(null, '', `?${params.toString()}`);
    setPageState(page);
  };

  return (
    <PaginationComponent
      onPageChange={handlePageChange}
      totalCount={totalItems}
      currentPage={pageState}
      pageSize={ITEMS_PER_PAGE}
    />
  );
}
