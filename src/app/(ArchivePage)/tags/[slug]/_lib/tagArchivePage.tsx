import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { StaticTagPageParam } from '@/app/(ArchivePage)/tags/[slug]/_lib/tagArchiveModel';
import {
  createTagArchiveMetadataModel,
  createTagArchivePageModel,
  createTagArchivePaginationStaticParams,
  getTagArchivePageHref,
  parseTagPageSegment,
} from '@/app/(ArchivePage)/tags/[slug]/_lib/tagArchiveModel';
import { getMetadata } from '@/app/_metadata';
import { StructuredData } from '@/components/Functional/StructuredData';
import { pageSections } from '@/components/Page/_shared/pageSections';
import { PostSection } from '@/components/Page/_shared/PostSection';
import { TagSection } from '@/components/Page/_shared/TagSection';
import { ArchivePagination } from '@/components/Page/Archive/Pagination';
import { Stack } from '@/components/UI/Layout/Stack';
import { Title } from '@/components/UI/Title';
import { SITE_FEED_PATH, SITE_NAME } from '@/constants';
import { getCollectionPageStructured } from '@/lib/domain/json-ld';
import { getTagPosts } from '@/lib/post/tagPosts';
import { getSimilarTag } from '@/lib/tag/derived';
import { tagFeedPermalink, tagPath } from '@/lib/tag/navigation';
import { getRoutableTagStaticParams, getRoutableTags } from '@/lib/tag/routing';
import { tagFromUrlPath } from '@/lib/tag/url';

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
const routableTagCounts = new Map(getRoutableTags().map((tag) => [tag.name, tag.count]));
const similarTagsIndex = getSimilarTag();

function getSimilarTags(tag: string): Array<{ name: string; count: number; isNavigable: boolean }> {
  const similarTags = similarTagsIndex[tag];
  if (!similarTags) {
    return [];
  }

  const validTags: Array<{ name: string; count: number; isNavigable: boolean }> = [];

  for (const name of Object.keys(similarTags)) {
    const count = routableTagCounts.get(name);

    if (count !== undefined) {
      validTags.push({ name, count, isNavigable: true });
    }
  }

  return validTags.toSorted((a, b) => b.count - a.count).slice(0, LIMIT_SIMILAR_TAGS);
}

export function getTagStaticParams() {
  return getRoutableTagStaticParams();
}

export function getTagPaginationStaticParams(): StaticTagPageParam[] {
  return getRoutableTags().flatMap((tag) => createTagArchivePaginationStaticParams(tag.name, tag.count));
}

export function getTagArchiveMetadata({ slug, currentPage = 1 }: TagArchiveMetadataOptions): Metadata {
  const name = tagFromUrlPath(slug);
  const metadata = createTagArchiveMetadataModel({ routeSlug: slug, tag: name, currentPage });

  return getMetadata({
    title: metadata.title,
    description: metadata.description,
    url: metadata.canonicalUrl,
    alternates: {
      types: {
        'application/rss+xml': [
          { title: SITE_NAME, url: SITE_FEED_PATH },
          { title: name, url: tagFeedPermalink(name) },
        ],
      },
    },
  });
}

export function TagArchivePage({ slug, currentPage = 1 }: TagArchivePageProps) {
  const name = tagFromUrlPath(slug);
  const posts = getTagPosts(name);

  if (!posts) {
    return notFound();
  }

  const model = createTagArchivePageModel({ routeSlug: slug, tag: name, posts, currentPage });
  if (!model) {
    return notFound();
  }

  const similarTags = getSimilarTags(name);
  const basePath = tagPath(name);

  return (
    <>
      <StructuredData
        data={getCollectionPageStructured({
          name: model.structuredData.name,
          description: model.structuredData.description,
        })}
      />
      <Title
        paragraph={
          currentPage > 1 ? `${model.totalItems}件の記事（${currentPage}ページ目）` : `${model.totalItems}件の記事`
        }
      >
        {model.tag}
      </Title>
      <div className={pageSections}>
        <Stack gap={800}>
          <PostSection layout="timeline" posts={model.posts} />
          <ArchivePagination
            currentPage={currentPage}
            getPageHref={(page) => getTagArchivePageHref(basePath, page)}
            totalPages={model.totalPages}
          />
        </Stack>
        <TagSection as="aside" heading="関連タグ" headingLevel="h2" isWideCluster={false} tags={similarTags} />
      </div>
    </>
  );
}

export { parseTagPageSegment };
