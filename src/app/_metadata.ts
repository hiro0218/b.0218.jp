import type { Metadata } from 'next/types';
import type { PageSlug } from '@/components/Page/Single/types';
import { SCREEN_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/constant';

export const openGraph: Metadata['openGraph'] = {
  type: 'website',
  url: SITE_URL,
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  locale: 'ja_JP',
  images: [
    {
      url: SCREEN_IMAGE,
      alt: SITE_NAME,
    },
  ],
};

type GetMetadataProps = {
  title: string;
  description: string;
  url: string;
  alternates?: Metadata['alternates'];
  openGraph?: Metadata['openGraph'];
  twitter?: Metadata['twitter'];
  robots?: Metadata['robots'];
  other?: Metadata['other'];
};

export const getMetadata = ({
  title,
  description,
  url,
  alternates,
  openGraph: customOpenGraph,
  twitter,
  robots,
  other,
}: GetMetadataProps): Metadata => {
  const pageTitle = `${title} - ${SITE_NAME}`;

  return {
    title: pageTitle,
    description: description,
    alternates: {
      canonical: url,
      ...alternates,
    },
    openGraph: {
      ...openGraph,
      url: url,
      title: pageTitle,
      description: description,
      ...customOpenGraph,
    },
    twitter,
    robots,
    other,
  };
};

/**
 * ページ設定情報の型
 */
export type PageConfig = {
  title: string;
  description: string;
};

/**
 * ページの設定情報
 */
export const PAGE_CONFIGS: Record<PageSlug, PageConfig> = {
  about: {
    title: 'About',
    description: 'サイトと運営者について',
  },
  privacy: {
    title: 'Privacy',
    description: 'プライバシーポリシー',
  },
};
