export const AUTHOR_NAME = 'hiro';
export const AUTHOR_ICON = 'https://b.0218.jp/hiro0218.png';

export const SCREEN_IMAGE = 'https://b.0218.jp/hiro0218_screen.png';

export const SITE_NAME = '零弐壱蜂';
export const SITE_DESCRIPTION = '様々な情報をストックするサイバーメモ帳';
export const SITE_URL = 'https://b.0218.jp';

export const URL = {
  twitter: 'https://twitter.com/hiro0218',
  github: 'https://github.com/hiro0218',
  npm: 'https://www.npmjs.com/~hiro0218',
  qiita: 'https://qiita.com/hiro0218',
  zenn: 'https://zenn.dev/hiro',
  codepen: 'https://codepen.io/hiro0218',
  speakerdeck: 'https://speakerdeck.com/hiro0218',
} as const;

export const X_ACCOUNT = 'hiro0218';

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
  // biome-ignore lint/style/useNamingConvention: UPPER
  LAYOUT: 'in-article',
  // biome-ignore lint/style/useNamingConvention: UPPER
  FORMAT: 'fluid',
  /** パブリッシャー ID */
  // biome-ignore lint/style/useNamingConvention: UPPER
  CLIENT: 'ca-pub-7651142413133023',
  /** 広告ユニット ID */
  // biome-ignore lint/style/useNamingConvention: UPPER
  SLOT: '4045255408',
} as const;
