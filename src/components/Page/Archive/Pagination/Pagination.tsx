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
  const initialPage = 1;
  const searchParams = useSearchParams();
  // クライアントサイドで実行される場合はクエリパラメータから取得、そうでなければデフォルト値を使用
  const currentPageFromQuery = searchParams?.get(QUERY_PAGE_KEY)
    ? Number(searchParams.get(QUERY_PAGE_KEY))
    : initialPage;
  const [pageState, setPageState] = useState(initialPage);

  // ハイドレーション後にクエリパラメータに基づいてページ状態を更新
  useEffect(() => {
    if (pageState !== currentPageFromQuery) {
      setPageState(currentPageFromQuery);
    }
  }, [currentPageFromQuery, pageState]);

  const handlePageChange = (page: number) => {
    // クエリパラメータ（?p=2）を更新する
    if (searchParams) {
      const params = new URLSearchParams(searchParams.toString());
      params.set(QUERY_PAGE_KEY, page.toString());
      /** @note ViewTransitionに干渉しないようにネイティブ実装 */
      window.history.replaceState(null, '', `?${params.toString()}`);
      setPageState(page);
    }
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
