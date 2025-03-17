import { getMetadata } from '@/app/(ArchivePage)/metadata';
import { SITE_NAME, SITE_URL, TAG_VIEW_LIMIT } from '@/constant';
import { getTagsWithCount } from '@/lib/posts';
import { getTagPosts } from '@/pages/_libs/getTagPosts';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import TagPage from './components/TagPage';

export async function generateStaticParams() {
  const tags = getTagsWithCount();

  return tags
    .filter((tag) => tag.count >= TAG_VIEW_LIMIT)
    .map((tag) => ({
      // @note https://github.com/vercel/next.js/issues/63002
      slug: process.env.NODE_ENV === 'production' ? tag.slug : encodeURIComponent(tag.slug),
    }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  return getMetadata({
    title: `Tag: ${decodedSlug}`,
    description: `Tag: ${decodedSlug} - ${SITE_NAME}`,
    url: `${SITE_URL}/tags/${slug}`,
  });
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const posts = getTagPosts(decodedSlug);
  const totalItems = posts.length;

  return (
    <Suspense>
      <TagPage slug={decodedSlug} posts={posts} totalItems={totalItems} />
    </Suspense>
  );
}
