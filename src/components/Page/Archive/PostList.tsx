'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import LinkCard from '@/components/UI/LinkCard';
import { convertPostSlugToPath } from '@/lib/url';
import type { ArticleSummary } from '@/types/source';
import { ARCHIVE_CONFIG } from './constants';
import { parsePageNumber } from './utils/parsePageNumber';

type PostListProps = {
  posts: ArticleSummary[];
};

/**
 * 記事リストコンポーネント（ページネーション対応）
 * @param posts 記事サマリーの配列
 */
export function PostList({ posts }: PostListProps) {
  const searchParams = useSearchParams();
  const currentPage = parsePageNumber(searchParams.get(ARCHIVE_CONFIG.queryKey));

  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * ARCHIVE_CONFIG.itemsPerPage;
    const endIndex = startIndex + ARCHIVE_CONFIG.itemsPerPage;
    return posts.slice(startIndex, endIndex);
  }, [currentPage, posts]);

  return (
    <>
      {paginatedPosts.map(({ date, slug, title, updated }) => {
        const link = convertPostSlugToPath(slug);
        return <LinkCard date={date} key={slug} link={link} title={title} updated={updated} />;
      })}
    </>
  );
}
