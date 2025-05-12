/**
 * シングルページ用のメタデータ生成
 */
import type { Metadata } from 'next/types';
import { openGraph } from '@/app/_metadata';
import { SITE_NAME, SITE_URL } from '@/constant';
import type { PageSlug } from './types';

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

/**
 * メタデータ生成用の関数
 * @param slug - ページのスラグ（about または privacy）
 * @returns メタデータの生成に必要な情報
 */
export const getMetadataParams = (slug: PageSlug) => {
  const { title, description } = PAGE_CONFIGS[slug];
  return {
    title,
    description,
    url: `${SITE_URL}/${slug}`,
  };
};

export type MetadataParams = ReturnType<typeof getMetadataParams>;

/**
 * メタデータ生成関数
 * @param params - メタデータパラメータ
 * @returns Next.jsのMetadata
 */
export const createMetadata = (params: MetadataParams): Metadata => {
  const { title, description, url } = params;
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

/**
 * スラグからメタデータを生成する簡易関数
 * @param slug - ページのスラグ（about または privacy）
 * @returns Nextのメタデータオブジェクト
 */
export const createMetadataFromSlug = (slug: PageSlug): Metadata => {
  return createMetadata(getMetadataParams(slug));
};
