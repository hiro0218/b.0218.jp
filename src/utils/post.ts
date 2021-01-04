import { Post } from '~/types/source';
import { getBlogPostingStructured, getBreadcrumbStructured } from '~/utils/json-ld';
import CONSTANT from '~~/constant';

const getOgImagePath = (slug: string): string => {
  if (!slug) return '';

  const filename = slug.replace('.html', '');
  return slug ? `https://hiro0218.github.io/blog/images/ogp/${filename}.png` : CONSTANT.AUTHOR_ICON;
};

const isEmbededTweet = (content: string): boolean => {
  return content.includes('blockquote class="twitter-tweet"');
};

export const postMeta = (post: Post, isDev: boolean) => {
  return {
    title: post.title,
    titleTemplate: undefined,
    meta: [
      { hid: 'description', name: 'description', content: post.excerpt },
      { hid: 'og:type', property: 'og:type', content: 'article' },
      { hid: 'og:url', property: 'og:url', content: `${CONSTANT.SITE_URL}${post.path}` },
      { hid: 'og:title', property: 'og:title', content: post.title },
      { hid: 'og:description', property: 'og:description', content: post.excerpt },
      {
        hid: 'og:image',
        property: 'og:image',
        content: getOgImagePath(post.path),
      },
      { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
      { hid: 'og:updated_time', property: 'og:updated_time', content: post.updated },
      { hid: 'article:published_time', property: 'article:published_time', content: post.date },
      { hid: 'article:modified_time', property: 'article:modified_time', content: post.updated },
    ],
    link: [{ rel: 'canonical', href: `${CONSTANT.SITE_URL}${post.path}` }],
    __dangerouslyDisableSanitizers: ['script'],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(getBlogPostingStructured(post)),
      },
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(getBreadcrumbStructured(post)),
      },
      // Google Adsense
      {
        src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
        async: true,
        skip: isDev,
      },
      {
        innerHTML: '(adsbygoogle = window.adsbygoogle || []).push({});',
        skip: isDev,
      },
      // Twitter
      {
        src: 'https://platform.twitter.com/widgets.js',
        async: true,
        skip: !isEmbededTweet(post.content),
      },
    ],
  };
};
