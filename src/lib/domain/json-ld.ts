import type {
  AboutPage,
  BlogPosting,
  BreadcrumbList,
  CollectionPage,
  ListItem,
  Organization,
  ProfilePage,
  WebPage,
  WebSite,
  WithContext,
} from 'schema-dts';

import { AUTHOR_ICON, AUTHOR_NAME, SITE_NAME, SITE_URL, URL } from '@/constants';
import type { PopularityDetail, Post } from '@/types/source';

import { convertToISO8601WithTimezone } from '../utils/date';
import { getOgpImage, getPermalink } from '../utils/url';

const EMOJI_REGEX = /[\p{Extended_Pictographic}\p{Emoji_Component}\p{Regional_Indicator}]/gu;

const AUTHOR = {
  '@type': 'Person',
  name: AUTHOR_NAME,
  image: AUTHOR_ICON,
  url: SITE_URL,
  sameAs: [...Object.values(URL)],
  jobTitle: 'Frontend Developer',
} as const;

export const getDescriptionText = (postContent: string): string => {
  return (
    postContent
      .replace(/(?:\r\n|\r|\n)/g, ' ') // 改行をスペースに置換
      .replace(/<\/?[^>]+(>|$)/g, '') // HTMLタグを削除
      // 絵文字と記号を削除（サロゲートペア対応）
      .replace(EMOJI_REGEX, '')
      .replace(/\s+/g, ' ') // 連続するスペースを1つのスペースに置換
      .trim() // 先頭と末尾のスペースを削除
      // サロゲートペアを考慮した切り詰め
      .slice(0, 160)
  );
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

export const getProfilePageStructured = (): WithContext<ProfilePage> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      ...AUTHOR,
    },
  };
};

export const getWebPageStructured = ({
  name,
  description,
  listItem,
  includeOrganization = false,
}: {
  name: string;
  description: string;
  listItem?: ListItem[];
  includeOrganization?: boolean;
}): WithContext<WebPage> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: name,
    description: description,
    ...(listItem
      ? {
          mainEntity: {
            '@type': 'ItemList',
            listItem,
          },
        }
      : {}),
    ...(includeOrganization
      ? {
          about: {
            '@type': 'Organization',
            name: SITE_NAME,
            url: SITE_URL,
          },
        }
      : {}),
  };
};

export const getBlogPostingStructured = (post: Post, popularity?: PopularityDetail): WithContext<BlogPosting> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': getPermalink(post.slug),
    },
    headline: post.title,
    datePublished: convertToISO8601WithTimezone(post.date),
    dateModified: convertToISO8601WithTimezone(post.updated || post.date),
    ...(post.tags ? { keywords: post.tags } : {}),
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
        width: '400',
        height: '400',
      },
    },
    ...(popularity?.hatena
      ? {
          interactionStatistic: {
            '@type': 'InteractionCounter',
            interactionType: { '@type': 'ShareAction' },
            userInteractionCount: popularity.hatena,
            interactionService: {
              '@type': 'WebSite',
              name: 'Hatena Bookmark',
              url: 'https://b.hatena.ne.jp/',
            },
          },
        }
      : {}),
  };
};

export const getBreadcrumbStructured = (post: Post) => {
  const itemListElement: ListItem[] = [
    {
      '@type': 'ListItem',
      position: 1,
      name: SITE_NAME,
      item: SITE_URL,
    },
  ];

  if (post.tags && post.tags.length > 0) {
    const tags = post.tags[0];
    itemListElement.push({
      '@type': 'ListItem',
      position: 2,
      name: tags,
      item: `${SITE_URL}/tags/${tags}`,
    });
  }

  itemListElement.push({
    '@type': 'ListItem',
    position: itemListElement.length + 1,
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

/**
 * @see https://developers.google.com/search/docs/appearance/site-names?hl=ja
 */
export const getWebSiteStructured = (): WithContext<WebSite> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: ['b.0218.jp'],
    url: SITE_URL,
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
