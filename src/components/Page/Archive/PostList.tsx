'use client';

import { useSearchParams } from 'next/navigation';
import ArticleCard from '@/components/UI/ArticleCard';
import { convertPostSlugToPath } from '@/lib/utils/url';
import type { ArticleSummary } from '@/types/source';
import { ARCHIVE_CONFIG } from './constants';
import { calculateTotalPages, parsePageNumber } from './utils/parsePageNumber';

type PostListProps = {
  posts: ArticleSummary[];
};

/**
 * 記事リストコンポーネント（ページネーション対応）
 * @param posts 記事サマリーの配列
 */
export function PostList({ posts }: PostListProps) {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get(ARCHIVE_CONFIG.queryKey);
  const totalPages = calculateTotalPages(posts.length, ARCHIVE_CONFIG.itemsPerPage);
  const currentPage = parsePageNumber(pageParam, 1, totalPages);

  const startIndex = (currentPage - 1) * ARCHIVE_CONFIG.itemsPerPage;
  const endIndex = startIndex + ARCHIVE_CONFIG.itemsPerPage;
  const paginatedPosts = posts.slice(startIndex, endIndex).map((post) => ({
    ...post,
    link: convertPostSlugToPath(post.slug),
  }));

  return (
    <>
      {paginatedPosts.map(({ date, slug, title, updated, link }) => {
        return <ArticleCard date={date} key={slug} link={link} title={title} updated={updated} />;
      })}
    </>
  );
}
