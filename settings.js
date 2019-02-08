import axios from 'axios';

export const constant = {
  AUTHOR: 'hiro',
  AUTHOR_ICON: 'https://b.0218.jp/hiro0218.png',
  SITE_NAME: '零弐壱蜂',
  SITE_DESCRIPTION: '様々な情報をストックするサイバーメモ帳',
  SITE_URL: 'https://b.0218.jp/',
  ENDPOINT: 'https://content.b.0218.jp/wp-json/',
};

export const route = {
  async getData() {
    return await axios
      .get(`${constant.ENDPOINT}wp/v2/posts`, {
        params: {
          _fields: 'id,slug',
          per_page: 1000,
        },
      })
      .then(res => res.data);
  },
};
