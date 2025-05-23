'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PaginationComponent } from './components/PaginationComponent';
import { ITEMS_PER_PAGE, QUERY_PAGE_KEY } from './constant';

type PaginationProps = {
  totalItems: number;
};

/**
 * ページネーションコンポーネント
 * @param totalItems - 全アイテム数
 */
export function Pagination({ totalItems }: PaginationProps) {
  const defaultPage = 1;
  const searchParams = useSearchParams();
  const pageNumberFromUrl = searchParams?.get(QUERY_PAGE_KEY) ? Number(searchParams.get(QUERY_PAGE_KEY)) : defaultPage;
  const [activePage, setActivePage] = useState(defaultPage);

  // pageNumberFromUrlに応じてページネーションの表示を変更する
  useEffect(() => {
    if (activePage !== pageNumberFromUrl) {
      setActivePage(pageNumberFromUrl);
    }
  }, [pageNumberFromUrl, activePage]);

  const handlePageChange = (page: number) => {
    // クエリパラメータ（?p=2）を更新する
    if (searchParams) {
      const urlParams = new URLSearchParams(searchParams.toString());
      urlParams.set(QUERY_PAGE_KEY, page.toString());
      /** @note ViewTransitionに干渉しないようにネイティブ実装 */
      window.history.replaceState(null, '', `?${urlParams.toString()}`);
      setActivePage(page);
    }
  };

  return (
    <PaginationComponent
      currentPage={activePage}
      onPageChange={handlePageChange}
      pageSize={ITEMS_PER_PAGE}
      totalCount={totalItems}
    />
  );
}
