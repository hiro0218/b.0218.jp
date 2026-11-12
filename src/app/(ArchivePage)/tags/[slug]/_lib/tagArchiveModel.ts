import { SITE_URL } from '@/constants';
import type { ArticleSummary } from '@/types/source';

const TAG_ARCHIVE_ITEMS_PER_PAGE = 10;

type TagArchiveMetadataModel = {
  title: string;
  description: string;
  canonicalUrl: string;
};

type TagArchivePageModelOptions = {
  routeSlug: string;
  tag: string;
  posts: ArticleSummary[];
  currentPage: number;
};

type TagArchivePageModel = {
  tag: string;
  posts: ArticleSummary[];
  totalItems: number;
  metadata: TagArchiveMetadataModel;
  structuredData: {
    name: string;
    description: string;
  };
  totalPages: number;
};

export type StaticTagPageParam = {
  slug: string;
  page: string;
};

function calculateTotalPages(totalItems: number): number {
  if (totalItems <= 0) {
    return 1;
  }

  return Math.ceil(totalItems / TAG_ARCHIVE_ITEMS_PER_PAGE);
}

export function getTagArchivePageHref(basePath: string, page: number): string {
  const normalizedBasePath = basePath.endsWith('/') && basePath !== '/' ? basePath.slice(0, -1) : basePath;

  if (page <= 1) {
    return normalizedBasePath;
  }

  return `${normalizedBasePath}/${page}`;
}

function getTagArchiveCanonicalUrl(routeSlug: string, currentPage: number): string {
  const path = currentPage > 1 ? `/tags/${routeSlug}/${currentPage}` : `/tags/${routeSlug}`;

  return `${SITE_URL}${path}`;
}

function getTagArchiveTitle(tag: string, currentPage: number): string {
  // 主題はタグ名。英語の "Tag:" / "Page N" は本文言語とずれ、title link の差し替え対象になる。
  return currentPage > 1 ? `${tag}（${currentPage}ページ目）` : tag;
}

function getTagArchiveDescription(tag: string, currentPage: number): string {
  const description = `${tag}の記事一覧`;

  return currentPage > 1 ? `${description}（${currentPage}ページ目）` : description;
}

export function parseTagPageSegment(page: string): number | null {
  const pageNumber = Number(page);

  // 1ページ目は /tags/<TagUrlPath> に正規化し、重複 URL を作らない。
  if (!Number.isInteger(pageNumber) || pageNumber < 2) {
    return null;
  }

  return pageNumber;
}

export function createTagArchiveMetadataModel({
  routeSlug,
  tag,
  currentPage = 1,
}: {
  routeSlug: string;
  tag: string;
  currentPage?: number;
}): TagArchiveMetadataModel {
  return {
    title: getTagArchiveTitle(tag, currentPage),
    description: getTagArchiveDescription(tag, currentPage),
    canonicalUrl: getTagArchiveCanonicalUrl(routeSlug, currentPage),
  };
}

export function createTagArchivePaginationStaticParams(routeSlug: string, totalItems: number): StaticTagPageParam[] {
  const totalPages = calculateTotalPages(totalItems);

  // 1ページ目は親 route の責務なので、子 route では 2ページ目以降だけを静的生成する。
  if (totalPages <= 1) {
    return [];
  }

  return Array.from({ length: totalPages - 1 }, (_, index) => ({
    slug: routeSlug,
    page: String(index + 2),
  }));
}

export function createTagArchivePageModel({
  routeSlug,
  tag,
  posts,
  currentPage,
}: TagArchivePageModelOptions): TagArchivePageModel | null {
  const totalItems = posts.length;
  const totalPages = calculateTotalPages(totalItems);

  if (currentPage < 1 || currentPage > totalPages) {
    return null;
  }

  const startIndex = (currentPage - 1) * TAG_ARCHIVE_ITEMS_PER_PAGE;
  const endIndex = startIndex + TAG_ARCHIVE_ITEMS_PER_PAGE;
  const metadata = createTagArchiveMetadataModel({ routeSlug, tag, currentPage });

  return {
    tag,
    posts: posts.slice(startIndex, endIndex),
    totalItems,
    metadata,
    structuredData: {
      name: metadata.title,
      description: metadata.description,
    },
    totalPages,
  };
}
