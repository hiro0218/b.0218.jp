import axios from 'axios';

export const constant = {
  AUTHOR: 'hiro',
  SITE_NAME: '零弐壱蜂',
  SITE_DESCRIPTION: '様々な情報をストックするサイバーメモ帳',
  SITE_URL: 'https://b.0218.jp/',
  ENDPOINT: 'https://b.0218.jp/wp-json/',
};

export const route = {
  paramns: {
    _fields: 'id,slug',
    per_page: 100,
  },
  getData() {
    return axios
      .all([
        axios.get(`${constant.ENDPOINT}wp/v2/posts`, { params: Object.assign(this.paramns, { per_page: 1000 }) }),
        axios.get(`${constant.ENDPOINT}wp/v2/tags`, { params: this.paramns }),
        axios.get(`${constant.ENDPOINT}wp/v2/categories`, { params: this.paramns }),
      ])
      .then(
        axios.spread(function(posts, tags, categories) {
          let post_route = [...posts.data].map(post => {
            return {
              route: post.slug.replace('.html', ''),
            };
          });

          let tag_route = [...tags.data].map(tags => {
            return {
              route: `/tag/${tags.slug}`,
            };
          });

          let category_route = [...categories.data].map(categories => {
            return {
              route: `/category/${categories.slug}`,
            };
          });

          return [...post_route, ...tag_route, ...category_route];
        }),
      );
  },
};
