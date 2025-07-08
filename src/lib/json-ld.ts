import type {
  AboutPage,
  BlogPosting,
  BreadcrumbList,
  CollectionPage,
  ListItem,
  Organization,
  WebPage,
  WithContext,
} from 'schema-dts';

import { AUTHOR_ICON, AUTHOR_NAME, SITE_NAME, SITE_URL, URL } from '@/constant';
import type { PostProps } from '@/types/source';

import { getOgpImage, getPermalink } from './url';

export const AUTHOR = {
  '@type': 'Person',
  name: AUTHOR_NAME,
  image: AUTHOR_ICON,
  url: SITE_URL,
  sameAs: [...Object.values(URL)],
  jobTitle: 'Frontend Developer',
} as const;

export const getDescriptionText = (postContent: string): string => {
  return postContent
    .replace(/(?:\r\n|\r|\n)/g, ' ') // 改行をスペースに置換
    .replace(/<\/?[^>]+(>|$)/g, '') // HTMLタグを削除
    .replace(/\s+/g, ' ') // 連続するスペースを1つのスペースに置換
    .trim() // 先頭と末尾のスペースを削除
    .substring(0, 140); // 140文字に切り詰め
};

export const getAboutPageStructured = ({
  name,
  description,
}: {
  name: string;
  description: string;
}): WithContext<AboutPage> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: name,
    description: description,
    author: {
      ...AUTHOR,
    },
  };
};

export const getWebPageStructured = ({
  name,
  description,
  listItem,
}: {
  name: string;
  description: string;
  listItem?: ListItem[];
}): WithContext<WebPage> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: name,
    description: description,
    ...(!!listItem && {
      mainEntity: {
        '@type': 'ItemList',
        listItem,
      },
    }),
  };
};

export const getBlogPostingStructured = (post: PostProps): WithContext<BlogPosting> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': getPermalink(post.slug),
    },
    headline: post.title,
    datePublished: post.date,
    dateModified: post.updated || post.date,
    ...(!!post.tags && { keywords: post.tags }),
    author: {
      ...AUTHOR,
    },
    description: getDescriptionText(post.content),
    image: [getOgpImage(post.slug)],
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: AUTHOR_ICON,
        width: '400px',
        height: '400px',
      },
    },
  };
};

export const getBreadcrumbStructured = (post: PostProps) => {
  const itemListElement: ListItem[] = [
    {
      '@type': 'ListItem',
      position: 1,
      name: SITE_NAME,
      item: SITE_URL,
    },
  ];

  if (post.tags && post.tags.length > 0) {
    for (let i = 0; i < 1; i++) {
      const tags = post.tags[i];
      itemListElement.push({
        '@type': 'ListItem',
        position: 2,
        name: tags,
        item: `${SITE_URL}/tags/${tags}`,
      });
    }
  }

  itemListElement.push({
    '@type': 'ListItem',
    position: 3,
    name: post.title,
    item: getPermalink(post.slug),
  });

  const structure: WithContext<BreadcrumbList> = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    name: 'パンくずリスト',
    itemListElement: itemListElement,
  };

  return structure;
};

/**
 * @see https://developers.google.com/search/docs/appearance/structured-data/logo?hl=ja
 */
export const getOrganizationStructured = (): WithContext<Organization> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: AUTHOR_ICON,
  };
};

export const getCollectionPageStructured = ({
  name,
  description,
}: {
  name: string;
  description: string;
}): WithContext<CollectionPage> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: name,
    description: description,
  };
};
