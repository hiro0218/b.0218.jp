/**
 * シングルページ用のメタデータ生成
 */
import type { Metadata } from 'next/types';
import { openGraph } from '@/app/_metadata';
import { SITE_NAME } from '@/constant';

type MetadataParams = {
  title: string;
  description: string;
  url: string;
};

export const createMetadata = ({ title, description, url }: MetadataParams): Metadata => {
  const pageTitle = `${title} - ${SITE_NAME}`;

  return {
    title: pageTitle,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      ...openGraph,
      url,
      title: pageTitle,
      description,
    },
  };
};
