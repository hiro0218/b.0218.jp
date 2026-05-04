import type { PaginationModel } from '@/components/Page/Archive/Pagination';
import { SITE_NAME, SITE_URL } from '@/constants';
import { tagPath } from '@/lib/tag/navigation';
import type { ArticleSummary } from '@/types/source';

const TAG_ARCHIVE_ITEMS_PER_PAGE = 10;
const PAGINATION_ELLIPSIS = '...';

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
  pagination: PaginationModel;
};

type StaticTagPageParam = {
  slug: string;
  page: string;
};

function calculateTotalPages(totalItems: number): number {
  if (totalItems <= 0) {
    return 1;
  }

  return Math.ceil(totalItems / TAG_ARCHIVE_ITEMS_PER_PAGE);
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, idx) => idx + start);
}

function getPaginationRange(currentPage: number, totalPages: number): (number | typeof PAGINATION_ELLIPSIS)[] {
  if (totalPages <= 0) {
    return [];
  }

  const siblingCount = 1;
  // 先頭・現在ページ周辺・末尾を常に残すため、表示枠を超えた分だけ ellipsis に畳む。
  const totalPageNumbers = siblingCount + 5;
  if (totalPageNumbers >= totalPages) {
    return range(1, totalPages);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblingCount;
    return [...range(1, leftItemCount), PAGINATION_ELLIPSIS, totalPages];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblingCount;
    return [1, PAGINATION_ELLIPSIS, ...range(totalPages - rightItemCount + 1, totalPages)];
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    return [1, PAGINATION_ELLIPSIS, ...range(leftSiblingIndex, rightSiblingIndex), PAGINATION_ELLIPSIS, totalPages];
  }

  return range(1, totalPages);
}

function getTagArchivePageHref(basePath: string, page: number): string {
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
  return currentPage > 1 ? `Tag: ${tag} - Page ${currentPage}` : `Tag: ${tag}`;
}

function createPaginationModel(tag: string, currentPage: number, totalPages: number): PaginationModel {
  const basePath = tagPath(tag);

  return {
    currentPage,
    totalPages,
    previousHref: currentPage > 1 ? getTagArchivePageHref(basePath, currentPage - 1) : null,
    nextHref: currentPage < totalPages ? getTagArchivePageHref(basePath, currentPage + 1) : null,
    items: getPaginationRange(currentPage, totalPages).map((item, index) => {
      if (item === PAGINATION_ELLIPSIS) {
        return { type: 'ellipsis', key: `ellipsis-${index}` };
      }

      return {
        type: 'page',
        page: item,
        href: getTagArchivePageHref(basePath, item),
        isCurrent: item === currentPage,
      };
    }),
  };
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
  const title = getTagArchiveTitle(tag, currentPage);

  return {
    title,
    description: `${title} - ${SITE_NAME}`,
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
    pagination: createPaginationModel(tag, currentPage, totalPages),
  };
}
