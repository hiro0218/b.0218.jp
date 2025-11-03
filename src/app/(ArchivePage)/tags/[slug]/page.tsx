import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getMetadata } from '@/app/_metadata';
import { getTagPosts } from '@/app/libs/getTagPosts';
import { JsonLdScript } from '@/components/Functional/JsonLdScript';
import { Pagination } from '@/components/Page/Archive/Pagination';
import { PostList } from '@/components/Page/Archive/PostList';
import { Sidebar, Stack } from '@/components/UI/Layout';
import { Loading } from '@/components/UI/Loading';
import { Title } from '@/components/UI/Title';
import { SITE_NAME, SITE_URL, TAG_VIEW_LIMIT } from '@/constant';
import { getTagsWithCount } from '@/lib/data/posts';
import { getCollectionPageStructured } from '@/lib/domain/json-ld';

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
  const title = `Tag: ${decodedSlug}`;

  return getMetadata({
    title,
    description: `${title} - ${SITE_NAME}`,
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
    <>
      <JsonLdScript
        jsonLd={getCollectionPageStructured({
          name: `Tag: ${decodedSlug}`,
          description: `Tag: ${decodedSlug} - ${SITE_NAME}`,
        })}
      />
      <Stack as="section" space={4}>
        <Title heading={pageTitle} paragraph={`${totalItems}件の記事`} />
        <Sidebar>
          <Sidebar.Side>
            <Sidebar.Title>{decodedSlug}</Sidebar.Title>
          </Sidebar.Side>
          <Sidebar.Main>
            <Stack>
              <Suspense fallback={<Loading />}>
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
