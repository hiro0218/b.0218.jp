'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import LinkCard from '@/components/UI/LinkCard';
import { convertPostSlugToPath } from '@/lib/url';
import type { TermsPostListProps } from '@/types/source';
import { ITEMS_PER_PAGE, QUERY_PAGE_KEY } from './hooks/constant';

type PostListProps = {
  posts: TermsPostListProps[];
};

/**
 * 投稿リストをページごとに分割して表示する
 * @param posts - 全投稿リスト
 * @returns ページネーションされた投稿カード群
 */
export function PostList({ posts }: PostListProps) {
  const searchParams = useSearchParams();
  const currentPageNumber = searchParams.get(QUERY_PAGE_KEY) ? Number(searchParams.get(QUERY_PAGE_KEY)) : 1;

  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPageNumber - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return posts.slice(startIndex, endIndex);
  }, [currentPageNumber, posts]);

  return (
    <>
      {paginatedPosts.map(({ date, slug, title, updated }) => {
        const link = convertPostSlugToPath(slug);
        return <LinkCard date={date} key={slug} link={link} title={title} updated={updated} />;
      })}
    </>
  );
}
