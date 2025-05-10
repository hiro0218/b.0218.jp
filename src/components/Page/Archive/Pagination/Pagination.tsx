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
 * 初期表示時にも基本的な構造を表示し、クライアントサイドのハイドレーション後に完全な機能を提供する
 * @param totalItems - 全アイテム数
 */
export function Pagination({ totalItems }: PaginationProps) {
  // サーバーサイドレンダリング時のための初期値を設定
  const defaultPage = 1;
  const searchParams = useSearchParams();
  // クライアントサイドで実行される場合はクエリパラメータから取得、そうでなければデフォルト値を使用
  const pageNumberFromUrl = searchParams?.get(QUERY_PAGE_KEY) ? Number(searchParams.get(QUERY_PAGE_KEY)) : defaultPage;
  const [activePage, setActivePage] = useState(defaultPage);

  // ハイドレーション後にクエリパラメータに基づいてページ状態を更新
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
      onPageChange={handlePageChange}
      totalCount={totalItems}
      currentPage={activePage}
      pageSize={ITEMS_PER_PAGE}
    />
  );
}
