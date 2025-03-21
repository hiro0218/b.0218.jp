import { getMetadata } from '@/app/(ArchivePage)/metadata';
import { getTagPosts } from '@/app/libs/getTagPosts';
import { Stack } from '@/components/UI/Layout';
import { Title } from '@/components/UI/Title';
import { SITE_NAME, SITE_URL, TAG_VIEW_LIMIT } from '@/constant';
import { getTagsWithCount } from '@/lib/posts';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import TagPage from './TagPage';

type Params = Promise<{ slug: string }>;

const pageTitle = 'Tag';

export async function generateStaticParams() {
  const tags = getTagsWithCount();

  return tags
    .filter((tag) => tag.count >= TAG_VIEW_LIMIT)
    .map((tag) => ({
      // @note https://github.com/vercel/next.js/issues/63002
      slug: process.env.NODE_ENV === 'production' ? tag.slug : encodeURIComponent(tag.slug),
    }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  return getMetadata({
    title: `Tag: ${decodedSlug}`,
    description: `Tag: ${decodedSlug} - ${SITE_NAME}`,
    url: `${SITE_URL}/tags/${slug}`,
  });
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const posts = getTagPosts(decodedSlug);

  if (!posts) {
    return notFound();
  }

  const totalItems = posts.length;

  return (
    <Stack as="section" space={4}>
      <Title heading={pageTitle} paragraph={`${totalItems}件の記事`} />
      <Suspense>
        <TagPage slug={decodedSlug} posts={posts} totalItems={totalItems} />
      </Suspense>
    </Stack>
  );
}
