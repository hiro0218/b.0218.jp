import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMetadata } from '@/app/_metadata';
import { StructuredData } from '@/components/Functional/StructuredData';
import { PostSection } from '@/components/Page/_shared/PostSection';
import { TagSection } from '@/components/Page/_shared/TagSection';
import { Pagination } from '@/components/Page/Archive/Pagination';
import { Stack } from '@/components/UI/Layout/Stack';
import { Title } from '@/components/UI/Title';
import { SITE_NAME } from '@/constants';
import { getCollectionPageStructured } from '@/lib/domain/json-ld';
import { getTagPosts } from '@/lib/post/tagPosts';
import { getSimilarTag } from '@/lib/tag/derived';
import { tagFeedPermalink } from '@/lib/tag/navigation';
import { getRoutableTagStaticParams, getRoutableTags } from '@/lib/tag/routing';
import { tagFromUrlPath } from '@/lib/tag/url';
import type { StaticTagPageParam } from './tagArchiveModel';
import {
  createTagArchiveMetadataModel,
  createTagArchivePageModel,
  createTagArchivePaginationStaticParams,
  parseTagPageSegment,
} from './tagArchiveModel';

type TagArchiveMetadataOptions = {
  slug: string;
  currentPage?: number;
};

type TagArchivePageProps = {
  slug: string;
  currentPage?: number;
};

const LIMIT_SIMILAR_TAGS = 10;

// タグページとして存在する（閲覧可能な）タグとその記事数。getRoutableTags() は
// TAG_VIEW_LIMIT 以上のタグのみを既に絞り込んでキャッシュ済みなので、ここでは
// 生のタグ→記事索引を読み直さず参照するだけにする。
const routableTagCounts = new Map(getRoutableTags().map((tag) => [tag.slug, tag.count]));
const similarTagsIndex = getSimilarTag();

function getSimilarTags(tag: string): Array<{ slug: string; count: number; isNavigable: boolean }> {
  const similarTags = similarTagsIndex[tag];
  if (!similarTags) {
    return [];
  }

  const validTags: Array<{ slug: string; count: number; isNavigable: boolean }> = [];

  for (const slug of Object.keys(similarTags)) {
    const count = routableTagCounts.get(slug);

    if (count !== undefined) {
      validTags.push({ slug, count, isNavigable: true });
    }
  }

  return validTags.toSorted((a, b) => b.count - a.count).slice(0, LIMIT_SIMILAR_TAGS);
}

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
          { title: decodedSlug, url: tagFeedPermalink(decodedSlug) },
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

  const similarTags = getSimilarTags(decodedSlug);

  return (
    <>
      <StructuredData
        data={getCollectionPageStructured({
          name: model.structuredData.name,
          description: model.structuredData.description,
        })}
      />
      <Stack as="section" gap={600}>
        <Title
          paragraph={
            currentPage > 1 ? `${model.totalItems}件の記事（${currentPage}ページ目）` : `${model.totalItems}件の記事`
          }
        >
          {model.tag}
        </Title>
        <PostSection layout="timeline" posts={model.posts} />
        <Pagination pagination={model.pagination} />
        <TagSection
          as="aside"
          heading="関連タグ"
          headingLevel="h2"
          headingWeight="normal"
          isWideCluster={false}
          tags={similarTags}
        />
      </Stack>
    </>
  );
}

export { parseTagPageSegment };
