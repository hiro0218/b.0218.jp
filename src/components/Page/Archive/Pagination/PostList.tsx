'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import LinkCard from '@/components/UI/LinkCard';
import { convertPostSlugToPath } from '@/lib/url';
import type { TermsPostListProps } from '@/types/source';
import { ITEMS_PER_PAGE, QUERY_PAGE_KEY } from './constant';

type PostListProps = {
  posts: TermsPostListProps[];
};

export function PostList({ posts }: PostListProps) {
  const searchParams = useSearchParams();
  const currentPage = searchParams.get(QUERY_PAGE_KEY) ? Number(searchParams.get(QUERY_PAGE_KEY)) : 1;

  const postsToDisplay = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return posts.slice(startIndex, endIndex);
  }, [currentPage, posts]);

  return (
    <>
      {postsToDisplay.map(({ date, slug, title, updated }) => {
        const link = convertPostSlugToPath(slug);
        return <LinkCard date={date} key={slug} link={link} title={title} updated={updated} />;
      })}
    </>
  );
}
