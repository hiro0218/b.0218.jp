import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMetadata } from '@/app/_metadata';
import { StructuredData } from '@/components/Functional/StructuredData';
import { Pagination } from '@/components/Page/Archive/Pagination';
import { ArticleCard } from '@/components/UI/ArticleCard';
import { Sidebar } from '@/components/UI/Layout/Sidebar';
import { Stack } from '@/components/UI/Layout/Stack';
import { Title } from '@/components/UI/Title';
import { TAG_VIEW_LIMIT } from '@/constants';
import { isProduction } from '@/lib/config/environment';
import { getCollectionPageStructured } from '@/lib/domain/json-ld';
import { getTagPosts } from '@/lib/post/tagPosts';
import { getTagsWithCount } from '@/lib/source/tag';
import { tagFromUrlPath, tagUrlPath } from '@/lib/tag/url';
import { convertPostSlugToPath } from '@/lib/utils/url';
import {
  createTagArchiveMetadataModel,
  createTagArchivePageModel,
  createTagArchivePaginationStaticParams,
  parseTagPageSegment,
} from './tagArchiveModel';

type StaticTagParam = {
  slug: string;
};

type StaticTagPageParam = StaticTagParam & {
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

function getRoutableTags() {
  return getTagsWithCount().filter((tag) => tag.count >= TAG_VIEW_LIMIT);
}

function getStaticSlugParam(slug: string): string {
  // production は sitemap/canonical と同じ raw Tag を使い、dev だけ手元確認用に URL-safe へ寄せる。
  // @note https://github.com/vercel/next.js/issues/63002
  return isProduction ? slug : tagUrlPath(slug);
}

export function getTagStaticParams(): StaticTagParam[] {
  return getRoutableTags().map((tag) => ({
    slug: getStaticSlugParam(tag.slug),
  }));
}

export function getTagPaginationStaticParams(): StaticTagPageParam[] {
  return getRoutableTags().flatMap((tag) => {
    return createTagArchivePaginationStaticParams(getStaticSlugParam(tag.slug), tag.count);
  });
}

export function getTagArchiveMetadata({ slug, currentPage = 1 }: TagArchiveMetadataOptions): Metadata {
  const decodedSlug = tagFromUrlPath(slug);
  const metadata = createTagArchiveMetadataModel({ routeSlug: slug, tag: decodedSlug, currentPage });

  return getMetadata({
    title: metadata.title,
    description: metadata.description,
    url: metadata.canonicalUrl,
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
      <Stack as="section" gap={4}>
        <Title paragraph={`${model.totalItems}件の記事`}>{pageTitle}</Title>
        <Sidebar>
          <Sidebar.Side>
            <Sidebar.Title>#{model.tag}</Sidebar.Title>
          </Sidebar.Side>
          <Sidebar.Main>
            <Stack>
              {model.posts.map(({ date, slug, title, updated }) => {
                return (
                  <ArticleCard
                    date={date}
                    key={slug}
                    link={convertPostSlugToPath(slug)}
                    title={title}
                    updated={updated}
                  />
                );
              })}
            </Stack>
          </Sidebar.Main>
        </Sidebar>
        <Pagination pagination={model.pagination} />
      </Stack>
    </>
  );
}

export { parseTagPageSegment };
