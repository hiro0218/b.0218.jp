'use client';

import { useSearchParams } from 'next/navigation';
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
  const startIndex = (currentPage - 1) * ARCHIVE_CONFIG.itemsPerPage;
  const endIndex = startIndex + ARCHIVE_CONFIG.itemsPerPage;
  const paginatedPosts = posts.slice(startIndex, endIndex).map((post) => ({
    ...post,
    link: convertPostSlugToPath(post.slug),
  }));

  return (
    <>
      {paginatedPosts.map(({ date, slug, title, updated, link }) => {
        return <LinkCard date={date} key={slug} link={link} title={title} updated={updated} />;
      })}
    </>
  );
}
