import type { Metadata } from 'next';
import { getTagArchiveMetadata, getTagStaticParams, TagArchivePage } from './_lib/tagArchivePage';

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export async function generateStaticParams() {
  return getTagStaticParams();
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;

  return getTagArchiveMetadata({ slug });
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;

  return <TagArchivePage slug={slug} />;
}
