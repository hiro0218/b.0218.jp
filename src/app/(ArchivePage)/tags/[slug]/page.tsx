import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getTagPosts } from '@/app/_lib/getTagPosts';
import { getMetadata } from '@/app/_metadata';
import { StructuredData } from '@/components/Functional/StructuredData';
import { Pagination } from '@/components/Page/Archive/Pagination';
import { PostList } from '@/components/Page/Archive/PostList';
import { Sidebar, Stack } from '@/components/UI/Layout';
import { Spinner } from '@/components/UI/Spinner';
import { Title } from '@/components/UI/Title';
import { SITE_NAME, SITE_URL, TAG_VIEW_LIMIT } from '@/constants';
import { isProduction } from '@/lib/config/environment';
import { getCollectionPageStructured } from '@/lib/domain/json-ld';
import { getTagsWithCount } from '@/lib/tag/data';
import { tagFromUrlPath, tagUrlPath } from '@/lib/tag/url';

type Params = Promise<{ slug: string }>;

const pageTitle = 'Tag';

export async function generateStaticParams() {
  const tags = getTagsWithCount();

  return tags
    .filter((tag) => tag.count >= TAG_VIEW_LIMIT)
    .map((tag) => ({
      // @note https://github.com/vercel/next.js/issues/63002
      slug: isProduction ? tag.slug : tagUrlPath(tag.slug),
    }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = tagFromUrlPath(slug);
  const title = `Tag: ${decodedSlug}`;

  return getMetadata({
    title,
    description: `${title} - ${SITE_NAME}`,
    // canonical URL は実際のページ URL（generateStaticParams が産出する raw slug）と
    // 一致させる必要があるため、エンコードせずそのまま使う。sitemap.ts:49 も同形式。
    url: `${SITE_URL}/tags/${slug}`,
  });
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const decodedSlug = tagFromUrlPath(slug);
  const posts = getTagPosts(decodedSlug);

  if (!posts) {
    return notFound();
  }

  const totalItems = posts.length;

  return (
    <>
      <StructuredData
        data={getCollectionPageStructured({
          name: `Tag: ${decodedSlug}`,
          description: `Tag: ${decodedSlug} - ${SITE_NAME}`,
        })}
      />
      <Stack as="section" gap={4}>
        <Title paragraph={`${totalItems}件の記事`}>{pageTitle}</Title>
        <Sidebar>
          <Sidebar.Side>
            <Sidebar.Title>{decodedSlug}</Sidebar.Title>
          </Sidebar.Side>
          <Sidebar.Main>
            <Stack>
              <Suspense fallback={<Spinner />}>
                <PostList posts={posts} />
              </Suspense>
            </Stack>
          </Sidebar.Main>
        </Sidebar>
        <Suspense>
          <Pagination totalItems={totalItems} />
        </Suspense>
      </Stack>
    </>
  );
}
