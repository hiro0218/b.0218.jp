/**
 * aboutページの設定
 */
import type { AboutPage, WithContext } from 'schema-dts';
import { AUTHOR } from '@/components/Page/SinglePage/schema';
import type { SinglePageConfig } from '@/components/Page/SinglePage/types';

export const pageConfig: SinglePageConfig = {
  slug: 'about',
  title: 'About',
  description: 'サイトと運営者について',
};

export const createStructuredData = (): WithContext<AboutPage> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: pageConfig.title,
    description: pageConfig.description,
    author: AUTHOR,
  };
};
