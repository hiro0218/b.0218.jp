interface PropConstant {
  AUTHOR: string;
  AUTHOR_ICON: string;
  SITE_NAME: string;
  SITE_DESCRIPTION: string;
  SITE_URL: string;
  ADSENSE: {
    LAYOUT: string;
    FORMAT: string;
    CLIENT: string;
    SLOT: string;
  };
}

const CONSTANT: PropConstant = {
  AUTHOR: 'hiro',
  AUTHOR_ICON: 'https://b.0218.jp/hiro0218.png',
  SITE_NAME: '零弐壱蜂',
  SITE_DESCRIPTION: '様々な情報をストックするサイバーメモ帳',
  SITE_URL: 'https://b.0218.jp/',
  ADSENSE: {
    LAYOUT: 'in-article',
    FORMAT: 'fluid',
    CLIENT: 'ca-pub-7651142413133023',
    SLOT: '4045255408',
  },
};

export default CONSTANT;
