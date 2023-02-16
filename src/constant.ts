const SITE_URL = 'https://b.0218.jp/';

export const AUTHOR = {
  NAME: 'hiro',
  ICON: 'https://b.0218.jp/hiro0218.png',
  ICON_LOCAL: '/hiro0218.png',
  PROFILE: 'Web Frontend Engineer / ex: Web Backend Engineer, Application Engineer',
} as const;

export const SITE = {
  NAME: '零弐壱蜂',
  DESCRIPTION: '様々な情報をストックするサイバーメモ帳',
  URL: SITE_URL,
} as const;

export const URL = {
  SITE: SITE_URL,
  TWITTER: 'https://twitter.com/hiro0218',
  GITHUB: 'https://github.com/hiro0218',
  NPM: 'https://www.npmjs.com/~hiro0218',
  QIITA: 'https://qiita.com/hiro0218',
  ZENN: 'https://zenn.dev/hiro',
} as const;

export const FILENAME_POSTS = 'posts';
export const FILENAME_POSTS_LIST = 'posts-list';
export const FILENAME_PAGES = 'pages';
