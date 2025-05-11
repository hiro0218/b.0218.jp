/**
 * privacyページの設定
 */
import type { Metadata } from 'next/types';
import type { WebPage, WithContext } from 'schema-dts';
import { createMetadata } from '@/components/Page/SinglePage/metadata';
import { AUTHOR } from '@/components/Page/SinglePage/schema';
import type { PageConfig } from '@/components/Page/SinglePage/Template';
import { SITE_URL } from '@/constant';

export const pageConfig: PageConfig = {
  slug: 'privacy',
  title: 'Privacy',
  description: 'プライバシーポリシー',
};

export const createPageMetadata = (): Metadata => {
  return createMetadata({
    title: pageConfig.title,
    description: pageConfig.description,
    url: `${SITE_URL}/${pageConfig.slug}`,
  });
};

export const createStructuredData = (): WithContext<WebPage> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: pageConfig.title,
    description: pageConfig.description,
    author: AUTHOR,
  };
};
