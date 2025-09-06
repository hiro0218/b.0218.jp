'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PaginationView } from './components/PaginationView';
import { ITEMS_PER_PAGE, QUERY_PAGE_KEY } from './hooks/constant';

type PaginationCoreProps = {
  totalItems: number;
};

/**
 * ページネーションコンポーネント
 * URL状態管理とページ変更ハンドリングを担当
 * @param totalItems - 全アイテム数
 */
export function PaginationCore({ totalItems }: PaginationCoreProps) {
  const defaultPage = 1;
  const searchParams = useSearchParams();
  const pageNumberFromUrl = searchParams?.get(QUERY_PAGE_KEY) ? Number(searchParams.get(QUERY_PAGE_KEY)) : defaultPage;
  const [activePage, setActivePage] = useState(defaultPage);

  // Update active page when URL parameter changes
  useEffect(() => {
    if (activePage !== pageNumberFromUrl) {
      setActivePage(pageNumberFromUrl);
    }
  }, [pageNumberFromUrl, activePage]);

  const handlePageChange = (page: number) => {
    // Update query parameter (?p=2) in the URL
    if (searchParams) {
      const urlParams = new URLSearchParams(searchParams.toString());
      urlParams.set(QUERY_PAGE_KEY, page.toString());
      /** @note Native implementation to avoid ViewTransition interference */
      window.history.replaceState(null, '', `?${urlParams.toString()}`);
      setActivePage(page);
    }
  };

  return (
    <PaginationView
      currentPage={activePage}
      onPageChange={handlePageChange}
      pageSize={ITEMS_PER_PAGE}
      totalCount={totalItems}
    />
  );
}
