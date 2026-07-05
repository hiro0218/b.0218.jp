import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMetadata } from '@/app/_metadata';
import { StructuredData } from '@/components/Functional/StructuredData';
import { PostTimeline } from '@/components/Page/_shared/PostTimeline';
import { Pagination } from '@/components/Page/Archive/Pagination';
import { Sidebar } from '@/components/UI/Layout/Sidebar';
import { Stack } from '@/components/UI/Layout/Stack';
import { Title } from '@/components/UI/Title';
import { SITE_NAME } from '@/constants';
import { getCollectionPageStructured } from '@/lib/domain/json-ld';
import { getTagPosts } from '@/lib/post/tagPosts';
import { tagFeedPermalink } from '@/lib/tag/navigation';
import { getRoutableTagStaticParams, getRoutableTags } from '@/lib/tag/routing';
import { tagFromUrlPath } from '@/lib/tag/url';
import {
  createTagArchiveMetadataModel,
  createTagArchivePageModel,
  createTagArchivePaginationStaticParams,
  parseTagPageSegment,
} from './tagArchiveModel';

type StaticTagPageParam = {
  slug: string;
  page: string;
};

type TagArchiveMetadataOptions = {
  slug: string;
  currentPage?: number;
};

type TagArchivePageProps = {
  slug: string;
  currentPage?: number;
};

const pageTitle = 'Tag';

export function getTagStaticParams() {
  return getRoutableTagStaticParams();
}

export function getTagPaginationStaticParams(): StaticTagPageParam[] {
  return getRoutableTags().flatMap((tag) => createTagArchivePaginationStaticParams(tag.slug, tag.count));
}

export function getTagArchiveMetadata({ slug, currentPage = 1 }: TagArchiveMetadataOptions): Metadata {
  const decodedSlug = tagFromUrlPath(slug);
  const metadata = createTagArchiveMetadataModel({ routeSlug: slug, tag: decodedSlug, currentPage });

  return getMetadata({
    title: metadata.title,
    description: metadata.description,
    url: metadata.canonicalUrl,
    alternates: {
      types: {
        'application/rss+xml': [
          { title: SITE_NAME, url: '/feed.xml' },
          { title: `Tag: ${decodedSlug}`, url: tagFeedPermalink(decodedSlug) },
        ],
      },
    },
  });
}

export function TagArchivePage({ slug, currentPage = 1 }: TagArchivePageProps) {
  const decodedSlug = tagFromUrlPath(slug);
  const posts = getTagPosts(decodedSlug);

  if (!posts) {
    return notFound();
  }

  const model = createTagArchivePageModel({ routeSlug: slug, tag: decodedSlug, posts, currentPage });
  if (!model) {
    return notFound();
  }

  return (
    <>
      <StructuredData
        data={getCollectionPageStructured({
          name: model.structuredData.name,
          description: model.structuredData.description,
        })}
      />
      <Stack as="section" gap={600}>
        <Title paragraph={`${model.totalItems}件の記事`}>{pageTitle}</Title>
        <Sidebar>
          <Sidebar.Side>
            <Sidebar.Title>#{model.tag}</Sidebar.Title>
          </Sidebar.Side>
          <Sidebar.Main>
            <PostTimeline posts={model.posts} />
          </Sidebar.Main>
        </Sidebar>
        <Pagination pagination={model.pagination} />
      </Stack>
    </>
  );
}

export { parseTagPageSegment };
