import { BlogPosting, BreadcrumbList, ListItem, WithContext } from 'schema-dts';

import { AUTHOR, SITE, URL } from '@/constant';
import { Post } from '@/types/source';

export const getDescriptionText = (postContent: string): string => {
  return (
    postContent
      // strip line break
      .replace(/(?:\r\n|\r|\n)/g, '')
      // strip tag
      .replace(/<\/?[^>]+(>|$)/g, '')
      // delete consecutive spaces
      .trim()
      .replace(/\s{2,}/gu, ' ')
      // character extraction
      .substring(0, 140)
  );
};

export const getBlogPostingStructured = (post: Post): WithContext<BlogPosting> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE.URL}${post.slug}.html`,
    },
    headline: post.title,
    datePublished: post.date,
    dateModified: post.updated || post.date,
    author: {
      '@type': 'Person',
      name: AUTHOR.NAME,
      url: [URL.SITE, URL.TWITTER, URL.GITHUB, URL.QIITA, URL.ZENN],
      jobTitle: 'Frontend Developer',
    },
    description: getDescriptionText(post.content),
    image: [`${SITE.URL}images/ogp/${post.slug}.webp`],
    publisher: {
      '@type': 'Organization',
      name: SITE.NAME,
      logo: {
        '@type': 'ImageObject',
        url: AUTHOR.ICON,
        width: '400px',
        height: '400px',
      },
    },
  };
};

export const getBreadcrumbStructured = (post: Post) => {
  const itemListElement: ListItem[] = [
    {
      '@type': 'ListItem',
      position: 1,
      name: SITE.NAME,
      item: SITE.URL,
    },
  ];

  if (post.tags && post.tags.length > 0) {
    for (let i = 0; i < 1; i++) {
      const tags = post.tags[i];
      itemListElement.push({
        '@type': 'ListItem',
        position: 2,
        name: tags,
        item: `${SITE.URL}tags/${tags}`,
      });
    }
  }

  itemListElement.push({
    '@type': 'ListItem',
    position: 3,
    name: post.title,
    item: `${SITE.URL}${post.slug}.html`,
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
export const getLogoStructured = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    url: SITE.URL,
    logo: AUTHOR.ICON,
  };
};
