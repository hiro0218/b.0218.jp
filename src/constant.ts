export const AUTHOR_NAME = 'hiro';
export const AUTHOR_ICON = 'https://b.0218.jp/hiro0218.png';

export const SITE_NAME = '零弐壱蜂';
export const SITE_DESCRIPTION = '様々な情報をストックするサイバーメモ帳';
export const SITE_URL = 'https://b.0218.jp';

export const URL = {
  TWITTER: 'https://twitter.com/hiro0218',
  GITHUB: 'https://github.com/hiro0218',
  NPM: 'https://www.npmjs.com/~hiro0218',
  QIITA: 'https://qiita.com/hiro0218',
  ZENN: 'https://zenn.dev/hiro',
} as const;

export const READ_TIME_SUFFIX = 'min read';

export const BREAKPOINT = 992;

export const FILENAME_POSTS = 'posts';
export const FILENAME_POSTS_LIST = 'posts-list';
export const FILENAME_PAGES = 'pages';
export const FILENAME_TAG_SIMILARITY = 'tags-similarity';
export const FILENAME_POSTS_SIMILARITY = 'posts-similarity';
export const FILENAME_POSTS_POPULAR = 'posts-popular';

/**
 * タグ一覧を生成するために必要なタグ件数
 */
export const TAG_VIEW_LIMIT = 3;

/**
 * Google AdSense
 */
export const GOOGLE_ADSENSE = {
  LAYOUT: 'in-article',
  FORMAT: 'fluid',
  /** パブリッシャー ID */
  CLIENT: 'ca-pub-7651142413133023',
  /** 広告ユニット ID */
  SLOT: '4045255408',
} as const;
