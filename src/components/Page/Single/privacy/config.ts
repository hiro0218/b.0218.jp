/**
 * privacyページの設定
 */
import type { WebPage, WithContext } from 'schema-dts';
import { AUTHOR } from '../schema';
import type { SinglePageConfig } from '../types';

export const pageConfig: SinglePageConfig = {
  slug: 'privacy',
  title: 'Privacy',
  description: 'プライバシーポリシー',
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
