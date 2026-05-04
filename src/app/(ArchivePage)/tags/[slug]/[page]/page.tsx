import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getTagArchiveMetadata,
  getTagPaginationStaticParams,
  parseTagPageSegment,
  TagArchivePage,
} from '../_lib/tagArchivePage';

type Params = Promise<{ slug: string; page: string }>;

export const dynamicParams = false;

export async function generateStaticParams() {
  return getTagPaginationStaticParams();
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug, page } = await params;
  const currentPage = parseTagPageSegment(page);

  if (!currentPage) {
    notFound();
  }

  return getTagArchiveMetadata({ slug, currentPage });
}

export default async function Page({ params }: { params: Params }) {
  const { slug, page } = await params;
  const currentPage = parseTagPageSegment(page);

  if (!currentPage) {
    notFound();
  }

  return <TagArchivePage currentPage={currentPage} slug={slug} />;
}
